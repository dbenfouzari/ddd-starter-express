import type { Router } from "express";

export interface IRoute {
  register(): Router;
}
