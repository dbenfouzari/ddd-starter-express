import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { AuthRoutesTokens } from "@auth/di/tokens";

import { GetMeRoute } from "./GetMeRoute";
import { LogUserInRoute } from "./LogUserInRoute";
import { LogUserOutRoute } from "./LogUserOutRoute";
import { RefreshUserTokenRoute } from "./RefreshUserTokenRoute";
import { SignUserUpRoute } from "./SignUserUpRoute";

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: |
 *       `Authentication` operations.
 *
 *       User can log in, log out, refresh token, etc.
 * @openapi
 * components:
 *   responses:
 *     UserListResponse:
 *       description: The user response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - users
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: true
 *                 nullable: false
 *                 enum: [true]
 *                 default: true
 *               users:
 *                 type: array
 *                 description: The users.
 *                 items:
 *                   $ref: "#/components/schemas/User"
 */
@injectable()
export class AuthRoutes implements IAppRouterV1 {
  _apiVersion = 1000 as const;
  router = Router();

  constructor(
    @inject(AuthRoutesTokens.LogUserInRoute) private logUserInRoute: LogUserInRoute,
    @inject(AuthRoutesTokens.GetMeRoute) private getMeRoute: GetMeRoute,
    @inject(AuthRoutesTokens.RefreshUserTokenRoute)
    private refreshUserTokenRoute: RefreshUserTokenRoute,
    @inject(AuthRoutesTokens.SignUserUpRoute) private signUserUpRoute: SignUserUpRoute,
    @inject(AuthRoutesTokens.LogUserOutRoute) private logUserOutRoute: LogUserOutRoute
  ) {
    this.register();
  }

  private register() {
    this.router.use(this.logUserInRoute.register());
    this.router.use(this.getMeRoute.register());
    this.router.use(this.refreshUserTokenRoute.register());
    this.router.use(this.signUserUpRoute.register());
    this.router.use(this.logUserOutRoute.register());
  }
}
