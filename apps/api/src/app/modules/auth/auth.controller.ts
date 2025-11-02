import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
  AuthPayload,
} from '@forma-ws/domain';
import { JwtAuthGuard } from '@forma-ws/backend-shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthPayload> {
    return this.authService.login(loginDto, response);
  }

  @Post('register/coach')
  async registerCoach(
    @Body() registerDto: RegisterCoachDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthPayload> {
    return this.authService.registerCoach(registerDto, response);
  }

  @Post('register/client')
  async registerClient(
    @Body() registerDto: RegisterClientDto
  ): Promise<{ userId: string }> {
    return this.authService.registerClient(registerDto);
  }

  @Post('client/set-password')
  @UseGuards(JwtAuthGuard)
  async setClientPassword(
    @Req() req: Request,
    @Body() setPasswordDto: SetClientPasswordDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthPayload> {
    const clientId = req.user['sub'];
    return this.authService.setClientPassword(
      clientId,
      setPasswordDto,
      response
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthPayload> {
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.authService.refreshTokens(refreshToken, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response): { success: boolean } {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @Req() req: { user: AuthPayload }
  ): Promise<AuthPayload> {
    return {
      sub: req.user.sub,
      email: req.user.email,
      userType: req.user.userType,
    };
  }
}
