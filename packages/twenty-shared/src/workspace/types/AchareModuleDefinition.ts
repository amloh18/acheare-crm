import { type AchareFeatureKey } from './AchareFeatureKey';
import { type AchareModuleKey } from './AchareModuleKey';

/**
 * Describes an Achare product module (a top-level navigation grouping).
 */
export type AchareModuleDefinition = {
  key: AchareModuleKey;
  label: string;
  description: string;
  icon: string;
  /** Display order of the module in navigation and onboarding. */
  position: number;
  /** Universal identifier of the navigation folder backing this module. */
  navigationFolderUniversalIdentifier?: string;
  /** Features belonging to this module, in display order. */
  features: AchareFeatureKey[];
  /** Whether the module receives a dedicated onboarding configuration step. */
  hasOnboardingStep: boolean;
  /** Roles recommended when this module is enabled. */
  recommendedRoles?: string[];
  /** Dashboard keys recommended when this module is enabled. */
  recommendedDashboards?: string[];
};
