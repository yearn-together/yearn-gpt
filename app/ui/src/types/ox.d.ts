declare module "ox" {
  // Override the problematic Error class to fix TypeScript compilation issues
  export class OxError extends Error {
    cause?: unknown;
    constructor(message: string, options?: { cause?: unknown });
  }
}
