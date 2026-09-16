import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import {
  ACHARE_FEATURES,
  ACHARE_MODULES,
  ACHARE_MODULE_ORDER,
  type AchareFeatureKey,
  type AchareModuleKey,
} from 'twenty-shared/workspace';
import { IconCheck, useIcons } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type AchareFeatureCompositionEditorProps = {
  /** The features currently selected / enabled. */
  selectedFeatures: AchareFeatureKey[];
  onToggleModule: (moduleKey: AchareModuleKey) => void;
  /**
   * When provided, the per-feature chips become toggles. Omit it to render
   * them as a read-only summary.
   */
  onToggleFeature?: (feature: AchareFeatureKey) => void;
  disabled?: boolean;
};

const StyledModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledModuleCard = styled.div<{
  isSelected: boolean;
  isPartiallySelected: boolean;
}>`
  align-items: flex-start;
  background: ${({ isSelected, isPartiallySelected }) =>
    isSelected || isPartiallySelected
      ? themeCssVariables.background.transparent.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected, isPartiallySelected }) =>
      isSelected || isPartiallySelected
        ? themeCssVariables.border.color.blue
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  box-sizing: border-box;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  min-width: 0;
  padding: ${themeCssVariables.spacing[4]};
  transition:
    background 0.12s ease,
    border-color 0.12s ease;
  width: 100%;

  &:hover {
    border-color: ${themeCssVariables.border.color.blue};
  }
`;

const StyledModuleToggle = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  padding: 0;

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid ${themeCssVariables.border.color.blue};
    outline-offset: 2px;
  }
`;

const StyledModuleIndicator = styled.div<{
  isSelected: boolean;
  isPartiallySelected: boolean;
}>`
  align-items: center;
  background: ${({ isSelected, isPartiallySelected }) =>
    isSelected || isPartiallySelected
      ? themeCssVariables.color.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected, isPartiallySelected }) =>
      isSelected || isPartiallySelected
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  height: 18px;
  justify-content: center;
  margin-top: 1px;
  width: 18px;
`;

const StyledModuleDash = styled.div`
  background: ${themeCssVariables.font.color.inverted};
  border-radius: 1px;
  height: 2px;
  width: 8px;
`;

const StyledModuleText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const StyledModuleLabelRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  min-width: 0;
`;

const StyledModuleLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  min-width: 0;
`;

const StyledModuleCount = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  flex-shrink: 0;
  font-size: ${themeCssVariables.font.size.xs};
  margin-left: auto;
  white-space: nowrap;
`;

const StyledModuleDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const StyledFeatureTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[2]};
  min-width: 0;
`;

const StyledFeatureTag = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.pill};
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.tertiary};
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledFeatureTagButton = styled.button<{ isSelected: boolean }>`
  align-items: center;
  background: ${({ isSelected }) =>
    isSelected ? themeCssVariables.background.primary : 'transparent'};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.border.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.pill};
  box-sizing: border-box;
  color: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  text-overflow: ellipsis;
  transition:
    border-color 0.12s ease,
    color 0.12s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: ${themeCssVariables.border.color.blue};
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid ${themeCssVariables.border.color.blue};
    outline-offset: 2px;
  }
`;

/**
 * The module / feature composition list.
 *
 * Shared by onboarding's feature-selection step and the Setup Center so the two
 * never disagree about what a module contains or what "partially selected"
 * means. Callers own the surrounding affordances (presets, dependency notices,
 * save buttons) because those differ between composing a new workspace and
 * re-configuring an existing one.
 */
export const AchareFeatureCompositionEditor = ({
  selectedFeatures,
  onToggleModule,
  onToggleFeature,
  disabled = false,
}: AchareFeatureCompositionEditorProps) => {
  const { t } = useLingui();
  const { getIcon } = useIcons();
  const selectedFeatureSet = new Set(selectedFeatures);

  return (
    <StyledModuleList>
      {ACHARE_MODULE_ORDER.map((moduleKey) => {
        const module = ACHARE_MODULES[moduleKey];
        const selectedCount = module.features.filter((feature) =>
          selectedFeatureSet.has(feature),
        ).length;
        const isSelected =
          selectedCount === module.features.length &&
          module.features.length > 0;
        const isPartiallySelected = selectedCount > 0 && !isSelected;
        const Icon = getIcon(module.icon);

        return (
          <StyledModuleCard
            key={moduleKey}
            isSelected={isSelected}
            isPartiallySelected={isPartiallySelected}
          >
            <StyledModuleToggle
              type="button"
              onClick={() => onToggleModule(moduleKey)}
              disabled={disabled}
              aria-label={
                isSelected
                  ? t`Turn off ${module.label}`
                  : t`Turn on ${module.label}`
              }
              aria-pressed={isSelected}
            >
              <StyledModuleIndicator
                isSelected={isSelected}
                isPartiallySelected={isPartiallySelected}
              >
                {isSelected && (
                  <IconCheck
                    size={12}
                    color={themeCssVariables.font.color.inverted}
                  />
                )}
                {isPartiallySelected && <StyledModuleDash />}
              </StyledModuleIndicator>
            </StyledModuleToggle>
            <StyledModuleText>
              <StyledModuleLabelRow>
                <Icon size={14} color={themeCssVariables.font.color.tertiary} />
                <StyledModuleLabel>{module.label}</StyledModuleLabel>
                <StyledModuleCount>
                  {selectedCount === 0
                    ? t`Off`
                    : t`${selectedCount} of ${module.features.length} on`}
                </StyledModuleCount>
              </StyledModuleLabelRow>
              <StyledModuleDescription>
                {module.description}
              </StyledModuleDescription>
              <StyledFeatureTagRow>
                {module.features.map((feature) => {
                  const featureLabel = ACHARE_FEATURES[feature].label;
                  const isFeatureSelected = selectedFeatureSet.has(feature);

                  return onToggleFeature === undefined ? (
                    <StyledFeatureTag key={feature}>
                      {featureLabel}
                    </StyledFeatureTag>
                  ) : (
                    <StyledFeatureTagButton
                      key={feature}
                      type="button"
                      isSelected={isFeatureSelected}
                      onClick={() => onToggleFeature(feature)}
                      disabled={disabled}
                      aria-pressed={isFeatureSelected}
                    >
                      {isFeatureSelected && <IconCheck size={10} />}
                      {featureLabel}
                    </StyledFeatureTagButton>
                  );
                })}
              </StyledFeatureTagRow>
            </StyledModuleText>
          </StyledModuleCard>
        );
      })}
    </StyledModuleList>
  );
};
