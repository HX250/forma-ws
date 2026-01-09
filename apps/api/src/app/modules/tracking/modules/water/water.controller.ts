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
  GetWaterData,
  WaterData,
  AddWaterData,
  DeleteWaterData,
} from '@forma-ws/domain';

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
  async logWaterTrackingData(@Body() dto: AddWaterData): Promise<boolean> {
    return this.waterService.logWaterTrackingData(dto);
  }

  @Delete()
  async removeWaterEntry(@Query() dto: DeleteWaterData): Promise<boolean> {
    return this.waterService.removeWaterEntry(dto);
  }
}
