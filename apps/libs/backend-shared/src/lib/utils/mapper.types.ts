export enum FieldTransformType {
  DECIMAL_TO_NUMBER = 'DECIMAL_TO_NUMBER',
  NUMBER_TO_DECIMAL = 'NUMBER_TO_DECIMAL',
  JSON_PARSE = 'JSON_PARSE',
  JSON_STRINGIFY = 'JSON_STRINGIFY',
  CUSTOM = 'CUSTOM',
}

export interface FieldMappingConfig {
  sourceField?: string;
  targetField?: string;
  fromPrismaTransform?: FieldTransformType | ((value: any) => any);
  toPrismaTransform?: FieldTransformType | ((value: any) => any);
  excludeFromJson?: boolean;
}

export interface MapperConfig {
  sensitiveFields?: string[];
  fieldMappings?: Record<string, FieldMappingConfig>;
  decimalFields?: string[];
  jsonFields?: string[];
}

export interface Mappable<TPrisma = any, TJson = any> {
  toPrisma(): TPrisma;
  toJSON(): TJson;
}

export interface MappableStatic<TModel, TPrisma = any> {
  fromPrisma(data: TPrisma): TModel;
}
