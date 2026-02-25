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
import { SleepService } from './sleep.service';
import {
  AuthPayload,
  GetSleepEntryDto,
  SleepEntryData,
  AddSleepEntryDto,
  DeleteSleepEntryDto,
} from '@forma-ws/domain';
import { CurrentUser } from '../../../security/common/decorators/current-user.decorator';

@Controller('tracking/sleep')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Get()
  async getSleepEntry(
    @Query() dto: GetSleepEntryDto
  ): Promise<SleepEntryData | null> {
    return this.sleepService.getSleepEntry(dto);
  }

  @Post()
  async logSleepEntry(
    @CurrentUser() user: AuthPayload,
    @Body() dto: AddSleepEntryDto
  ): Promise<boolean> {
    dto.clientId = user.sub;
    return this.sleepService.logSleepEntry(dto);
  }

  @Delete()
  async removeSleepEntry(
    @CurrentUser() user: AuthPayload,
    @Query() dto: DeleteSleepEntryDto
  ): Promise<boolean> {
    dto.clientId = user.sub;
    return this.sleepService.removeSleepEntry(dto);
  }
}
