import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  JwtAuthGuard,
  LoginDto,
  RefreshTokenDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
} from '@forma-ws/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register/coach')
  async registerCoach(
    @Body() registerDto: RegisterCoachDto
  ): Promise<AuthResponseDto> {
    return this.authService.registerCoach(registerDto);
  }

  @Post('register/client')
  async registerClient(
    @Body() registerDto: RegisterClientDto
  ): Promise<AuthResponseDto> {
    return this.authService.registerClient(registerDto);
  }

  @Post('client/set-password')
  @UseGuards(JwtAuthGuard)
  async setClientPassword(
    @Req() req: Request,
    @Body() setPasswordDto: SetClientPasswordDto
  ): Promise<AuthResponseDto> {
    const clientId = req.user['sub'];
    return this.authService.setClientPassword(clientId, setPasswordDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }
}
