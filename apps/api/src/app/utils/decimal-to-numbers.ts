import { Prisma } from '@prisma/client';
import { decimalToNumber } from './prisma-to-plain';

export function decimalInObjectToNumber(object: any) {
  if (object === null || object === undefined) {
    return object;
  }

  for (const key in object) {
    if (object[key] instanceof Prisma.Decimal) {
      object[key] = decimalToNumber(object[key]);
    }
  }

  return object;
}
