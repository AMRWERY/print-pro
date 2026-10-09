export type Validatable = { validate: () => Promise<{ valid: boolean }> };

export interface TrackStage {
  n: number;
  key: string;
  title: string;
  body: string;
  /** Planned completion time. */
  at: Date;
  status: StepStatus;
}
