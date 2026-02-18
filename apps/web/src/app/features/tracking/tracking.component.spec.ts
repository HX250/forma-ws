import { TestBed } from '@angular/core/testing';
import { TrackingComponent } from './tracking.component';
import { TrackingService } from './services/tracking.service';
import { SecurityService } from '../../core/auth/security.service';
import { UserType, PermissionsEnum } from '@forma-ws/domain';
import { signal } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FakeTranslateLoader } from '../../../testing/common-mocks';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe.skip('TrackingComponent', () => {
  let component: TrackingComponent;
  let trackingService: TrackingService;
  let securityService: SecurityService;

  const mockTrackingService = {
    loading: signal(false),
    clientsTrackingPermissions: signal({
      canTrackExercise: true,
      canTrackSleep: true,
      canTrackNutrition: true,
      canTrackWater: true,
    }),
    loadPermissions: jest.fn(),
  };

  const mockSecurityService = {
    userType: jest.fn().mockReturnValue(UserType.COACH),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TrackingComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
      providers: [
        { provide: TrackingService, useValue: mockTrackingService },
        { provide: SecurityService, useValue: mockSecurityService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(TrackingComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.inject(TrackingService);
    securityService = TestBed.inject(SecurityService);

    fixture.componentRef.setInput('clientId', 'client-123');
    fixture.componentRef.setInput('todayDate', new Date('2024-01-20'));
    fixture.componentRef.setInput('clientGoals', {
      generalGoals: {
        goalType: ['LOSE_WEIGHT'],
        weightGoal: 5,
        targetWeight: 70,
        targetDate: new Date('2024-06-01'),
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
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with required inputs', () => {
      expect(component.clientId()).toBe('client-123');
      expect(component.todayDate()).toEqual(new Date('2024-01-20'));
      expect(component.clientGoals()).toBeDefined();
    });

    it('should set current user from security service', () => {
      expect(component.currentUser()).toBe(UserType.COACH);
    });

    it('should have permissions enum available', () => {
      expect(component.permissions).toBe(PermissionsEnum);
    });
  });

  describe('loading state', () => {
    it('should reflect tracking service loading state', () => {
      mockTrackingService.loading.set(false);
      expect(component.loading()).toBe(false);

      mockTrackingService.loading.set(true);
      expect(component.loading()).toBe(true);
    });
  });

  describe('clientPermissions', () => {
    it('should return client permissions from tracking service', () => {
      const permissions = {
        canTrackExercise: true,
        canTrackSleep: false,
        canTrackNutrition: true,
        canTrackWater: false,
      };

      mockTrackingService.clientsTrackingPermissions.set(permissions);

      expect(component.clientPermissions()).toEqual(permissions);
    });

    it('should return empty object when permissions are null', () => {
      mockTrackingService.clientsTrackingPermissions.set(null as any);

      expect(component.clientPermissions()).toEqual({});
    });
  });

  describe('trackingCards', () => {
    it('should show all cards for coach regardless of permissions', () => {
      mockSecurityService.userType.mockReturnValue(UserType.COACH);
      mockTrackingService.clientsTrackingPermissions.set({
        canTrackExercise: false,
        canTrackSleep: false,
        canTrackNutrition: false,
        canTrackWater: false,
      });

      const cards = component.trackingCards();

      expect(cards.length).toBe(4);
      expect(cards.some((c) => c.component === 'exercise')).toBe(true);
      expect(cards.some((c) => c.component === 'sleep')).toBe(true);
      expect(cards.some((c) => c.component === 'nutrition')).toBe(true);
      expect(cards.some((c) => c.component === 'water')).toBe(true);
    });

    it('should filter cards based on permissions for client', () => {
      mockSecurityService.userType.mockReturnValue(UserType.CLIENT);
      mockTrackingService.clientsTrackingPermissions.set({
        canTrackExercise: true,
        canTrackSleep: false,
        canTrackNutrition: true,
        canTrackWater: false,
      });

      const cards = component.trackingCards();

      expect(cards.length).toBe(2);
      expect(cards.some((c) => c.component === 'exercise')).toBe(true);
      expect(cards.some((c) => c.component === 'nutrition')).toBe(true);
      expect(cards.some((c) => c.component === 'sleep')).toBe(false);
      expect(cards.some((c) => c.component === 'water')).toBe(false);
    });

    it('should include correct permission types for each card', () => {
      mockSecurityService.userType.mockReturnValue(UserType.COACH);
      mockTrackingService.clientsTrackingPermissions.set({
        canTrackExercise: true,
        canTrackSleep: true,
        canTrackNutrition: true,
        canTrackWater: true,
      });

      const cards = component.trackingCards();

      const exerciseCard = cards.find((c) => c.component === 'exercise');
      const sleepCard = cards.find((c) => c.component === 'sleep');
      const nutritionCard = cards.find((c) => c.component === 'nutrition');
      const waterCard = cards.find((c) => c.component === 'water');

      expect(exerciseCard?.permissionType).toBe(
        PermissionsEnum.CAN_TRACK_EXERCISE
      );
      expect(sleepCard?.permissionType).toBe(PermissionsEnum.CAN_TRACK_SLEEP);
      expect(nutritionCard?.permissionType).toBe(
        PermissionsEnum.CAN_TRACK_NUTRITION
      );
      expect(waterCard?.permissionType).toBe(PermissionsEnum.CAN_TRACK_WATER);
    });

    it('should include translation keys for card titles', () => {
      mockSecurityService.userType.mockReturnValue(UserType.COACH);
      mockTrackingService.clientsTrackingPermissions.set({
        canTrackExercise: true,
        canTrackSleep: true,
        canTrackNutrition: true,
        canTrackWater: true,
      });

      const cards = component.trackingCards();

      expect(cards[0].title).toBe('TRACKING.CARDS.EXERCISE');
      expect(cards[1].title).toBe('TRACKING.CARDS.SLEEP');
      expect(cards[2].title).toBe('TRACKING.CARDS.NUTRITION');
      expect(cards[3].title).toBe('TRACKING.CARDS.WATER');
    });

    it('should show only permitted cards for client with partial permissions', () => {
      mockSecurityService.userType.mockReturnValue(UserType.CLIENT);
      mockTrackingService.clientsTrackingPermissions.set({
        canTrackExercise: true,
        canTrackSleep: true,
        canTrackNutrition: false,
        canTrackWater: true,
      });

      const cards = component.trackingCards();

      expect(cards.length).toBe(3);
      expect(cards.map((c) => c.component)).toEqual([
        'exercise',
        'sleep',
        'water',
      ]);
    });

    it('should show no cards for client with no permissions', () => {
      mockSecurityService.userType.mockReturnValue(UserType.CLIENT);
      mockTrackingService.clientsTrackingPermissions.set({
        canTrackExercise: false,
        canTrackSleep: false,
        canTrackNutrition: false,
        canTrackWater: false,
      });

      const cards = component.trackingCards();

      expect(cards.length).toBe(0);
    });
  });

  describe('clientId effect', () => {
    it('should load permissions when clientId changes', () => {
      expect(mockTrackingService.loadPermissions).toHaveBeenCalledWith(
        'client-123'
      );
    });
  });
});
