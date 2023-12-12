import type { DateTime } from "@shared/domain/value-objects/DateTime";

export interface ITimestamped {
  readonly createdAt: DateTime;
  readonly updatedAt: DateTime;
}
