import type { IAppLogger, LoggingLevel } from "@shared/application/IAppLogger";
import type { IRequestLogger } from "@shared/application/IRequestLogger";
import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { SharedTokens } from "@shared/di/tokens";
import { ExpressLogger } from "@shared/infrastructure/ExpressLogger";
import { Logger } from "@shared/infrastructure/Logger";
import { getLoggerModeFromString } from "@shared/utils/get-logger-mode-from-string";

export class SharedDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies() {
    this.container.register<IRequestLogger>(SharedTokens.RequestLogger, {
      useClass: ExpressLogger,
    });
    this.container.register<LoggingLevel>(SharedTokens.LoggerMode, {
      useValue: getLoggerModeFromString(process.env.LOGGING_MODE),
    });
    this.container.register<IAppLogger>(SharedTokens.AppLogger, {
      useClass: Logger,
    });
  }
}
