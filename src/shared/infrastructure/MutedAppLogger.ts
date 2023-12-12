import type { IAppLogger } from "@shared/application/IAppLogger";

import { inject, injectable } from "tsyringe";

import { LoggingLevel } from "@shared/application/IAppLogger";
import { SharedTokens } from "@shared/di/tokens";

@injectable()
export class MutedAppLogger implements IAppLogger {
  constructor(@inject(SharedTokens.LoggerMode) readonly mode: LoggingLevel) {}

  /**
   * Returns the current logging level.
   * @returns The current logging level.
   */
  public getLevel(): LoggingLevel {
    return this.mode;
  }

  debug(): void {}

  error(): void {}

  info(): void {}

  trace(): void {}

  warn(): void {}
}
