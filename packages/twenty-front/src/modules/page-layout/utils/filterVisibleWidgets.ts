import { type PageLayoutTab } from '@/page-layout/types/PageLayoutTab';
import { type WidgetVisibilityContext } from '@/page-layout/types/WidgetVisibilityContext';
import { evaluateWidgetVisibility } from '@/page-layout/utils/evaluateWidgetVisibility';
import { isFieldWidget } from '@/page-layout/widgets/field/utils/isFieldWidget';
import { isDefined } from 'twenty-shared/utils';

type FilterVisibleWidgetsParams = {
  widgets: PageLayoutTab['widgets'];
  context: WidgetVisibilityContext;
};

export const filterVisibleWidgets = ({
  widgets,
  context,
}: FilterVisibleWidgetsParams): PageLayoutTab['widgets'] => {
  // Remove with the workspace workflow and workflowVersion objects, once the
  // core migration owns them.
  const hiddenFieldMetadataIdsOrNames =
    context.hiddenFieldMetadataIdsOrNames ?? [];

  const hiddenObjectMetadataIdsForDisabledFeatures =
    context.hiddenObjectMetadataIdsForDisabledFeatures ?? [];

  return widgets.filter((widget) => {
    // A widget backed by an object whose Achare feature is disabled is dropped
    // outright — unlike a conditional display, this is not something the user
    // configured and cannot be overridden by an expression.
    if (
      isDefined(widget.objectMetadataId) &&
      hiddenObjectMetadataIdsForDisabledFeatures.includes(
        widget.objectMetadataId,
      )
    ) {
      return false;
    }

    if (
      isFieldWidget(widget) &&
      hiddenFieldMetadataIdsOrNames.includes(
        widget.configuration.fieldMetadataId,
      )
    ) {
      return false;
    }

    return evaluateWidgetVisibility({
      conditionalAvailabilityExpression:
        widget.conditionalAvailabilityExpression,
      conditionalDisplay: widget.conditionalDisplay,
      context,
    });
  });
};
