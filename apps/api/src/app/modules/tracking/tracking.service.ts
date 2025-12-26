import { DatabaseService } from '@forma-ws/backend-shared';
import { CoachEnablePermissionDto } from '@forma-ws/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: DatabaseService) {}

  async updatePermission(dto: CoachEnablePermissionDto): Promise<boolean> {
    try {
      await this.prisma.client.update({
        where: { id: dto.clientId },
        data: {
          [dto.permissionType]: dto.value,
        },
      });

      return true;
    } catch (error) {
      console.error('Error updating client permission:', error);
      throw error;
    }
  }
}
