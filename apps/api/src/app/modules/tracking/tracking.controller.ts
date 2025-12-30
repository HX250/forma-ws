import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
} from '@nestjs/common';

import { JwtAuthGuard } from '@forma-ws/backend-shared';
import { TrackingService } from './tracking.service';
import { CoachEnablePermissionDto } from '@forma-ws/domain';

@Controller('tracking')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('updatePermission')
  async enableTrackingPermission(
    @Body() dto: CoachEnablePermissionDto
  ): Promise<boolean> {
    const client = await this.trackingService.updatePermission(dto);

    return client;
  }
}
