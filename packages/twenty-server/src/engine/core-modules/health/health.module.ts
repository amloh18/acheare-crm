import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from 'src/engine/core-modules/health/controllers/health.controller';
import { ReadyController } from 'src/engine/core-modules/health/controllers/ready.controller';
import { DatabaseReadinessProbe } from 'src/engine/core-modules/health/probes/database-readiness.probe';
import { RedisReadinessProbe } from 'src/engine/core-modules/health/probes/redis-readiness.probe';
import { StorageReadinessProbe } from 'src/engine/core-modules/health/probes/storage-readiness.probe';
import { WorkerReadinessProbe } from 'src/engine/core-modules/health/probes/worker-readiness.probe';
import { ReadinessService } from 'src/engine/core-modules/health/services/readiness.service';
import {
  READINESS_PROBES,
  type ReadinessProbe,
} from 'src/engine/core-modules/health/types/readiness-check.type';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController, ReadyController],
  providers: [
    DatabaseReadinessProbe,
    RedisReadinessProbe,
    StorageReadinessProbe,
    WorkerReadinessProbe,
    {
      provide: READINESS_PROBES,
      useFactory: (
        databaseProbe: DatabaseReadinessProbe,
        redisProbe: RedisReadinessProbe,
        storageProbe: StorageReadinessProbe,
        workerProbe: WorkerReadinessProbe,
      ): ReadinessProbe[] => [
        databaseProbe,
        redisProbe,
        storageProbe,
        workerProbe,
      ],
      inject: [
        DatabaseReadinessProbe,
        RedisReadinessProbe,
        StorageReadinessProbe,
        WorkerReadinessProbe,
      ],
    },
    ReadinessService,
  ],
})
export class HealthModule {}
