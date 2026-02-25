import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@forma-ws/backend-shared';
import { WaterService } from './water.service';
import {
  AuthPayload,
  GetWaterData,
  WaterData,
  AddWaterData,
  DeleteWaterData,
} from '@forma-ws/domain';
import { CurrentUser } from '../../../security/common/decorators/current-user.decorator';

@Controller('tracking/water')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Get()
  async getWaterTrackingData(@Query() dto: GetWaterData): Promise<WaterData[]> {
    return this.waterService.getWaterTrackingData(dto);
  }

  @Post()
  async logWaterTrackingData(
    @CurrentUser() user: AuthPayload,
    @Body() dto: AddWaterData
  ): Promise<boolean> {
    dto.clientId = user.sub;
    return this.waterService.logWaterTrackingData(dto);
  }

  @Delete()
  async removeWaterEntry(
    @CurrentUser() user: AuthPayload,
    @Query() dto: DeleteWaterData
  ): Promise<boolean> {
    dto.clientId = user.sub;
    return this.waterService.removeWaterEntry(dto);
  }
}
