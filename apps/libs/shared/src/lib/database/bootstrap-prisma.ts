process.env['DATABASE_URL'] = (process.env['DATABASE_URL'] || '').trim();

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
