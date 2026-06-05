import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  attachAuditLogMetadata,
  diffAuditValues,
} from 'src/v1/log/utils/audit-log-metadata.util';
import { DeepPartial, In, Repository } from 'typeorm';
import { CreateRoomTypeDto } from '../dto/create-room-type.dto';
import { UpdateRoomTypeDto } from '../dto/update-room-type.dto';
import { RoomCharacteristic } from '../entities/room-characteristic.entity';
import { RoomTypeCharacteristic } from '../entities/room-type-characteristic.entity';
import { RoomType } from '../entities/room-type.entity';
import { RoomStatus } from '../entities/room.entity';
import { Hotel } from 'src/v1/hotel/entities/hotel.entity';

@Injectable()
export class RoomTypeService {
  private readonly logger = new Logger(RoomTypeService.name);

  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(RoomCharacteristic)
    private roomCharacteristicRepository: Repository<RoomCharacteristic>,
    @InjectRepository(RoomTypeCharacteristic)
    private roomTypeCharacteristicRepository: Repository<RoomTypeCharacteristic>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async create(
    hotelId: string,
    createRoomTypeDto: CreateRoomTypeDto,
  ): Promise<RoomType> {
    await this.assertHotelExists(hotelId);

    const { roomCharacteristicIds, areaInSquareFeet, ...rest } =
      createRoomTypeDto;

    const roomType = this.roomTypeRepository.create({
      ...rest,
      hotelId,
      areaInSquareFeet: String(areaInSquareFeet),
    } as DeepPartial<RoomType>);
    const savedRoomType = await this.roomTypeRepository.save(roomType);

    if (roomCharacteristicIds?.length) {
      await this.syncCharacteristics(savedRoomType.id, roomCharacteristicIds);
    }

    this.logger.log(
      `Room type '${savedRoomType.id}' created for hotel '${hotelId}'`,
    );

    return this.findOneOrFail(savedRoomType.id);
  }

  async findAllCharacteristics(): Promise<RoomCharacteristic[]> {
    return this.roomCharacteristicRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findAllByHotel(hotelId: string): Promise<RoomType[]> {
    await this.assertHotelExists(hotelId);

    const roomTypes = await this.roomTypeRepository
      .createQueryBuilder('roomType')
      .where('roomType.hotelId = :hotelId', { hotelId })
      .leftJoinAndSelect(
        'roomType.roomTypeCharacteristics',
        'roomTypeCharacteristic',
      )
      .leftJoinAndSelect(
        'roomTypeCharacteristic.roomCharacteristic',
        'roomCharacteristic',
      )
      .loadRelationCountAndMap(
        'roomType.availableRoomsCount',
        'roomType.rooms',
        'room',
        (qb) =>
          qb.where('room.status = :status', { status: RoomStatus.AVAILABLE }),
      )
      .orderBy('roomType.createdAt', 'DESC')
      .getMany();

    return roomTypes;
  }

  async update(
    hotelId: string,
    roomTypeId: string,
    updateRoomTypeDto: UpdateRoomTypeDto,
  ): Promise<RoomType> {
    await this.assertHotelExists(hotelId);

    const existingRoomType = await this.roomTypeRepository.findOne({
      where: { id: roomTypeId, hotelId },
    });

    if (!existingRoomType) {
      throw new NotFoundException(
        `Room type with ID '${roomTypeId}' not found in hotel '${hotelId}'`,
      );
    }

    const { roomCharacteristicIds, areaInSquareFeet, ...rest } =
      updateRoomTypeDto;

    const preloadPayload: DeepPartial<RoomType> = {
      id: roomTypeId,
      ...rest,
      ...(areaInSquareFeet !== undefined && {
        areaInSquareFeet: String(areaInSquareFeet),
      }),
    };

    const updatedRoomType =
      await this.roomTypeRepository.preload(preloadPayload);

    if (!updatedRoomType) {
      throw new NotFoundException(
        `Room type with ID '${roomTypeId}' not found`,
      );
    }

    const savedRoomType = await this.roomTypeRepository.save(updatedRoomType);

    if (roomCharacteristicIds !== undefined) {
      await this.syncCharacteristics(roomTypeId, roomCharacteristicIds);
    }

    attachAuditLogMetadata(
      savedRoomType,
      diffAuditValues(
        existingRoomType,
        savedRoomType,
        Object.keys(updateRoomTypeDto),
      ),
    );

    this.logger.log(`Room type '${roomTypeId}' updated`);

    return this.findOneOrFail(roomTypeId);
  }

  async remove(hotelId: string, roomTypeId: string): Promise<void> {
    await this.assertHotelExists(hotelId);

    const roomType = await this.roomTypeRepository.findOne({
      where: { id: roomTypeId, hotelId },
    });

    if (!roomType) {
      throw new NotFoundException(
        `Room type with ID '${roomTypeId}' not found in hotel '${hotelId}'`,
      );
    }

    await this.roomTypeRepository.remove(roomType);
    this.logger.log(
      `Room type '${roomTypeId}' deleted from hotel '${hotelId}'`,
    );
  }

  private async findOneOrFail(roomTypeId: string): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id: roomTypeId },
      relations: [
        'roomTypeCharacteristics',
        'roomTypeCharacteristics.roomCharacteristic',
      ],
    });

    if (!roomType) {
      throw new NotFoundException(
        `Room type with ID '${roomTypeId}' not found`,
      );
    }

    return roomType;
  }

  private async assertHotelExists(hotelId: string): Promise<void> {
    const exists = await this.hotelRepository.existsBy({ id: hotelId });
    if (!exists) {
      throw new NotFoundException(`Hotel with ID '${hotelId}' not found`);
    }
  }

  /**
   * Full-replace sync: removes any existing characteristics for the room type
   * and inserts the new set. Passing an empty array clears all characteristics.
   */
  private async syncCharacteristics(
    roomTypeId: string,
    characteristicIds: string[],
  ): Promise<void> {
    if (characteristicIds.length) {
      const found = await this.roomCharacteristicRepository.find({
        where: { id: In(characteristicIds) },
        select: ['id'],
      });

      if (found.length !== characteristicIds.length) {
        const foundIds = new Set(found.map((c) => c.id));
        const missing = characteristicIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(
          `Room characteristic(s) not found: ${missing.join(', ')}`,
        );
      }
    }

    await this.roomTypeCharacteristicRepository.delete({ roomTypeId });

    if (characteristicIds.length) {
      const entries = this.roomTypeCharacteristicRepository.create(
        characteristicIds.map((roomCharacteristicId) => ({
          roomTypeId,
          roomCharacteristicId,
        })),
      );
      await this.roomTypeCharacteristicRepository.save(entries);
    }
  }
}
