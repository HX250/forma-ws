import { TestBed } from '@angular/core/testing';
import { ClientTableService } from './client-table.service';
import { ClientsBoardResourceService } from '../../../../resources/clients-board.resource.service';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';
import { of, throwError } from 'rxjs';
import { ClientTable } from '@forma-ws/domain';

describe('ClientTableService', () => {
  let service: ClientTableService;
  let resourceService: ClientsBoardResourceService;
  let securityService: SecurityService;

  const mockResourceService = {
    getClientList: jest.fn(),
  };

  const mockSecurityService = {
    userId: jest.fn().mockReturnValue('coach-123'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientTableService,
        { provide: ClientsBoardResourceService, useValue: mockResourceService },
        { provide: SecurityService, useValue: mockSecurityService },
      ],
    });
    service = TestBed.inject(ClientTableService);
    resourceService = TestBed.inject(ClientsBoardResourceService);
    securityService = TestBed.inject(SecurityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with null clients table', () => {
      expect(service.clientsTable()).toBeNull();
    });

    it('should initialize with loading false', () => {
      expect(service.loading()).toBe(false);
    });
  });

  describe('loadClientsTable', () => {
    it('should load clients table successfully', (done) => {
      const mockClients: ClientTable[] = [
        {
          id: 'client-1',
          firstName: 'John',
          lastName: 'Doe',
          canTrackExercise: true,
          canTrackSleep: true,
          canTrackNutrition: true,
          canTrackWater: true,
          updatedAt: new Date('2024-01-20'),
        },
        {
          id: 'client-2',
          firstName: 'Jane',
          lastName: 'Smith',
          canTrackExercise: true,
          canTrackSleep: false,
          canTrackNutrition: true,
          canTrackWater: false,
          updatedAt: new Date('2024-01-22'),
        },
      ];

      mockResourceService.getClientList.mockReturnValue(of(mockClients));

      service.loadClientsTable();

      setTimeout(() => {
        expect(service.clientsTable()).toEqual(mockClients);
        expect(service.loading()).toBe(false);
        expect(mockResourceService.getClientList).toHaveBeenCalledWith(
          'coach-123'
        );
        done();
      }, 100);
    });

    it('should set loading to true during request', (done) => {
      mockResourceService.getClientList.mockReturnValue(of([]));

      expect(service.loading()).toBe(false);
      service.loadClientsTable();

      setTimeout(() => {
        expect(mockResourceService.getClientList).toHaveBeenCalledWith(
          'coach-123'
        );
        done();
      }, 100);
    });

    it('should handle errors and set loading to false', (done) => {
      const error = new Error('Failed to load clients');
      mockResourceService.getClientList.mockReturnValue(
        throwError(() => error)
      );

      service.loadClientsTable();

      setTimeout(() => {
        expect(service.loading()).toBe(false);
        expect(service.clientsTable()).toBeNull();
        done();
      }, 100);
    });

    it('should not reload if clients already loaded and reload is false', () => {
      const mockClients: ClientTable[] = [
        {
          id: 'client-1',
          firstName: 'John',
          lastName: 'Doe',
          canTrackExercise: true,
          canTrackSleep: true,
          canTrackNutrition: true,
          canTrackWater: true,
          updatedAt: new Date('2024-01-20'),
        },
      ];

      service.clientsTable.set(mockClients);
      mockResourceService.getClientList.mockReturnValue(of([]));

      service.loadClientsTable(false);

      expect(mockResourceService.getClientList).not.toHaveBeenCalled();
    });

    it('should reload if clients already loaded and reload is true', (done) => {
      const initialClients: ClientTable[] = [
        {
          id: 'client-1',
          firstName: 'John',
          lastName: 'Doe',
          canTrackExercise: true,
          canTrackSleep: true,
          canTrackNutrition: true,
          canTrackWater: true,
          updatedAt: new Date('2024-01-20'),
        },
      ];

      const updatedClients: ClientTable[] = [
        {
          id: 'client-1',
          firstName: 'John',
          lastName: 'Doe',
          canTrackExercise: true,
          canTrackSleep: false,
          canTrackNutrition: true,
          canTrackWater: true,
          updatedAt: new Date('2024-01-25'),
        },
      ];

      service.clientsTable.set(initialClients);
      mockResourceService.getClientList.mockReturnValue(of(updatedClients));

      service.loadClientsTable(true);

      setTimeout(() => {
        expect(mockResourceService.getClientList).toHaveBeenCalledWith(
          'coach-123'
        );
        expect(service.clientsTable()).toEqual(updatedClients);
        done();
      }, 100);
    });

    it('should handle empty client list', (done) => {
      mockResourceService.getClientList.mockReturnValue(of([]));

      service.loadClientsTable();

      setTimeout(() => {
        expect(service.clientsTable()).toEqual([]);
        expect(service.loading()).toBe(false);
        done();
      }, 100);
    });
  });
});
