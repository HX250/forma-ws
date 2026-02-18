import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FakeTranslateLoader } from '../../../testing/common-mocks';

describe.skip('DashboardComponent', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with no expanded widget', () => {
      expect(component.expandedWidget()).toBeNull();
    });
  });

  describe('toggleWidget', () => {
    it('should expand a widget when clicked', () => {
      component.toggleWidget('clients-growth');
      expect(component.expandedWidget()).toBe('clients-growth');
    });

    it('should collapse an expanded widget when clicked again', () => {
      component.toggleWidget('clients-growth');
      expect(component.expandedWidget()).toBe('clients-growth');

      component.toggleWidget('clients-growth');
      expect(component.expandedWidget()).toBeNull();
    });

    it('should switch between different widgets', () => {
      component.toggleWidget('widget-1');
      expect(component.expandedWidget()).toBe('widget-1');

      component.toggleWidget('widget-2');
      expect(component.expandedWidget()).toBe('widget-2');
    });

    it('should handle multiple toggle operations', () => {
      component.toggleWidget('widget-1');
      component.toggleWidget('widget-1');
      component.toggleWidget('widget-2');
      component.toggleWidget('widget-3');
      component.toggleWidget('widget-3');

      expect(component.expandedWidget()).toBeNull();
    });
  });

  describe('isExpanded', () => {
    it('should return true for expanded widget', () => {
      component.toggleWidget('clients-growth');
      expect(component.isExpanded('clients-growth')).toBe(true);
    });

    it('should return false for non-expanded widget', () => {
      component.toggleWidget('widget-1');
      expect(component.isExpanded('widget-2')).toBe(false);
    });

    it('should return false when no widget is expanded', () => {
      expect(component.isExpanded('clients-growth')).toBe(false);
    });

    it('should handle multiple widgets correctly', () => {
      component.toggleWidget('widget-1');

      expect(component.isExpanded('widget-1')).toBe(true);
      expect(component.isExpanded('widget-2')).toBe(false);
      expect(component.isExpanded('widget-3')).toBe(false);
    });
  });

  describe('isHidden', () => {
    it('should return false when no widget is expanded', () => {
      expect(component.isHidden('widget-1')).toBe(false);
      expect(component.isHidden('widget-2')).toBe(false);
    });

    it('should return false for the expanded widget', () => {
      component.toggleWidget('widget-1');
      expect(component.isHidden('widget-1')).toBe(false);
    });

    it('should return true for non-expanded widgets when another is expanded', () => {
      component.toggleWidget('widget-1');
      expect(component.isHidden('widget-2')).toBe(true);
      expect(component.isHidden('widget-3')).toBe(true);
    });

    it('should handle widget switching correctly', () => {
      component.toggleWidget('widget-1');
      expect(component.isHidden('widget-2')).toBe(true);

      component.toggleWidget('widget-2');
      expect(component.isHidden('widget-1')).toBe(true);
      expect(component.isHidden('widget-2')).toBe(false);
    });

    it('should show all widgets when expanded widget is collapsed', () => {
      component.toggleWidget('widget-1');
      component.toggleWidget('widget-1');

      expect(component.isHidden('widget-1')).toBe(false);
      expect(component.isHidden('widget-2')).toBe(false);
      expect(component.isHidden('widget-3')).toBe(false);
    });
  });

  describe('widget state management', () => {
    it('should maintain consistent state across operations', () => {
      component.toggleWidget('widget-1');
      expect(component.isExpanded('widget-1')).toBe(true);
      expect(component.isHidden('widget-1')).toBe(false);
      expect(component.isHidden('widget-2')).toBe(true);

      component.toggleWidget('widget-2');
      expect(component.isExpanded('widget-1')).toBe(false);
      expect(component.isExpanded('widget-2')).toBe(true);
      expect(component.isHidden('widget-1')).toBe(true);
      expect(component.isHidden('widget-2')).toBe(false);
    });

    it('should handle rapid toggle operations', () => {
      for (let i = 0; i < 10; i++) {
        component.toggleWidget('widget-1');
      }
      expect(component.expandedWidget()).toBeNull();
    });
  });
});
