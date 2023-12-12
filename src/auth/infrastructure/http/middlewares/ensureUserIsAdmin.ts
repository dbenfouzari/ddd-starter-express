// noinspection JSUnusedGlobalSymbols

import type { RequestHandler } from "express";

import { UserRoles } from "@auth/domain/value-objects/UserRole";

/**-
 * @openapi
 * components:
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - exception
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: false
 *                 nullable: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 description: The exception.
 *                 example: Unauthorized
 *                 nullable: false
 *                 enum: [Unauthorized]
 *     Forbidden:
 *       description: User has no permission to access this resource.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - exception
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: false
 *                 nullable: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 description: The exception.
 *                 example: Forbidden
 *                 nullable: false
 *                 enum: [Forbidden]
 */
export const ensureUserIsAdmin: RequestHandler = async (req, res, next) => {
  const userPayload = req.user!;

  if (userPayload.role !== UserRoles.ADMIN) {
    return res.status(403).json({
      success: false,
      exception: "Forbidden",
    });
  }

  next();
};
