import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  attachAuditLogMetadata,
  diffAuditValues,
} from 'src/v1/log/utils/audit-log-metadata.util';
import { DataSource, In, Repository } from 'typeorm';
import { CreateRoomDto } from '../dto/create-room.dto';
import { Room } from '../entities/room.entity';
import { RoomType } from '../entities/room-type.entity';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';
import { BulkCreateRoomDto } from '../dto/bulk-create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    private dataSource: DataSource,
  ) {}

  async create(hotelId: string, createRoomDto: CreateRoomDto): Promise<Room> {
    await this.assertHotelExists(hotelId);
    await this.assertRoomTypeBelongsToHotel(createRoomDto.roomTypeId, hotelId);
    await this.assertRoomNumberUnique(hotelId, createRoomDto.roomNumber);

    const room = this.roomRepository.create({
      ...createRoomDto,
      hotelId,
    });

    const savedRoom = await this.roomRepository.save(room);
    this.logger.log(
      `Room '${savedRoom.roomNumber}' created in hotel '${hotelId}'`,
    );

    return savedRoom;
  }

  async bulkCreate(
    hotelId: string,
    bulkCreateRoomDto: BulkCreateRoomDto,
  ): Promise<Room[]> {
    await this.assertHotelExists(hotelId);

    const { rooms: roomDtos } = bulkCreateRoomDto;

    // Validate all roomTypeIds belong to this hotel
    const uniqueRoomTypeIds = [...new Set(roomDtos.map((r) => r.roomTypeId))];
    const validRoomTypes = await this.roomTypeRepository.find({
      where: { id: In(uniqueRoomTypeIds), hotelId },
      select: ['id'],
    });

    if (validRoomTypes.length !== uniqueRoomTypeIds.length) {
      const validIds = new Set(validRoomTypes.map((rt) => rt.id));
      const invalidIds = uniqueRoomTypeIds.filter((id) => !validIds.has(id));
      throw new NotFoundException(
        `Room type(s) not found in hotel '${hotelId}': ${invalidIds.join(', ')}`,
      );
    }

    // Check for duplicate room numbers within the request itself
    const requestedNumbers = roomDtos.map((r) => r.roomNumber);
    const duplicatesInRequest = requestedNumbers.filter(
      (num, idx) => requestedNumbers.indexOf(num) !== idx,
    );
    if (duplicatesInRequest.length) {
      throw new ConflictException(
        `Duplicate room numbers in request: ${[...new Set(duplicatesInRequest)].join(', ')}`,
      );
    }

    // Check for conflicts with existing rooms
    const existingRooms = await this.roomRepository.find({
      where: { hotelId, roomNumber: In(requestedNumbers) },
      select: ['roomNumber'],
    });

    if (existingRooms.length) {
      const conflictingNumbers = existingRooms.map((r) => r.roomNumber);
      throw new ConflictException(
        `Room number(s) already exist in hotel: ${conflictingNumbers.join(', ')}`,
      );
    }

    const rooms = this.roomRepository.create(
      roomDtos.map((dto) => ({ ...dto, hotelId })),
    );

    const savedRooms = await this.roomRepository.save(rooms);
    this.logger.log(
      `Bulk created ${savedRooms.length} room(s) in hotel '${hotelId}'`,
    );

    return savedRooms;
  }

  async update(
    hotelId: string,
    roomId: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    await this.assertHotelExists(hotelId);

    const existingRoom = await this.roomRepository.findOne({
      where: { id: roomId, hotelId },
    });

    if (!existingRoom) {
      throw new NotFoundException(
        `Room with ID '${roomId}' not found in hotel '${hotelId}'`,
      );
    }

    if (
      updateRoomDto.roomTypeId &&
      updateRoomDto.roomTypeId !== existingRoom.roomTypeId
    ) {
      await this.assertRoomTypeBelongsToHotel(
        updateRoomDto.roomTypeId,
        hotelId,
      );
    }

    if (
      updateRoomDto.roomNumber &&
      updateRoomDto.roomNumber !== existingRoom.roomNumber
    ) {
      await this.assertRoomNumberUnique(
        hotelId,
        updateRoomDto.roomNumber,
        roomId,
      );
    }

    const updatedRoom = await this.roomRepository.preload({
      id: roomId,
      ...updateRoomDto,
    });

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID '${roomId}' not found`);
    }

    const savedRoom = await this.roomRepository.save(updatedRoom);

    attachAuditLogMetadata(
      savedRoom,
      diffAuditValues(existingRoom, savedRoom, Object.keys(updateRoomDto)),
    );

    this.logger.log(`Room '${roomId}' updated in hotel '${hotelId}'`);

    return savedRoom;
  }

  async remove(hotelId: string, roomId: string): Promise<void> {
    await this.assertHotelExists(hotelId);

    const room = await this.roomRepository.findOne({
      where: { id: roomId, hotelId },
    });

    if (!room) {
      throw new NotFoundException(
        `Room with ID '${roomId}' not found in hotel '${hotelId}'`,
      );
    }

    await this.roomRepository.remove(room);
    this.logger.log(`Room '${roomId}' deleted from hotel '${hotelId}'`);
  }

  private async assertHotelExists(hotelId: string): Promise<void> {
    const exists = await this.hotelRepository.existsBy({ id: hotelId });
    if (!exists) {
      throw new NotFoundException(`Hotel with ID '${hotelId}' not found`);
    }
  }

  private async assertRoomTypeBelongsToHotel(
    roomTypeId: string,
    hotelId: string,
  ): Promise<void> {
    const exists = await this.roomTypeRepository.existsBy({
      id: roomTypeId,
      hotelId,
    });
    if (!exists) {
      throw new NotFoundException(
        `Room type with ID '${roomTypeId}' not found in hotel '${hotelId}'`,
      );
    }
  }

  private async assertRoomNumberUnique(
    hotelId: string,
    roomNumber: string,
    excludeRoomId?: string,
  ): Promise<void> {
    const qb = this.roomRepository
      .createQueryBuilder('room')
      .where('room.hotelId = :hotelId', { hotelId })
      .andWhere('room.roomNumber = :roomNumber', { roomNumber });

    if (excludeRoomId) {
      qb.andWhere('room.id != :excludeRoomId', { excludeRoomId });
    }

    const exists = await qb.getExists();

    if (exists) {
      throw new ConflictException(
        `Room number '${roomNumber}' already exists in hotel '${hotelId}'`,
      );
    }
  }
}
