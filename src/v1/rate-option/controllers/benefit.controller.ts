import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/v1/auth/guards/permissions.guard';
import { RateOptionService } from '../services/rate-option.service';
import { Public } from 'src/v1/auth/decorators/public.decorator';

@Controller({ path: 'benefits', version: '1' })
@UseGuards(PermissionsGuard)
@ApiBearerAuth('jwt-auth')
export class BenefitController {
  constructor(private readonly rateOptionService: RateOptionService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all benefits' })
  async findAll() {
    return this.rateOptionService.findAllBenefits();
  }
}
