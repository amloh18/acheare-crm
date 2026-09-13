// Readiness bodies are scraped by operators and printed by `achare doctor`,
// so they need a one-line reason rather than a serialized Error.
export const describeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'unknown error';
  }
};
