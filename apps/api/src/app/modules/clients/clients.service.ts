import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@forma-ws/backend-shared';
import { ClientTable } from '@forma-ws/domain';

@Injectable()
export class ClientsService {
  constructor(private clientRepository: ClientRepository) {}

  async getList(coachId: string): Promise<ClientTable[]> {
    const clients = await this.clientRepository.findByCoachId(coachId);
    return clients.map((client) => ({
      id: client.id!,
      firstName: client.firstName,
      lastName: client.lastName,
      canTrackExercise: client.canTrackExercise,
      canTrackSleep: client.canTrackSleep,
      canTrackNutrition: client.canTrackNutrition,
      canTrackWater: client.canTrackWater,
    }));
  }
}
