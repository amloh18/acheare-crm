import { AchareFeatureKey } from '@/workspace/types/AchareFeatureKey';
import {
  getDisabledAchareStandardObjectKeys,
  isAchareDashboardEnabled,
} from '@/workspace/utils/getAchareFeatureVisibility';

describe('getDisabledAchareStandardObjectKeys', () => {
  it('should return undefined when no feature configuration is loaded', () => {
    expect(getDisabledAchareStandardObjectKeys(undefined)).toBeUndefined();
  });

  it('should return no keys when every feature is enabled', () => {
    expect(
      getDisabledAchareStandardObjectKeys(Object.values(AchareFeatureKey)),
    ).toEqual([]);
  });

  it('should return the standard object keys of disabled features only', () => {
    const enabledFeatures = [
      AchareFeatureKey.COMPANIES,
      AchareFeatureKey.EMPLOYEES,
    ];

    const disabledKeys = getDisabledAchareStandardObjectKeys(enabledFeatures);

    expect(disabledKeys).toContain('opportunity');
    expect(disabledKeys).toContain('payslip');
    expect(disabledKeys).not.toContain('company');
    expect(disabledKeys).not.toContain('employee');
  });

  it('should be the exact complement of the enabled features', () => {
    const enabledFeatures = [AchareFeatureKey.COMPANIES];
    const disabledKeys = getDisabledAchareStandardObjectKeys(enabledFeatures);

    // Every catalogue entry gates exactly one standard object, so the disabled
    // list holds one key per disabled feature.
    expect(disabledKeys).toHaveLength(
      Object.values(AchareFeatureKey).length - 1,
    );
  });
});

describe('isAchareDashboardEnabled', () => {
  it('should be visible when no feature configuration is loaded', () => {
    expect(
      isAchareDashboardEnabled({
        widgetStandardObjectKeys: ['opportunity'],
        enabledFeatures: undefined,
      }),
    ).toBe(true);
  });

  it('should be visible when the dashboard has no object-backed widgets', () => {
    expect(
      isAchareDashboardEnabled({
        widgetStandardObjectKeys: [null, undefined],
        enabledFeatures: [],
      }),
    ).toBe(true);
  });

  it('should be visible when at least one widget object is enabled', () => {
    expect(
      isAchareDashboardEnabled({
        widgetStandardObjectKeys: ['opportunity', 'employee'],
        enabledFeatures: [AchareFeatureKey.EMPLOYEES],
      }),
    ).toBe(true);
  });

  it('should be hidden when every widget object is gated by a disabled feature', () => {
    expect(
      isAchareDashboardEnabled({
        widgetStandardObjectKeys: ['opportunity', 'company'],
        enabledFeatures: [AchareFeatureKey.EMPLOYEES],
      }),
    ).toBe(false);
  });

  it('should be visible when a widget object is not gated by any feature', () => {
    expect(
      isAchareDashboardEnabled({
        widgetStandardObjectKeys: ['timelineActivity'],
        enabledFeatures: [],
      }),
    ).toBe(true);
  });
});
