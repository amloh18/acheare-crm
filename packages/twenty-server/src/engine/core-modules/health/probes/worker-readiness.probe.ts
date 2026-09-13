import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { READINESS_PROBE_TIMEOUT_MS } from 'src/engine/core-modules/health/constants/readiness-probe.constant';
import {
  type ReadinessProbe,
  type ReadinessProbeOutcome,
} from 'src/engine/core-modules/health/types/readiness-check.type';
import { describeError } from 'src/engine/core-modules/health/utils/describe-error.util';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { withDeadline } from 'src/utils/with-deadline';

// WorkerHealthIndicator walks every queue and pulls metrics; that is right for
// the admin dashboard and far too heavy for a healthcheck. Readiness only asks
// "is any worker connected at all?", on two representative queues.
const READINESS_WORKER_QUEUES = [
  MessageQueue.cronQueue,
  MessageQueue.emailQueue,
] as const;

@Injectable()
export class WorkerReadinessProbe implements ReadinessProbe {
  readonly name = 'worker';

  // Non-fatal by design: the API still serves requests with no worker running,
  // it just stops processing queues. The report surfaces that as `degraded`.
  readonly fatal = false;

  constructor(private readonly redisClientService: RedisClientService) {}

  async check(): Promise<ReadinessProbeOutcome> {
    try {
      const connection = this.redisClientService.getQueueClient();

      const workerCount = await withDeadline({
        promise: this.countConnectedWorkers(connection),
        timeoutMs: READINESS_PROBE_TIMEOUT_MS,
        createTimeoutError: () => new Error('worker lookup timed out'),
      });

      if (workerCount === 0) {
        return {
          status: 'degraded',
          message: 'no queue workers are connected',
        };
      }

      return { status: 'up', message: `${workerCount} workers connected` };
    } catch (error) {
      return {
        status: 'degraded',
        message: `could not inspect queues: ${describeError(error)}`,
      };
    }
  }

  private async countConnectedWorkers(
    connection: ReturnType<RedisClientService['getQueueClient']>,
  ): Promise<number> {
    let workerCount = 0;

    for (const queueName of READINESS_WORKER_QUEUES) {
      const queue = new Queue(queueName, { connection });

      try {
        workerCount += (await queue.getWorkers()).length;
      } finally {
        await queue.close();
      }
    }

    return workerCount;
  }
}
