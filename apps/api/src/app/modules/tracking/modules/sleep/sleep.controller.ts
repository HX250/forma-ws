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
  GetSleepEntryDto,
  SleepEntryData,
  AddSleepEntryDto,
  DeleteSleepEntryDto,
} from '@forma-ws/domain';

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
  async logSleepEntry(@Body() dto: AddSleepEntryDto): Promise<boolean> {
    return this.sleepService.logSleepEntry(dto);
  }

  @Delete()
  async removeSleepEntry(@Query() dto: DeleteSleepEntryDto): Promise<boolean> {
    return this.sleepService.removeSleepEntry(dto);
  }
}
