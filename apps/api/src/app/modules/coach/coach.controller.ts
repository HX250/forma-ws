import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  Body,
} from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard, CoachOnlyGuard } from '@forma-ws/backend-shared';
import {
  AuthPayload,
  CoachPersonalProfile,
  CoachProfessionalProfile,
  CoachAvailabilityProfile,
  UpdateCoachPersonalDto,
  UpdateCoachProfessionalDto,
  UpdateCoachAvailabilityDto,
} from '@forma-ws/domain';
import { CoachService } from './coach.service';
import { CurrentUser } from '../security/common/decorators/current-user.decorator';
import { ResolveCoachIdGuard } from './guards/resolve-coach-id.guard';
import { ResolvedCoachId } from './decorators/resolved-coach-id.decorator';

const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
} as const;

@Controller('coach')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get('profile/personal')
  @UseGuards(ResolveCoachIdGuard)
  getPersonalProfile(
    @ResolvedCoachId() coachId: string
  ): Promise<CoachPersonalProfile> {
    return this.coachService.getPersonalProfile(coachId);
  }

  @Put('profile/personal')
  @UseGuards(CoachOnlyGuard)
  updatePersonalProfile(
    @CurrentUser() user: AuthPayload,
    @Body() dto: UpdateCoachPersonalDto
  ): Promise<CoachPersonalProfile> {
    return this.coachService.updatePersonalProfile(user.sub, dto);
  }

  @Get('profile/professional')
  @UseGuards(ResolveCoachIdGuard)
  getProfessionalProfile(
    @ResolvedCoachId() coachId: string
  ): Promise<CoachProfessionalProfile> {
    return this.coachService.getProfessionalProfile(coachId);
  }

  @Put('profile/professional')
  @UseGuards(CoachOnlyGuard)
  updateProfessionalProfile(
    @CurrentUser() user: AuthPayload,
    @Body() dto: UpdateCoachProfessionalDto
  ): Promise<CoachProfessionalProfile> {
    return this.coachService.updateProfessionalProfile(user.sub, dto);
  }

  @Get('profile/availability')
  @UseGuards(ResolveCoachIdGuard)
  getAvailabilityProfile(
    @ResolvedCoachId() coachId: string
  ): Promise<CoachAvailabilityProfile> {
    return this.coachService.getAvailabilityProfile(coachId);
  }

  @Put('profile/availability')
  @UseGuards(CoachOnlyGuard)
  updateAvailabilityProfile(
    @CurrentUser() user: AuthPayload,
    @Body() dto: UpdateCoachAvailabilityDto
  ): Promise<CoachAvailabilityProfile> {
    return this.coachService.updateAvailabilityProfile(user.sub, dto);
  }

  @Delete('account')
  @UseGuards(CoachOnlyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(
    @CurrentUser() user: AuthPayload,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    await this.coachService.deleteAccount(user.sub);
    res.clearCookie('accessToken', TOKEN_COOKIE_OPTIONS);
    res.clearCookie('refreshToken', TOKEN_COOKIE_OPTIONS);
  }
}
