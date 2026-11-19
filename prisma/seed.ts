/* Fake stations for practice. Names are invented — no real customer data. */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const stations = [
    {
      name: 'FAKE Station A',
      latitude: 17.97,
      longitude: 102.63,
      chargers: ['FAKE-A-01', 'FAKE-A-02'],
    },
    {
      name: 'FAKE Station B',
      latitude: 17.93,
      longitude: 102.61,
      chargers: ['FAKE-B-01'],
    },
    {
      name: 'FAKE Station C',
      latitude: 18.0,
      longitude: 102.58,
      chargers: ['FAKE-C-01', 'FAKE-C-02', 'FAKE-C-03'],
    },
  ];
  await prisma.connector.deleteMany();
  await prisma.station.deleteMany();
  for (const s of stations) {
    await prisma.station.create({
      data: {
        name: s.name,
        latitude: s.latitude,
        longitude: s.longitude,
        connectors: {
          create: s.chargers.flatMap((chargerId) =>
            [1, 2].map((number) => ({ chargerId, number, maxPowerKw: 60 })),
          ),
        },
      },
    });
  }
  console.log(`seeded ${stations.length} stations`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
