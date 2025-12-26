import { DatabaseService } from '@forma-ws/backend-shared';
import { CoachEnablePermissionDto } from '@forma-ws/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoachService {
  constructor(private readonly prisma: DatabaseService) {}
}
