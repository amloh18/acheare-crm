import { styled } from '@linaria/react';
import {
  ACHARE_FEATURES,
  ACHARE_MODULES,
  ACHARE_MODULE_ORDER,
  type AchareFeatureKey,
  type AchareModuleKey,
} from 'twenty-shared/workspace';
import { useIcons } from 'twenty-ui/icon';
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
      : themeCssVariables.background.secondary};
  border: 1px solid
    ${({ isSelected, isPartiallySelected }) =>
      isSelected || isPartiallySelected
        ? themeCssVariables.border.color.blue
        : 'transparent'};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  transition: border-color 0.15s ease;
  width: 100%;
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
  border-radius: 50%;
  display: flex;
  height: 16px;
  justify-content: center;
  width: 16px;
`;

const StyledModuleDot = styled.div`
  background: ${themeCssVariables.font.color.inverted};
  border-radius: 50%;
  height: 6px;
  width: 6px;
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
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledModuleLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledModuleDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

const StyledFeatureTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
  margin-top: ${themeCssVariables.spacing[1]};
`;

const StyledFeatureTag = styled.span`
  background: ${themeCssVariables.background.primary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: 1px ${themeCssVariables.spacing[2]};
`;

const StyledFeatureTagButton = styled.button<{ isSelected: boolean }>`
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.background.primary
      : themeCssVariables.background.secondary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.border.color.blue
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.font.color.secondary
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.xs};
  padding: 1px ${themeCssVariables.spacing[2]};

  &:disabled {
    cursor: default;
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
              aria-label={module.label}
              aria-pressed={isSelected}
            >
              <StyledModuleIndicator
                isSelected={isSelected}
                isPartiallySelected={isPartiallySelected}
              >
                {(isSelected || isPartiallySelected) && <StyledModuleDot />}
              </StyledModuleIndicator>
            </StyledModuleToggle>
            <StyledModuleText>
              <StyledModuleLabelRow>
                <Icon
                  size={14}
                  color={themeCssVariables.font.color.tertiary}
                />
                <StyledModuleLabel>{module.label}</StyledModuleLabel>
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
