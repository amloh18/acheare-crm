import { atom } from 'jotai';

export type AchareSetupStatusType = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface AchareSetupProgress {
  status: AchareSetupStatusType;
  mode: 'GUIDED' | 'MANUAL' | null;
  currentStep: string | null;
  completedSteps: string[];
  completedAt: string | null;
  setupVersion: number | null;
}

export const acheareSetupProgressState = atom<AchareSetupProgress | null>(null);
