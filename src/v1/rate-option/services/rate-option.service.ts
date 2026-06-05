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
import { DeepPartial, In, Repository } from 'typeorm';
import { RoomType } from 'src/v1/room/entities/room-type.entity';
import { Benefit } from '../entities/benefit.entity';
import { RateOptionBenefit } from '../entities/rate-option-benefit.entity';
import { RateOption } from '../entities/rate-option.entity';
import { CreateRateOptionDto } from '../dto/create-rate-option.dto';
import { UpdateRateOptionDto } from '../dto/update-rate-option.dto';
import { ManageRateOptionBenefitsDto } from '../dto/manage-rate-option-benefits.dto';

@Injectable()
export class RateOptionService {
  private readonly logger = new Logger(RateOptionService.name);

  constructor(
    @InjectRepository(RateOption)
    private rateOptionRepository: Repository<RateOption>,
    @InjectRepository(RateOptionBenefit)
    private rateOptionBenefitRepository: Repository<RateOptionBenefit>,
    @InjectRepository(Benefit)
    private benefitRepository: Repository<Benefit>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
  ) {}

  async create(
    roomTypeId: string,
    createRateOptionDto: CreateRateOptionDto,
  ): Promise<RateOption> {
    await this.assertRoomTypeExists(roomTypeId);

    const { pricePerNight, ...rest } = createRateOptionDto;

    const rateOption = this.rateOptionRepository.create({
      ...rest,
      roomTypeId,
      pricePerNight: String(pricePerNight),
    } as DeepPartial<RateOption>);

    const savedRateOption = await this.rateOptionRepository.save(rateOption);
    this.logger.log(
      `Rate option '${savedRateOption.id}' created for room type '${roomTypeId}'`,
    );

    return this.findOneOrFail(savedRateOption.id);
  }

  async findAllByRoomType(roomTypeId: string): Promise<RateOption[]> {
    await this.assertRoomTypeExists(roomTypeId);

    return this.rateOptionRepository
      .createQueryBuilder('rateOption')
      .where('rateOption.roomTypeId = :roomTypeId', { roomTypeId })
      .leftJoinAndSelect('rateOption.rateOptionBenefits', 'rateOptionBenefit')
      .leftJoinAndSelect('rateOptionBenefit.benefit', 'benefit')
      .orderBy('rateOption.createdAt', 'DESC')
      .getMany();
  }

  async update(
    roomTypeId: string,
    rateOptionId: string,
    updateRateOptionDto: UpdateRateOptionDto,
  ): Promise<RateOption> {
    await this.assertRoomTypeExists(roomTypeId);

    const existingRateOption = await this.rateOptionRepository.findOne({
      where: { id: rateOptionId, roomTypeId },
    });

    if (!existingRateOption) {
      throw new NotFoundException(
        `Rate option with ID '${rateOptionId}' not found in room type '${roomTypeId}'`,
      );
    }

    const { pricePerNight, ...rest } = updateRateOptionDto;

    const preloadPayload: DeepPartial<RateOption> = {
      id: rateOptionId,
      ...rest,
      ...(pricePerNight !== undefined && {
        pricePerNight: String(pricePerNight),
      }),
    };

    const updatedRateOption =
      await this.rateOptionRepository.preload(preloadPayload);

    if (!updatedRateOption) {
      throw new NotFoundException(
        `Rate option with ID '${rateOptionId}' not found`,
      );
    }

    const savedRateOption =
      await this.rateOptionRepository.save(updatedRateOption);

    attachAuditLogMetadata(
      savedRateOption,
      diffAuditValues(
        existingRateOption,
        savedRateOption,
        Object.keys(updateRateOptionDto),
      ),
    );

    this.logger.log(`Rate option '${rateOptionId}' updated`);

    return this.findOneOrFail(rateOptionId);
  }

