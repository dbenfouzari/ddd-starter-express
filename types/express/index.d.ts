import type { TokenPayload } from "@auth/application/services/IJWTService";

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}
