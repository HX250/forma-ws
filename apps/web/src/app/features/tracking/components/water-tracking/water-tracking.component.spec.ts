import { TestBed } from '@angular/core/testing';
import { WaterTrackingComponent } from './water-tracking.component';
import { WaterResourceService } from '../../resources/water.resource.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { of, throwError } from 'rxjs';

describe('WaterTrackingComponent', () => {
  let component: WaterTrackingComponent;
  let resourceService: WaterResourceService;
  let modalService: ModalService;

  const mockResourceService = {
    getWaterEntries: jest.fn(),
    removeWaterEntry: jest.fn(),
  };

  const mockModalService = {
    open: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WaterTrackingComponent],
      providers: [
        { provide: WaterResourceService, useValue: mockResourceService },
        { provide: ModalService, useValue: mockModalService },
      ],
    });

    const fixture = TestBed.createComponent(WaterTrackingComponent);
    component = fixture.componentInstance;
    resourceService = TestBed.inject(WaterResourceService);
    modalService = TestBed.inject(ModalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadData', () => {
    it('should load water entries for client and date', (done) => {
      const mockEntries = [
        { id: '1', amount: 250, createdAt: new Date() },
        { id: '2', amount: 500, createdAt: new Date() },
      ];

      mockResourceService.getWaterEntries.mockReturnValue(of(mockEntries));

      component.loadData('client-123', new Date());

      setTimeout(() => {
        expect(component.waterEntries()).toEqual(mockEntries);
        expect(mockResourceService.getWaterEntries).toHaveBeenCalledWith(
          'client-123',
          expect.any(String)
        );
        done();
      }, 100);
    });

    it('should set loading state during data fetch', () => {
      mockResourceService.getWaterEntries.mockReturnValue(of([]));

      expect(component.loading()).toBe(false);
      component.loadData('client-123', new Date());
      expect(component.loading()).toBe(true);
    });

    it('should handle errors when loading data', (done) => {
      const error = new Error('Failed to load water entries');
      mockResourceService.getWaterEntries.mockReturnValue(throwError(() => error));

      component.loadData('client-123', new Date());

      setTimeout(() => {
        expect(component.loading()).toBe(false);
        expect(component.waterEntries()).toEqual([]);
        done();
      }, 100);
    });
  });

  describe('removeEntry', () => {
    it('should remove water entry and reload data', (done) => {
      const entryId = 'entry-123';
      const clientId = 'client-123';

      mockResourceService.removeWaterEntry.mockReturnValue(of(true));
      mockResourceService.getWaterEntries.mockReturnValue(of([]));

      component.removeEntry(entryId, clientId);

      setTimeout(() => {
        expect(mockResourceService.removeWaterEntry).toHaveBeenCalledWith(entryId, clientId);
        expect(mockResourceService.getWaterEntries).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should handle errors when removing entry', (done) => {
      const error = new Error('Failed to remove entry');
      mockResourceService.removeWaterEntry.mockReturnValue(throwError(() => error));

      component.removeEntry('entry-123', 'client-123');

      setTimeout(() => {
        expect(component.loading()).toBe(false);
        done();
      }, 100);
    });
  });

  describe('openAddModal', () => {
    it('should open modal and reload data on success', (done) => {
      mockModalService.open.mockReturnValue(of(true));
      mockResourceService.getWaterEntries.mockReturnValue(of([]));

      component.openAddModal('client-123');

      setTimeout(() => {
        expect(mockModalService.open).toHaveBeenCalled();
        expect(mockResourceService.getWaterEntries).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should not reload data when modal is cancelled', (done) => {
      mockModalService.open.mockReturnValue(of(false));

      component.openAddModal('client-123');

      setTimeout(() => {
        expect(mockModalService.open).toHaveBeenCalled();
        expect(mockResourceService.getWaterEntries).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('calculateTotalWater', () => {
    it('should calculate total water intake from entries', () => {
      const entries = [
        { id: '1', amount: 250, createdAt: new Date() },
        { id: '2', amount: 500, createdAt: new Date() },
        { id: '3', amount: 750, createdAt: new Date() },
      ];

      component.waterEntries.set(entries);

      const total = component.calculateTotalWater();

      expect(total).toBe(1500);
    });

    it('should return 0 when no entries exist', () => {
      component.waterEntries.set([]);

      const total = component.calculateTotalWater();

      expect(total).toBe(0);
    });
  });

  describe('isGoalMet', () => {
    it('should return true when total water meets or exceeds goal', () => {
      const entries = [
        { id: '1', amount: 1000, createdAt: new Date() },
        { id: '2', amount: 1500, createdAt: new Date() },
      ];

      component.waterEntries.set(entries);
      component.waterGoal.set(2000);

      expect(component.isGoalMet()).toBe(true);
    });

    it('should return false when total water is below goal', () => {
      const entries = [{ id: '1', amount: 500, createdAt: new Date() }];

      component.waterEntries.set(entries);
      component.waterGoal.set(2000);

      expect(component.isGoalMet()).toBe(false);
    });

    it('should return false when no goal is set', () => {
      const entries = [{ id: '1', amount: 1000, createdAt: new Date() }];

      component.waterEntries.set(entries);
      component.waterGoal.set(null);

      expect(component.isGoalMet()).toBe(false);
    });
  });
});
