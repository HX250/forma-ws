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

@Controller('coach')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get('profile/personal')
  async getPersonalProfile(
    @CurrentUser() user: AuthPayload
  ): Promise<CoachPersonalProfile> {
    const coachId = await this.coachService.resolveCoachId(
      user.sub,
      user.userType
    );
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
  async getProfessionalProfile(
    @CurrentUser() user: AuthPayload
  ): Promise<CoachProfessionalProfile> {
    const coachId = await this.coachService.resolveCoachId(
      user.sub,
      user.userType
    );
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
  async getAvailabilityProfile(
    @CurrentUser() user: AuthPayload
  ): Promise<CoachAvailabilityProfile> {
    const coachId = await this.coachService.resolveCoachId(
      user.sub,
      user.userType
    );
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
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }
}
