import { PrismaClient } from '../generated/prisma';

/**
 * Singleton Prisma Client (Principe S - Single Responsibility)
 * Gestion de la connexion à la base de données
 */
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
