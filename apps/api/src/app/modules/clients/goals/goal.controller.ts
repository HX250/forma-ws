import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard, CoachOnlyGuard } from '@forma-ws/backend-shared';
import { ClientGoalDto, ClientGoalResponse } from '@forma-ws/domain';
import { GoalsService } from './goal.service';

@Controller('client-goals')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  async getClientTrackingGoals(
    @Query('clientId') clientId: string
  ): Promise<ClientGoalResponse> {
    return this.goalsService.getClientTrackingGoals(clientId);
  }

  @UseGuards(CoachOnlyGuard)
  @Post()
  async createOrUpdateGoal(
    @Query('clientId') clientId: string,
    @Body() dto: ClientGoalDto
  ) {
    return this.goalsService.createOrUpdateGoal(clientId, dto);
  }
}
