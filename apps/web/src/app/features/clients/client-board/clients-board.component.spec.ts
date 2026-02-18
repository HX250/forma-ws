import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClientsBoardComponent } from './clients-board.component';
import { ClientTableService } from './components/table/services/client-table.service';
import { ModalService } from '@forma-ws/frontend-shared';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FakeTranslateLoader } from '../../../../testing/common-mocks';

describe.skip('ClientsBoardComponent', () => {
  let component: ClientsBoardComponent;
  let clientTableService: ClientTableService;
  let modalService: ModalService;
  let router: Router;

  const mockClientTableService = {
    loadClientsTable: jest.fn(),
    loading: signal(false),
    clientsTable: signal(null),
  };

  const mockModalService = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ClientsBoardComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
      providers: [
        { provide: ClientTableService, useValue: mockClientTableService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(ClientsBoardComponent);
    component = fixture.componentInstance;
    clientTableService = TestBed.inject(ClientTableService);
    modalService = TestBed.inject(ModalService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('openRegisterModal', () => {
    it('should open register client modal with correct configuration', () => {
      mockModalService.open.mockReturnValue(of(false));

      component.openRegisterModal();

      expect(mockModalService.open).toHaveBeenCalledWith(expect.any(Function), {
        title: 'REGISTER_CLIENT.TITLE',
        size: 'lg',
        showFooterButtons: false,
        showCloseButton: true,
      });
    });

    it('should reload clients when modal returns true', (done) => {
      mockModalService.open.mockReturnValue(of(true));

      component.openRegisterModal();

      setTimeout(() => {
        expect(mockClientTableService.loadClientsTable).toHaveBeenCalledWith(
          true
        );
        done();
      }, 100);
    });

    it('should not reload clients when modal returns false', (done) => {
      mockModalService.open.mockReturnValue(of(false));

      component.openRegisterModal();

      setTimeout(() => {
        expect(mockClientTableService.loadClientsTable).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should handle modal cancellation', (done) => {
      mockModalService.open.mockReturnValue(of(null));

      component.openRegisterModal();

      setTimeout(() => {
        expect(mockClientTableService.loadClientsTable).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('reloadClients', () => {
    it('should call loadClientsTable with reload flag true', () => {
      component.reloadClients();

      expect(mockClientTableService.loadClientsTable).toHaveBeenCalledWith(
        true
      );
    });

    it('should force reload even if clients are already loaded', () => {
      component.reloadClients();
      component.reloadClients();

      expect(mockClientTableService.loadClientsTable).toHaveBeenCalledTimes(2);
      expect(mockClientTableService.loadClientsTable).toHaveBeenNthCalledWith(
        1,
        true
      );
      expect(mockClientTableService.loadClientsTable).toHaveBeenNthCalledWith(
        2,
        true
      );
    });
  });

  describe('onClientClick', () => {
    it('should navigate to client profile with correct id', () => {
      const mockEvent = {
        data: { id: 'client-123' },
        index: 0,
      };

      component.onClientClick(mockEvent as any);

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/clients/profile',
        'client-123',
      ]);
    });

    it('should handle different client ids', () => {
      const events = [
        { data: { id: 'client-1' }, index: 0 },
        { data: { id: 'client-2' }, index: 1 },
        { data: { id: 'client-3' }, index: 2 },
      ];

      events.forEach((event) => {
        component.onClientClick(event as any);
      });

      expect(mockRouter.navigate).toHaveBeenCalledTimes(3);
      expect(mockRouter.navigate).toHaveBeenNthCalledWith(1, [
        '/clients/profile',
        'client-1',
      ]);
      expect(mockRouter.navigate).toHaveBeenNthCalledWith(2, [
        '/clients/profile',
        'client-2',
      ]);
      expect(mockRouter.navigate).toHaveBeenNthCalledWith(3, [
        '/clients/profile',
        'client-3',
      ]);
    });

    it('should navigate regardless of index', () => {
      const mockEvent = {
        data: { id: 'client-456' },
        index: 99,
      };

      component.onClientClick(mockEvent as any);

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/clients/profile',
        'client-456',
      ]);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow: open modal, register client, reload', (done) => {
      mockModalService.open.mockReturnValue(of(true));

      component.openRegisterModal();

      setTimeout(() => {
        expect(mockModalService.open).toHaveBeenCalled();
        expect(mockClientTableService.loadClientsTable).toHaveBeenCalledWith(
          true
        );
        done();
      }, 100);
    });

    it('should handle multiple modal operations', (done) => {
      mockModalService.open.mockReturnValueOnce(of(true));
      mockModalService.open.mockReturnValueOnce(of(false));
      mockModalService.open.mockReturnValueOnce(of(true));

      component.openRegisterModal();
      component.openRegisterModal();
      component.openRegisterModal();

      setTimeout(() => {
        expect(mockModalService.open).toHaveBeenCalledTimes(3);
        expect(mockClientTableService.loadClientsTable).toHaveBeenCalledTimes(
          2
        );
        done();
      }, 100);
    });
  });
});
