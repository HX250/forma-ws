import { UserType } from '@forma-ws/domain';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class ClientOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.userType !== UserType.CLIENT) {
      throw new ForbiddenException('Only clients can access this resource');
    }

    return true;
  }
}
