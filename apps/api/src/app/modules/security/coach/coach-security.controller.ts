import {
  Controller,
  Post,
  Body,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { CoachSecurityService } from './coach-security.service';
import { TokenService } from '../common/token/token.service';
import { RegisterCoachDto, Coach, UserType } from '@forma-ws/domain';

@Controller('auth/register')
@UseInterceptors(ClassSerializerInterceptor)
export class CoachSecurityController {
  constructor(
    private readonly coachSecurityService: CoachSecurityService,
    private readonly tokenService: TokenService
  ) {}

  @Post('coach')
  async registerCoach(
    @Body() dto: RegisterCoachDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Coach> {
    const coach = await this.coachSecurityService.registerCoach(dto);

    const payload = this.tokenService.createAuthPayload(
      coach.id,
      coach.email,
      UserType.COACH
    );

    this.tokenService.generateAndSetTokens(payload, res);

    return coach;
  }
}
