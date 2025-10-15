import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from '../../auth';

@Injectable()
export class CoachOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.userType !== UserType.COACH) {
      throw new ForbiddenException('Only coaches can access this resource');
    }

    return true;
  }
}
