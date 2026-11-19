import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  // WEEK 2+: add your modules here (StationsModule, WalletModule, ...)
  imports: [PrismaModule, HealthModule],
})
export class AppModule {}
