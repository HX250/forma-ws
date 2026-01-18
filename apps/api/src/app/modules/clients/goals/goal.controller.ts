import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '@forma-ws/backend-shared';
import {
  ClientGoalDto,
  ClientGoalResponse,
  ClientTrackingGoalResponse,
} from '@forma-ws/domain';
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

  @Post()
  async createOrUpdateGoal(
    @Query('clientId') clientId: string,
    @Body() dto: ClientGoalDto
  ) {
    return this.goalsService.createOrUpdateGoal(clientId, dto);
  }
}
