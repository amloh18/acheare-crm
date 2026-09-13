export type ReadinessCheckStatus = 'up' | 'degraded' | 'down';

export type ReadinessOverallStatus = 'ok' | 'degraded' | 'unavailable';

export type ReadinessProbeOutcome = {
  status: ReadinessCheckStatus;
  message?: string;
};

export type ReadinessCheckResult = {
  name: string;
  status: ReadinessCheckStatus;
  latencyMs: number;
  message?: string;
};

export type ReadinessReport = {
  status: ReadinessOverallStatus;
  version: string | null;
  checks: ReadinessCheckResult[];
  timestamp: string;
};

/**
 * A cheap liveness/readiness probe for one dependency.
 *
 * `fatal` decides whether a `down` outcome makes the whole instance
 * unready. The worker is deliberately non-fatal: a running server with no
 * worker can still serve reads and writes, it just cannot process queues.
 */
export interface ReadinessProbe {
  readonly name: string;
  readonly fatal: boolean;
  check(): Promise<ReadinessProbeOutcome>;
}

export const READINESS_PROBES = Symbol('READINESS_PROBES');
