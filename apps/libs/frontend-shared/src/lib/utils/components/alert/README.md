# Alert Component

A toast-style alert component that displays notifications in the top-right corner of the screen.

## Features

- **4 Alert Types**: `success`, `error`, `warning`, `info`
- **Auto-dismiss**: Alerts automatically disappear after 5 seconds
- **Maximum Limit**: Shows up to 5 alerts at once
- **Translation Support**: Headers and text support i18n via `@ngx-translate`
- **Dark Mode**: Fully supports light and dark themes
- **Animations**: Smooth slide-in animation
- **Accessible**: Includes ARIA labels and keyboard support

## Usage

### 1. Add the component to your app

Add the `AlertComponent` to your main app component template:

```html
<app-alert />
```

### 2. Inject the service and show alerts

```typescript
import { Component, inject } from '@angular/core';
import { AlertService } from '@libs/frontend-shared';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="showSuccess()">Show Success</button>
    <button (click)="showError()">Show Error</button>
    <button (click)="showWarning()">Show Warning</button>
    <button (click)="showInfo()">Show Info</button>
  `
})
export class ExampleComponent {
  private alertService = inject(AlertService);

  showSuccess() {
    this.alertService.show('success', 'Operation completed successfully!');
  }

  showError() {
    this.alertService.show('error', 'An error occurred', 'Custom Error Header');
  }

  showWarning() {
    this.alertService.show('warning', 'Please be careful');
  }

  showInfo() {
    this.alertService.show('info', 'Here is some information');
  }
}
```

## API

### AlertService

#### Methods

- **`show(type: AlertType, text: string, header?: string): void`**
  - `type`: One of `'success'`, `'error'`, `'warning'`, `'info'`
  - `text`: The message to display (translation key or plain text)
  - `header`: Optional custom header (translation key or plain text). If not provided, uses default headers based on type.

- **`remove(id: string): void`**
  - Manually remove an alert by its ID

#### Properties

- **`alerts: Signal<Alert[]>`**
  - Read-only signal containing all active alerts

### Alert Interface

```typescript
interface Alert {
  id: string;
  type: AlertType;
  text: string;
  header?: string;
}
```

## Translation Keys

Add these keys to your translation files at `apps/web/public/assets/lang/fe-shared/utils/alert/`:

**en.json:**
```json
{
  "ALERT": {
    "SUCCESS": "Success",
    "ERROR": "Error",
    "WARNING": "Warning",
    "INFO": "Information"
  }
}
```

**sk.json:**
```json
{
  "ALERT": {
    "SUCCESS": "Úspech",
    "ERROR": "Chyba",
    "WARNING": "Upozornenie",
    "INFO": "Informácia"
  }
}
```

The translation keys used are: `ALERT.SUCCESS`, `ALERT.ERROR`, `ALERT.WARNING`, `ALERT.INFO`.

## Styling

The component uses your project's Tailwind colors:
- **Success**: `utils` (#10B981)
- **Error**: `utils-error` (#EF4444)
- **Warning**: `utils-warning` (#FACC15)
- **Info**: `utils-info` (#3B82F6)

All colors automatically adapt to dark mode.
