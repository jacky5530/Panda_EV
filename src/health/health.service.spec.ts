import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

/** EXAMPLE TEST (already done): the database is faked, so no Docker needed. */
describe('HealthService', () => {
  it('reports the database as up', async () => {
    const prisma = { $executeRaw: jest.fn().mockResolvedValue(1) };
    const service = new HealthService(prisma as unknown as PrismaService);
    await expect(service.check()).resolves.toMatchObject({
      status: 'ok',
      database: 'up',
    });
  });

  it('reports the database as down when the query fails', async () => {
    const prisma = {
      $executeRaw: jest.fn().mockRejectedValue(new Error('no db')),
    };
    const service = new HealthService(prisma as unknown as PrismaService);
    await expect(service.check()).resolves.toMatchObject({ database: 'down' });
  });
});
