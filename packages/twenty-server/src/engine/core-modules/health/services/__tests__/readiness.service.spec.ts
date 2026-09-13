import { ApiPath } from 'twenty-shared/types';

import { READINESS_REPORT_CACHE_TTL_MS } from 'src/engine/core-modules/health/constants/readiness-probe.constant';
import { ReadinessService } from 'src/engine/core-modules/health/services/readiness.service';
import {
  type ReadinessProbe,
  type ReadinessProbeOutcome,
} from 'src/engine/core-modules/health/types/readiness-check.type';
import { type TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

const buildProbe = ({
  name,
  fatal,
  outcome,
}: {
  name: string;
  fatal: boolean;
  outcome: () => Promise<ReadinessProbeOutcome>;
}): ReadinessProbe => ({
  name,
  fatal,
  check: jest.fn(outcome),
});

const buildUpProbes = (): ReadinessProbe[] => [
  buildProbe({
    name: 'database',
    fatal: true,
    outcome: async () => ({ status: 'up', message: '3 migrations applied' }),
  }),
  buildProbe({
    name: 'redis',
    fatal: true,
    outcome: async () => ({ status: 'up' }),
  }),
  buildProbe({
    name: 'storage',
    fatal: true,
    outcome: async () => ({ status: 'up', message: 'LOCAL driver writable' }),
  }),
  buildProbe({
    name: 'worker',
    fatal: false,
    outcome: async () => ({ status: 'up', message: '2 workers connected' }),
  }),
];

const buildService = (
  probes: ReadinessProbe[],
  appVersion: string | null = '1.2.3',
) =>
  new ReadinessService(probes, {
    get: jest.fn().mockReturnValue(appVersion),
  } as unknown as TwentyConfigService);

describe('ReadinessService', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('reports ok with every check up', async () => {
    const service = buildService(buildUpProbes());

    const report = await service.getReadinessReport();

    expect(report.status).toBe('ok');
    expect(report.version).toBe('1.2.3');
    expect(report.checks.map((check) => check.name)).toEqual([
      'database',
      'redis',
      'storage',
      'worker',
    ]);
    expect(report.checks.every((check) => check.status === 'up')).toBe(true);
    expect(report.checks.every((check) => check.latencyMs >= 0)).toBe(true);
    expect(new Date(report.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('reports unavailable when a fatal dependency is down', async () => {
    const probes = buildUpProbes();

    probes[0] = buildProbe({
      name: 'database',
      fatal: true,
      outcome: async () => ({
        status: 'down',
        message: 'database unreachable: ECONNREFUSED',
      }),
    });

    const service = buildService(probes);
    const report = await service.getReadinessReport();

    expect(report.status).toBe('unavailable');
    expect(report.checks[0]).toEqual(
      expect.objectContaining({
        name: 'database',
        status: 'down',
        message: 'database unreachable: ECONNREFUSED',
      }),
    );
  });

  it('reports degraded (not unavailable) when only the non-fatal worker check fails', async () => {
    const probes = buildUpProbes();

    probes[3] = buildProbe({
      name: 'worker',
      fatal: false,
      outcome: async () => ({
        status: 'degraded',
        message: 'no queue workers are connected',
      }),
    });

    const service = buildService(probes);
    const report = await service.getReadinessReport();

    expect(report.status).toBe('degraded');
    expect(
      report.checks.find((check) => check.name === 'worker')?.status,
    ).toBe('degraded');
  });

  it('turns a thrown probe into a down check instead of rejecting', async () => {
    const probes = buildUpProbes();

    probes[2] = buildProbe({
      name: 'storage',
      fatal: true,
      outcome: async () => {
        throw new Error('access denied');
      },
    });

    const service = buildService(probes);
    const report = await service.getReadinessReport();

    expect(report.status).toBe('unavailable');
    expect(
      report.checks.find((check) => check.name === 'storage'),
    ).toEqual(
      expect.objectContaining({ status: 'down', message: 'access denied' }),
    );
  });

  it('bounds a hanging probe instead of waiting for it', async () => {
    jest.useFakeTimers();

    const probes = buildUpProbes();

    probes[1] = buildProbe({
      name: 'redis',
      fatal: true,
      outcome: () => new Promise<ReadinessProbeOutcome>(() => undefined),
    });

    const service = buildService(probes);
    const reportPromise = service.getReadinessReport();

    await jest.advanceTimersByTimeAsync(2000);
    const report = await reportPromise;

    expect(report.status).toBe('unavailable');
    expect(report.checks.find((check) => check.name === 'redis')).toEqual(
      expect.objectContaining({
        status: 'down',
        message: 'redis probe timed out',
      }),
    );
  });

  it('omits the message key when a probe has nothing to say', async () => {
    const service = buildService(buildUpProbes());

    const report = await service.getReadinessReport();
    const redisCheck = report.checks.find((check) => check.name === 'redis');

    expect(redisCheck).not.toBeUndefined();
    expect(Object.keys(redisCheck as object)).not.toContain('message');
  });

  it('serves cached results within the TTL and re-probes after it', async () => {
    jest.useFakeTimers();

    const probes = buildUpProbes();
    const service = buildService(probes);

    await service.getReadinessReport();
    await service.getReadinessReport();

    expect(probes[0].check).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(READINESS_REPORT_CACHE_TTL_MS + 1);
    await service.getReadinessReport();

    expect(probes[0].check).toHaveBeenCalledTimes(2);
  });

  it('shares one probe run between concurrent scrapes', async () => {
    const probes = buildUpProbes();
    const service = buildService(probes);

    const [firstReport, secondReport] = await Promise.all([
      service.getReadinessReport(),
      service.getReadinessReport(),
    ]);

    expect(probes[0].check).toHaveBeenCalledTimes(1);
    expect(firstReport).toBe(secondReport);
  });

  it('reports a null version when APP_VERSION is unset', async () => {
    const service = buildService(buildUpProbes(), null);

    const report = await service.getReadinessReport();

    expect(report.version).toBeNull();
  });

  // The compose healthchecks and `achare doctor` depend on these exact paths;
  // renaming the enum member silently breaks container health reporting.
  it('keeps the documented health and readiness routes stable', () => {
    expect(ApiPath.Health).toBe('healthz');
    expect(ApiPath.Ready).toBe('readyz');
  });
});
