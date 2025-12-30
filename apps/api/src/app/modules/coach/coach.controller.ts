import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
} from '@nestjs/common';

import { JwtAuthGuard } from '@forma-ws/backend-shared';
import { CoachEnablePermissionDto } from '@forma-ws/domain';
import { CoachService } from './coach.service';

@Controller('coach')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}
}
