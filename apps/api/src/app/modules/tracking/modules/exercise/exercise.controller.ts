import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '@forma-ws/backend-shared';
import { ExerciseService } from './exercise.service';
import { ExerciseEntryDto } from '@forma-ws/domain';

@Controller('tracking/exercise')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('search')
  async searchExercises(@Query('q') query: string) {
    return this.exerciseService.searchExercises(query);
  }

  @Get(':id')
  async getExercise(@Param('id') id: string) {
    return this.exerciseService.getExerciseById(id);
  }

  @Get()
  async getExerciseData(
    @Query('clientId') clientId: string,
    @Query('date') date: string
  ) {
    return this.exerciseService.getExerciseTrackingData(
      clientId,
      new Date(date)
    );
  }

  @Post('/entries')
  async logEntry(
    @Query('clientId') clientId: string,
    @Body() dto: ExerciseEntryDto
  ) {
    return this.exerciseService.logExerciseEntry(dto, clientId);
  }

  @Delete('/entries/:entryId')
  async deleteEntry(
    @Param('entryId') entryId: string,
    @Query('clientId') clientId: string
  ) {
    return this.exerciseService.deleteExerciseEntry(entryId, clientId);
  }
}
