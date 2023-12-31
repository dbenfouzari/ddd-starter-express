import type { IAppLogger } from "@shared/application/IAppLogger";
import type {
  IRequestLogger,
  LogRequestOptions,
} from "@shared/application/IRequestLogger";
import type { RequestHandler } from "express";

import chalk from "chalk";
import onFinished from "on-finished";
import { container, injectable } from "tsyringe";

import { SharedTokens } from "@shared/di/tokens";

@injectable()
export class ExpressLogger implements IRequestLogger {
  private logger = container.resolve<IAppLogger>(SharedTokens.AppLogger);

  logRequest =
    (options: LogRequestOptions = {}): RequestHandler =>
    (req, res, next) => {
      const start = Date.now();
      const method = req.method;
      const url = req.originalUrl;

      onFinished(res, (err, response) => {
        const timeElapsed = Date.now() - start;
        const code = response.statusCode;

        const coloredMethod = this.getColoredMethod(method);
        const coloredStatusCode = this.getColoredStatusCode(code);
        const coloredTimeElapsed = this.getColoredTimeElapsed(timeElapsed);

        this.logger.info(
          `${coloredMethod} ${chalk.gray(url)} ${coloredStatusCode} ${coloredTimeElapsed}`
        );

        if (options.logBody && req.body && Object.keys(req.body).length > 0) {
          this.logger.debug("↪ Request body:");
          console.table(req.body); // eslint-disable-line custom/prefer-use-logger
        }

        if (options.logHeaders && req.headers && Object.keys(req.headers).length > 0) {
          this.logger.debug("↪ Request headers:");
          console.log(req.headers); // eslint-disable-line custom/prefer-use-logger
        }

        if (options.logQuery && req.query && Object.keys(req.query).length > 0) {
          this.logger.debug("↪ Request query:");
          console.table(req.query); // eslint-disable-line custom/prefer-use-logger
        }

        if (options.logParams && req.params && Object.keys(req.params).length > 0) {
          this.logger.debug("↪ Request params:");
          console.table(req.params); // eslint-disable-line custom/prefer-use-logger
        }
      });

      next();
    };

  private getColoredMethod(method: string) {
    switch (method) {
      case "GET":
      default:
        return chalk.whiteBright.bold(method);
      case "POST":
        return chalk.greenBright.bold(method);
      case "PUT":
        return chalk.yellowBright.bold(method);
      case "DELETE":
        return chalk.redBright.bold(method);
    }
  }

  private getColoredStatusCode(statusCode: number) {
    switch (true) {
      case statusCode >= 200 && statusCode < 300:
      default:
        return chalk.green(statusCode);
      case statusCode >= 300 && statusCode < 400:
        return chalk.yellow(statusCode);
      case statusCode >= 400 && statusCode < 500:
        return chalk.yellow.bold(statusCode);
      case statusCode >= 500:
        return chalk.red.bold(statusCode);
    }
  }

  private getColoredTimeElapsed(timeElapsed: number) {
    switch (true) {
      case timeElapsed < 100:
      default:
        return chalk.gray(`${timeElapsed}ms`);
      case timeElapsed < 500:
        return chalk.yellow(`${timeElapsed}ms`);
      case timeElapsed >= 500:
        return chalk.red(`${timeElapsed}ms`);
    }
  }
}
