export enum AlertType {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
}
export interface Alert {
  id: string;
  type: AlertType;
  text: string;
  header?: string;
}
