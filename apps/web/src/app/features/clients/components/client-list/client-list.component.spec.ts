import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClientListComponent } from './client-list.component';
import { ClientsResourceService } from '../../resources/clients.resource.service';
import { of, throwError } from 'rxjs';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let resourceService: ClientsResourceService;
  let router: Router;

  const mockResourceService = {
    getAllClients: jest.fn(),
    deleteClient: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientListComponent],
      providers: [
        { provide: ClientsResourceService, useValue: mockResourceService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    resourceService = TestBed.inject(ClientsResourceService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadClients', () => {
    it('should load all clients for coach', (done) => {
      const mockClients = [
        {
          id: 'client-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          canTrackExercise: true,
          canTrackSleep: true,
          canTrackNutrition: true,
          canTrackWater: true,
          updatedAt: new Date(),
        },
        {
          id: 'client-2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          canTrackExercise: false,
          canTrackSleep: true,
          canTrackNutrition: true,
          canTrackWater: false,
          updatedAt: new Date(),
        },
      ];

      mockResourceService.getAllClients.mockReturnValue(of(mockClients));

      component.loadClients();

      setTimeout(() => {
        expect(component.clients()).toEqual(mockClients);
        expect(mockResourceService.getAllClients).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should set loading state during fetch', () => {
      mockResourceService.getAllClients.mockReturnValue(of([]));

      expect(component.loading()).toBe(false);
      component.loadClients();
      expect(component.loading()).toBe(true);
    });

    it('should handle errors when loading clients', (done) => {
      const error = new Error('Failed to load clients');
      mockResourceService.getAllClients.mockReturnValue(throwError(() => error));

      component.loadClients();

      setTimeout(() => {
        expect(component.loading()).toBe(false);
        expect(component.clients()).toEqual([]);
        done();
      }, 100);
    });
  });

  describe('deleteClient', () => {
    it('should delete client and reload list', (done) => {
      const clientId = 'client-123';

      mockResourceService.deleteClient.mockReturnValue(of(true));
      mockResourceService.getAllClients.mockReturnValue(of([]));

      component.deleteClient(clientId);

      setTimeout(() => {
        expect(mockResourceService.deleteClient).toHaveBeenCalledWith(clientId);
        expect(mockResourceService.getAllClients).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should handle errors when deleting client', (done) => {
      const error = new Error('Failed to delete client');
      mockResourceService.deleteClient.mockReturnValue(throwError(() => error));

      component.deleteClient('client-123');

      setTimeout(() => {
        expect(component.loading()).toBe(false);
        done();
      }, 100);
    });
  });

  describe('navigateToClient', () => {
    it('should navigate to client details page', () => {
      const clientId = 'client-123';

      component.navigateToClient(clientId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/clients', clientId]);
    });
  });

  describe('navigateToTracking', () => {
    it('should navigate to client tracking page', () => {
      const clientId = 'client-123';

      component.navigateToTracking(clientId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/clients/tracking', clientId]);
    });
  });

  describe('filterClients', () => {
    it('should filter clients by search term', () => {
      const mockClients = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
        { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
      ];

      component.clients.set(mockClients as any);
      component.searchTerm.set('john');

      const filtered = component.filteredClients();

      expect(filtered).toHaveLength(2);
      expect(filtered.some(c => c.firstName === 'John')).toBe(true);
      expect(filtered.some(c => c.lastName === 'Johnson')).toBe(true);
    });

    it('should return all clients when search term is empty', () => {
      const mockClients = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];

      component.clients.set(mockClients as any);
      component.searchTerm.set('');

      const filtered = component.filteredClients();

      expect(filtered).toEqual(mockClients);
    });

    it('should perform case-insensitive search', () => {
      const mockClients = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      ];

      component.clients.set(mockClients as any);
      component.searchTerm.set('JOHN');

      const filtered = component.filteredClients();

      expect(filtered).toHaveLength(1);
    });
  });

  describe('sortClients', () => {
    it('should sort clients by name ascending', () => {
      const mockClients = [
        { id: '1', firstName: 'Charlie', lastName: 'Brown' },
        { id: '2', firstName: 'Alice', lastName: 'Smith' },
        { id: '3', firstName: 'Bob', lastName: 'Jones' },
      ];

      component.clients.set(mockClients as any);
      component.sortBy.set('name');
      component.sortDirection.set('asc');

      const sorted = component.sortedClients();

      expect(sorted[0].firstName).toBe('Alice');
      expect(sorted[1].firstName).toBe('Bob');
      expect(sorted[2].firstName).toBe('Charlie');
    });

    it('should sort clients by name descending', () => {
      const mockClients = [
        { id: '1', firstName: 'Alice', lastName: 'Smith' },
        { id: '2', firstName: 'Charlie', lastName: 'Brown' },
        { id: '3', firstName: 'Bob', lastName: 'Jones' },
      ];

      component.clients.set(mockClients as any);
      component.sortBy.set('name');
      component.sortDirection.set('desc');

      const sorted = component.sortedClients();

      expect(sorted[0].firstName).toBe('Charlie');
      expect(sorted[1].firstName).toBe('Bob');
      expect(sorted[2].firstName).toBe('Alice');
    });
  });
});
