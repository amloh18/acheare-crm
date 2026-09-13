// A readiness probe is hit by container healthchecks and load balancers on a
// tight interval, so every check has to be cheap and bounded.
export const READINESS_PROBE_TIMEOUT_MS = 2000;

// Collapses concurrent scrapes (docker healthcheck + orchestrator + doctor)
// onto one set of probes, so a 3-second healthcheck interval does not turn
// into three database round trips per 3 seconds.
export const READINESS_REPORT_CACHE_TTL_MS = 2000;

export const READINESS_STORAGE_PROBE_FOLDER = 'readiness-probe';
export const READINESS_STORAGE_PROBE_FILENAME = 'write-test';
export const READINESS_STORAGE_PROBE_CONTENT = 'achare-readiness-probe';
