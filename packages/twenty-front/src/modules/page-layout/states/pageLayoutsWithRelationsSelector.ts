import { metadataStoreState } from '@/metadata-store/states/metadataStoreState';
import { type FlatPageLayout } from '@/metadata-store/types/FlatPageLayout';
import { type FlatPageLayoutTab } from '@/metadata-store/types/FlatPageLayoutTab';
import { type FlatPageLayoutWidget } from '@/metadata-store/types/FlatPageLayoutWidget';
import { objectMetadataItemsWithFieldsSelector } from '@/object-metadata/states/objectMetadataItemsWithFieldsSelector';
import { type PageLayout } from '@/page-layout/types/PageLayout';
import { buildFallbackRecordPageLayout } from '@/page-layout/utils/buildFallbackRecordPageLayout';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';
import { isDefined } from 'twenty-shared/utils';
import { PageLayoutType, ViewType } from '~/generated-metadata/graphql';

export const pageLayoutsWithRelationsSelector = createAtomSelector<
  PageLayout[]
>({
  key: 'pageLayoutsWithRelationsSelector',
  get: ({ get }) => {
    const flatPageLayouts = get(metadataStoreState, 'pageLayouts')
      .current as FlatPageLayout[];
    const allFlatTabs = get(metadataStoreState, 'pageLayoutTabs')
      .current as FlatPageLayoutTab[];
    const allFlatWidgets = get(metadataStoreState, 'pageLayoutWidgets')
      .current as FlatPageLayoutWidget[];

    const activeFlatWidgets = allFlatWidgets.filter(
      (widget) => widget.isActive,
    );

    const tabsByPageLayoutId = new Map<string, FlatPageLayoutTab[]>();
    const widgetsByTabId = new Map<string, FlatPageLayoutWidget[]>();

    for (const tab of allFlatTabs) {
      const existing = tabsByPageLayoutId.get(tab.pageLayoutId);

      if (isDefined(existing)) {
        existing.push(tab);
      } else {
        tabsByPageLayoutId.set(tab.pageLayoutId, [tab]);
      }
    }

    for (const widget of activeFlatWidgets) {
      const existing = widgetsByTabId.get(widget.pageLayoutTabId);

      if (isDefined(existing)) {
        existing.push(widget);
      } else {
        widgetsByTabId.set(widget.pageLayoutTabId, [widget]);
      }
    }

    const mappedPageLayouts = flatPageLayouts.map((flatPageLayout) => ({
      ...flatPageLayout,
      tabs: (tabsByPageLayoutId.get(flatPageLayout.id) ?? []).map((tab) => ({
        ...tab,
        widgets: widgetsByTabId.get(tab.id) ?? [],
      })),
    }));

    const existingRecordPageObjectMetadataIds = new Set(
      mappedPageLayouts
        .filter(
          (layout) =>
            layout.type === PageLayoutType.RECORD_PAGE &&
            isDefined(layout.objectMetadataId),
        )
        .map((layout) => layout.objectMetadataId as string),
    );

    const objectMetadataItems = get(objectMetadataItemsWithFieldsSelector);

    const allViews = (get(metadataStoreState, 'views')?.current ?? []) as {
      id: string;
      objectMetadataId: string;
      type: ViewType;
    }[];

    const fallbackLayouts: PageLayout[] = [];

    for (const objectMetadataItem of objectMetadataItems) {
      if (
        objectMetadataItem.isActive &&
        !existingRecordPageObjectMetadataIds.has(objectMetadataItem.id)
      ) {
        const fieldsWidgetView = allViews.find(
          (v) =>
            v.objectMetadataId === objectMetadataItem.id &&
            v.type === ViewType.FIELDS_WIDGET,
        );

        fallbackLayouts.push(
          buildFallbackRecordPageLayout({
            objectMetadataItem,
            fieldsWidgetViewId: fieldsWidgetView?.id,
          }),
        );
      }
    }

    return [...mappedPageLayouts, ...fallbackLayouts];
  },
});

