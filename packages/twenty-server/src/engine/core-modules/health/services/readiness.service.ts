import { Inject, Injectable } from '@nestjs/common';

import {
  READINESS_PROBE_TIMEOUT_MS,
  READINESS_REPORT_CACHE_TTL_MS,
} from 'src/engine/core-modules/health/constants/readiness-probe.constant';
import {
  READINESS_PROBES,
  type ReadinessCheckResult,
  type ReadinessProbe,
  type ReadinessReport,
} from 'src/engine/core-modules/health/types/readiness-check.type';
import { describeError } from 'src/engine/core-modules/health/utils/describe-error.util';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { withDeadline } from 'src/utils/with-deadline';

@Injectable()
export class ReadinessService {
  private cachedReport: { report: ReadinessReport; expiresAt: number } | null =
    null;
  private inFlightReport: Promise<ReadinessReport> | null = null;

  constructor(
    @Inject(READINESS_PROBES)
    private readonly probes: ReadinessProbe[],
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  async getReadinessReport(): Promise<ReadinessReport> {
    const cachedReport = this.cachedReport;

    if (cachedReport && cachedReport.expiresAt > Date.now()) {
      return cachedReport.report;
    }

    // Share one set of probes between concurrent scrapes instead of stacking
    // them up on the database.
    if (this.inFlightReport) {
      return this.inFlightReport;
    }

    this.inFlightReport = this.runProbes();

    try {
      const report = await this.inFlightReport;

      this.cachedReport = {
        report,
        expiresAt: Date.now() + READINESS_REPORT_CACHE_TTL_MS,
      };

      return report;
    } finally {
      this.inFlightReport = null;
    }
  }

  private async runProbes(): Promise<ReadinessReport> {
    const probeResults = await Promise.all(
      this.probes.map(async (probe) => {
        const startedAt = Date.now();

        try {
          const outcome = await withDeadline({
            promise: probe.check(),
            timeoutMs: READINESS_PROBE_TIMEOUT_MS,
            createTimeoutError: () =>
              new Error(`${probe.name} probe timed out`),
          });

          return {
            name: probe.name,
            fatal: probe.fatal,
            status: outcome.status,
            message: outcome.message,
            latencyMs: Date.now() - startedAt,
          };
        } catch (error) {
          return {
            name: probe.name,
            fatal: probe.fatal,
            status: 'down' as const,
            message: describeError(error),
            latencyMs: Date.now() - startedAt,
          };
        }
      }),
    );

    return {
      status: this.resolveOverallStatus(probeResults),
      version: this.twentyConfigService.get('APP_VERSION') ?? null,
      checks: probeResults.map(
        ({ name, status, message, latencyMs }): ReadinessCheckResult => ({
          name,
          status,
          latencyMs,
          ...(message ? { message } : {}),
        }),
      ),
      timestamp: new Date().toISOString(),
    };
  }

  private resolveOverallStatus(
    results: { status: ReadinessCheckResult['status']; fatal: boolean }[],
  ): ReadinessReport['status'] {
    if (results.some((result) => result.fatal && result.status === 'down')) {
      return 'unavailable';
    }

    if (results.some((result) => result.status !== 'up')) {
      return 'degraded';
    }

    return 'ok';
  }
}
