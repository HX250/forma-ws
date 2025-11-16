import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
  AuthResponse,
  Client,
  Coach,
  AuthPayload,
} from '@forma-ws/domain';
import { JwtAuthGuard } from '@forma-ws/backend-shared';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponse> {
    return this.authService.login(dto, res);
  }

  @Post('register/coach')
  async registerCoach(
    @Body() dto: RegisterCoachDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Coach> {
    return this.authService.registerCoach(dto, res);
  }

  @Post('register/client')
  async registerClient(@Body() dto: RegisterClientDto): Promise<Client> {
    return this.authService.registerClient(dto);
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  async setPassword(
    @CurrentUser() user: AuthPayload,
    @Body() dto: SetClientPasswordDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Client> {
    return this.authService.setClientPassword(user.sub, dto, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponse> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    return this.authService.refreshTokens(refreshToken, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    await this.authService.logout(res);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @CurrentUser() user: AuthPayload
  ): Promise<Client | Coach> {
    return this.authService.getCurrentUser(user);
  }
}
