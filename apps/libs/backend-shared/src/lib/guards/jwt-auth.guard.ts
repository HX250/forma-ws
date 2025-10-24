import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = request.cookies['accessToken'];
    if (!accessToken) {
      throw new UnauthorizedException('Access token cookie missing');
    }

    request.headers['authorization'] = `Bearer ${accessToken}`;

    return super.canActivate(context);
  }
}
