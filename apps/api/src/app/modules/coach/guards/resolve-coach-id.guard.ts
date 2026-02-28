import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CoachService } from '../coach.service';

@Injectable()
export class ResolveCoachIdGuard implements CanActivate {
  constructor(private readonly coachService: CoachService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    request.resolvedCoachId = await this.coachService.resolveCoachId(
      user.sub,
      user.userType
    );
    return true;
  }
}
