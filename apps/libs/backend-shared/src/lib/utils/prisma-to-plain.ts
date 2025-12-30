import { Prisma } from '@prisma/client';

export function decimalToNumber(
  value: Prisma.Decimal | null | undefined
): number | null | undefined {
  if (value === null) return null;
  if (value === undefined) return undefined;
  return value.toNumber();
}

export function prismaToPlain<T>(obj: any): T {
  if (obj === null || obj === undefined) return obj;

  if (obj instanceof Prisma.Decimal) {
    return obj.toNumber() as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => prismaToPlain(item)) as any;
  }

  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj as any;

    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = prismaToPlain(obj[key]);
      }
    }
    return result;
  }

  return obj;
}
