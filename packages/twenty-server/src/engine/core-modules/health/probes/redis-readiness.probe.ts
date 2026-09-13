import { Injectable } from '@nestjs/common';

import { READINESS_PROBE_TIMEOUT_MS } from 'src/engine/core-modules/health/constants/readiness-probe.constant';
import {
  type ReadinessProbe,
  type ReadinessProbeOutcome,
} from 'src/engine/core-modules/health/types/readiness-check.type';
import { describeError } from 'src/engine/core-modules/health/utils/describe-error.util';
import { RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { withDeadline } from 'src/utils/with-deadline';

@Injectable()
export class RedisReadinessProbe implements ReadinessProbe {
  readonly name = 'redis';
  readonly fatal = true;

  constructor(private readonly redisClientService: RedisClientService) {}

  async check(): Promise<ReadinessProbeOutcome> {
    try {
      const reply = await withDeadline({
        promise: this.redisClientService.getClient().ping(),
        timeoutMs: READINESS_PROBE_TIMEOUT_MS,
        createTimeoutError: () => new Error('redis PING timed out'),
      });

      if (reply !== 'PONG') {
        return {
          status: 'down',
          message: `unexpected PING reply: ${reply}`,
        };
      }

      return { status: 'up' };
    } catch (error) {
      return { status: 'down', message: describeError(error) };
    }
  }
}