  async remove(roomTypeId: string, rateOptionId: string): Promise<void> {
    await this.assertRoomTypeExists(roomTypeId);

    const rateOption = await this.rateOptionRepository.findOne({
      where: { id: rateOptionId, roomTypeId },
    });

    if (!rateOption) {
      throw new NotFoundException(
        `Rate option with ID '${rateOptionId}' not found in room type '${roomTypeId}'`,
      );
    }

    await this.rateOptionRepository.remove(rateOption);
    this.logger.log(
      `Rate option '${rateOptionId}' deleted from room type '${roomTypeId}'`,
    );
  }

  async addBenefits(
    roomTypeId: string,
    rateOptionId: string,
    dto: ManageRateOptionBenefitsDto,
  ): Promise<RateOption> {
    await this.assertRateOptionBelongsToRoomType(rateOptionId, roomTypeId);

    // Validate all benefit IDs exist
    const benefits = await this.benefitRepository.find({
      where: { id: In(dto.benefitIds) },
      select: ['id'],
    });

    if (benefits.length !== dto.benefitIds.length) {
      const foundIds = new Set(benefits.map((b) => b.id));
      const missing = dto.benefitIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `Benefit(s) not found: ${missing.join(', ')}`,
      );
    }

    // Find already-linked benefits to avoid unique constraint violations
    const existingLinks = await this.rateOptionBenefitRepository.find({
      where: {
        rateOptionId,
        benefitId: In(dto.benefitIds),
      },
      select: ['benefitId'],
    });

    const alreadyLinked = new Set(existingLinks.map((l) => l.benefitId));
    const duplicates = dto.benefitIds.filter((id) => alreadyLinked.has(id));

    if (duplicates.length) {
      throw new ConflictException(
        `Benefit(s) already linked to this rate option: ${duplicates.join(', ')}`,
      );
    }

    const entries = this.rateOptionBenefitRepository.create(
      dto.benefitIds.map((benefitId) => ({ rateOptionId, benefitId })),
    );
    await this.rateOptionBenefitRepository.save(entries);

    this.logger.log(
      `Added ${dto.benefitIds.length} benefit(s) to rate option '${rateOptionId}'`,
    );

    return this.findOneOrFail(rateOptionId);
  }

  async removeBenefits(
    roomTypeId: string,
    rateOptionId: string,
    dto: ManageRateOptionBenefitsDto,
  ): Promise<RateOption> {
    await this.assertRateOptionBelongsToRoomType(rateOptionId, roomTypeId);

    const existingLinks = await this.rateOptionBenefitRepository.find({
      where: {
        rateOptionId,
        benefitId: In(dto.benefitIds),
      },
    });

    if (existingLinks.length !== dto.benefitIds.length) {
      const foundIds = new Set(existingLinks.map((l) => l.benefitId));
      const missing = dto.benefitIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `Benefit(s) not linked to this rate option: ${missing.join(', ')}`,
      );
    }

    await this.rateOptionBenefitRepository.remove(existingLinks);

    this.logger.log(
      `Removed ${dto.benefitIds.length} benefit(s) from rate option '${rateOptionId}'`,
    );

    return this.findOneOrFail(rateOptionId);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async findOneOrFail(rateOptionId: string): Promise<RateOption> {
    const rateOption = await this.rateOptionRepository.findOne({
      where: { id: rateOptionId },
      relations: ['rateOptionBenefits', 'rateOptionBenefits.benefit'],
    });

    if (!rateOption) {
      throw new NotFoundException(
        `Rate option with ID '${rateOptionId}' not found`,
      );
    }

    return rateOption;
  }

  private async assertRoomTypeExists(roomTypeId: string): Promise<void> {
    const exists = await this.roomTypeRepository.existsBy({ id: roomTypeId });
    if (!exists) {
      throw new NotFoundException(
        `Room type with ID '${roomTypeId}' not found`,
      );
    }
  }

  private async assertRateOptionBelongsToRoomType(
    rateOptionId: string,
    roomTypeId: string,
  ): Promise<void> {
    const exists = await this.rateOptionRepository.existsBy({
      id: rateOptionId,
      roomTypeId,
    });
    if (!exists) {
      throw new NotFoundException(
        `Rate option with ID '${rateOptionId}' not found in room type '${roomTypeId}'`,
      );
    }
  }
}
