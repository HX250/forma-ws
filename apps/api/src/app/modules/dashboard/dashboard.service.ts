import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: DatabaseService) {}
}
