import { Test, TestingModule } from '@nestjs/testing';
import { TrackingService } from './tracking.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { PermissionsEnum } from '@forma-ws/domain';
import { createMockDatabaseService } from '../../../testing/common-mocks';

describe('TrackingService', () => {
  let service: TrackingService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updatePermission', () => {
    it('should update client tracking permission successfully', async () => {
      const dto = {
        clientId: 'client-123',
        permissionType: PermissionsEnum.CAN_TRACK_EXERCISE,
        value: true,
      };

      mockDatabaseService.client.update.mockResolvedValue({});

      const result = await service.updatePermission(dto);

      expect(result).toBe(true);
      expect(mockDatabaseService.client.update).toHaveBeenCalledWith({
        where: { id: dto.clientId },
        data: {
          [dto.permissionType]: dto.value,
        },
      });
    });

    it('should update permission to false', async () => {
      const dto = {
        clientId: 'client-123',
        permissionType: PermissionsEnum.CAN_TRACK_SLEEP,
        value: false,
      };

      mockDatabaseService.client.update.mockResolvedValue({});

      const result = await service.updatePermission(dto);

      expect(result).toBe(true);
      expect(mockDatabaseService.client.update).toHaveBeenCalledWith({
        where: { id: dto.clientId },
        data: {
          canTrackSleep: false,
        },
      });
    });

    it('should handle database errors and rethrow', async () => {
      const dto = {
        clientId: 'client-123',
        permissionType: PermissionsEnum.CAN_TRACK_NUTRITION,
        value: true,
      };

      const dbError = new Error('Database connection failed');
      mockDatabaseService.client.update.mockRejectedValue(dbError);

      await expect(service.updatePermission(dto)).rejects.toThrow(dbError);
    });

    it('should update different permission types', async () => {
      const permissionTypes = [
        PermissionsEnum.CAN_TRACK_EXERCISE,
        PermissionsEnum.CAN_TRACK_SLEEP,
        PermissionsEnum.CAN_TRACK_NUTRITION,
        PermissionsEnum.CAN_TRACK_WATER,
      ];

      for (const permissionType of permissionTypes) {
        mockDatabaseService.client.update.mockResolvedValue({});

        const result = await service.updatePermission({
          clientId: 'client-123',
          permissionType,
          value: true,
        });

        expect(result).toBe(true);
      }

      expect(mockDatabaseService.client.update).toHaveBeenCalledTimes(4);
    });
  });
});
