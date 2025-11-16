export interface TableColumn<T> {
  header: string;
  field?: keyof T;
}

export interface TableModel {
  [key: string]: string;
}
