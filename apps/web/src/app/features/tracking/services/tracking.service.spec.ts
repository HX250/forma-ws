import { TestBed } from '@angular/core/testing';
import { TrackingService } from './tracking.service';
import { ClientsProfileResourceService } from '../../clients/resources/clients-profile.resources.service';
import { of } from 'rxjs';

describe('TrackingService', () => {
  let service: TrackingService;
  let resourceService: ClientsProfileResourceService;

  const mockResourceService = {
    getClientPermissions: jest.fn(),
    getClientGoals: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TrackingService,
        {
          provide: ClientsProfileResourceService,
          useValue: mockResourceService,
        },
      ],
    });
    service = TestBed.inject(TrackingService);
    resourceService = TestBed.inject(ClientsProfileResourceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadPermissions', () => {
    it('should load and set client tracking permissions', (done) => {
      const mockPermissions = {
        canTrackExercise: true,
        canTrackSleep: true,
        canTrackNutrition: false,
        canTrackWater: true,
      };

      mockResourceService.getClientPermissions.mockReturnValue(
        of(mockPermissions)
      );

      service.loadPermissions('client-123');

      setTimeout(() => {
        expect(service.clientsTrackingPermissions()).toEqual(mockPermissions);
        expect(mockResourceService.getClientPermissions).toHaveBeenCalledWith(
          'client-123'
        );
        done();
      }, 100);
    });

    it('should set loading state during request', (done) => {
      mockResourceService.getClientPermissions.mockReturnValue(of({}));

      expect(service.loading()).toBe(false);
      service.loadPermissions('client-123');

      setTimeout(() => {
        expect(mockResourceService.getClientPermissions).toHaveBeenCalledWith(
          'client-123'
        );
        done();
      }, 100);
    });
  });

  describe('loadClientGoals', () => {
    it('should load and set client goals', (done) => {
      const mockGoals = {
        generalGoals: {
          goalType: ['WEIGHT_LOSS'],
          weightGoal: 5,
          targetWeight: 70,
          targetDate: new Date(),
        },
        trackingGoal: {
          nutritionGoals: {
            caloriesGoal: 2000,
            proteinTarget: 150,
            carbTarget: 200,
            fatTarget: 60,
            fiberTarget: 30,
            sugarTarget: 50,
          },
          sleepGoal: 8,
          waterGoal: 2.5,
          exerciseGoal: 30,
        },
      };

      mockResourceService.getClientGoals.mockReturnValue(of(mockGoals));

      service.loadClientGoals('client-123');

      setTimeout(() => {
        expect(service.clientTrackingGoals()).toEqual(mockGoals);
        expect(mockResourceService.getClientGoals).toHaveBeenCalledWith(
          'client-123'
        );
        done();
      }, 100);
    });
  });
});
