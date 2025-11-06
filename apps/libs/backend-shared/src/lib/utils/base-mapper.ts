import { Decimal } from '@prisma/client/runtime/library';
import { MapperConfig, FieldTransformType } from './mapper.types';

export class BaseMapper {
  protected static mapFromPrisma<T>(
    data: any,
    ModelClass: new (...args: any[]) => T,
    config?: MapperConfig
  ): T {
    const transformedData: any = {};

    for (const key in data) {
      if (!data.hasOwnProperty(key)) continue;

      const value = data[key];
      const fieldConfig = config?.fieldMappings?.[key];

      if (fieldConfig?.fromPrismaTransform) {
        transformedData[fieldConfig.targetField || key] = this.applyTransform(
          value,
          fieldConfig.fromPrismaTransform
        );
      } else if (
        config?.decimalFields?.includes(key) &&
        value instanceof Decimal
      ) {
        transformedData[key] = value.toNumber();
      } else if (config?.jsonFields?.includes(key) && value !== null) {
        transformedData[key] = value;
      } else {
        transformedData[key] = value;
      }
    }

    return Object.assign(Object.create(ModelClass.prototype), transformedData);
  }

  protected static mapToPrisma<T extends object>(
    instance: T,
    config?: MapperConfig
  ): any {
    const prismaData: any = { ...instance };
    const transformedData: any = {};

    for (const key in prismaData) {
      const value = prismaData[key];
      const fieldConfig = config?.fieldMappings?.[key];

      if (value === undefined) continue;

      if (fieldConfig?.toPrismaTransform) {
        transformedData[fieldConfig.targetField || key] = this.applyTransform(
          value,
          fieldConfig.toPrismaTransform
        );
      } else if (
        config?.decimalFields?.includes(key) &&
        typeof value === 'number'
      ) {
        transformedData[key] = new Decimal(value);
      } else if (config?.jsonFields?.includes(key)) {
        transformedData[key] = value;
      } else {
        transformedData[key] = value;
      }
    }

    return transformedData;
  }

  protected static mapToJSON<T extends object>(
    instance: T,
    config?: MapperConfig
  ): any {
    const allData: any = { ...instance };
    const jsonData: any = {};
    const sensitivePatterns = config?.sensitiveFields || ['password'];

    for (const key in allData) {
      const fieldConfig = config?.fieldMappings?.[key];
      if (fieldConfig?.excludeFromJson) continue;

      const isSensitive = sensitivePatterns.some((pattern) =>
        key.toLowerCase().includes(pattern.toLowerCase())
      );
      if (isSensitive) continue;

      jsonData[key] = allData[key];
    }

    return jsonData;
  }

  private static applyTransform(
    value: any,
    transform: FieldTransformType | ((value: any) => any)
  ): any {
    if (typeof transform === 'function') {
      return transform(value);
    }

    switch (transform) {
      case FieldTransformType.DECIMAL_TO_NUMBER:
        return value instanceof Decimal ? value.toNumber() : value;

      case FieldTransformType.NUMBER_TO_DECIMAL:
        return typeof value === 'number' ? new Decimal(value) : value;

      case FieldTransformType.JSON_PARSE:
        return typeof value === 'string' ? JSON.parse(value) : value;

      case FieldTransformType.JSON_STRINGIFY:
        return typeof value === 'object' ? JSON.stringify(value) : value;

      default:
        return value;
    }
  }

  protected static createConfig(
    overrides?: Partial<MapperConfig>
  ): MapperConfig {
    return {
      sensitiveFields: ['password'],
      decimalFields: [],
      jsonFields: [],
      fieldMappings: {},
      ...overrides,
    };
  }
}
