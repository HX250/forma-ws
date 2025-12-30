import {
  Injectable,
  ComponentRef,
  ApplicationRef,
  EnvironmentInjector,
  Type,
  createComponent,
} from '@angular/core';
import { ModalComponent } from '../modal.component';
import { Subject, Observable } from 'rxjs';

export interface ModalConfig {
  title?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showFooterButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  data?: any;
}

export interface ModalRef<T = any> {
  close: (result?: T) => void;
  componentInstance: any;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private activeModals: Array<{
    container: ComponentRef<ModalComponent>;
    content: ComponentRef<any>;
  }> = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open<T = any>(
    component: Type<any>,
    config: ModalConfig = {}
  ): Observable<T | undefined> {
    const result$ = new Subject<T | undefined>();

    const modalContainer = this.createModalContainer(config);
    const contentComponentRef = createComponent(component, {
      environmentInjector: this.injector,
    });

    if (config.data) {
      Object.assign(contentComponentRef.instance, config.data);
    }

    this.appRef.attachView(contentComponentRef.hostView);
    const contentElement = contentComponentRef.location.nativeElement;

    setTimeout(() => {
      const contentSlot = modalContainer.location.nativeElement.querySelector(
        '[data-modal-content]'
      );
      if (contentSlot) {
        contentSlot.appendChild(contentElement);
        contentComponentRef.changeDetectorRef.detectChanges();
        modalContainer.changeDetectorRef.detectChanges();
      }
    }, 0);

    const modalRef: ModalRef<T> = {
      close: (result?: T) => {
        this.closeModal(modalContainer, contentComponentRef);
        result$.next(result);
        result$.complete();
      },
      componentInstance: contentComponentRef.instance,
    };

    if ('modalRef' in contentComponentRef.instance) {
      contentComponentRef.instance.modalRef = modalRef;
    }

    const subscriptions = [
      modalContainer.instance.closeModal.subscribe(() =>
        modalRef.close(undefined)
      ),
      modalContainer.instance.primaryClick.subscribe(() => {
        if ('onPrimaryClick' in contentComponentRef.instance) {
          const res = contentComponentRef.instance.onPrimaryClick();
          if (res !== false) modalRef.close(res);
        } else {
          modalRef.close(true as any);
        }
      }),
      modalContainer.instance.secondaryClick.subscribe(() => {
        if ('onSecondaryClick' in contentComponentRef.instance) {
          contentComponentRef.instance.onSecondaryClick();
        }
        modalRef.close(false as any);
      }),
    ];

    const originalClose = modalRef.close;
    modalRef.close = (result?: T) => {
      subscriptions.forEach((sub) => sub.unsubscribe());
      originalClose(result);
    };

    this.activeModals.push({
      container: modalContainer,
      content: contentComponentRef,
    });

    return result$.asObservable();
  }

  private createModalContainer(config: ModalConfig) {
    const modalContainerRef = createComponent(ModalComponent, {
      environmentInjector: this.injector,
    });
    modalContainerRef.instance.title = config.title || '';
    modalContainerRef.instance.showCloseButton = config.showCloseButton ?? true;
    modalContainerRef.instance.size = config.size || 'md';
    modalContainerRef.instance.showFooterButtons =
      config.showFooterButtons ?? true;
    modalContainerRef.instance.primaryButtonText =
      config.primaryButtonText || 'Submit';
    modalContainerRef.instance.secondaryButtonText =
      config.secondaryButtonText || 'Cancel';
    this.appRef.attachView(modalContainerRef.hostView);
    document.body.appendChild(modalContainerRef.location.nativeElement);
    modalContainerRef.changeDetectorRef.detectChanges();
    return modalContainerRef;
  }

  private closeModal(
    containerRef: ComponentRef<ModalComponent>,
    contentRef: ComponentRef<any>
  ) {
    const index = this.activeModals.findIndex(
      (m) => m.container === containerRef
    );
    if (index > -1) this.activeModals.splice(index, 1);

    this.appRef.detachView(contentRef.hostView);
    contentRef.destroy();

    this.appRef.detachView(containerRef.hostView);
    containerRef.destroy();
  }

  closeAll() {
    [...this.activeModals].forEach((m) =>
      this.closeModal(m.container, m.content)
    );
  }
}
