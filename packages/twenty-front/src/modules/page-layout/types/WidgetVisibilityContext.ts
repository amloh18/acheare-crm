export type WidgetVisibilityContext = {
  device: 'MOBILE' | 'DESKTOP';
  selectedRecords: Record<string, unknown>[];
  // Remove with the workspace workflow and workflowVersion objects, once the
  // core migration owns them.
  hiddenFieldMetadataIdsOrNames?: string[];
  // Object metadata ids hidden because the Achare product feature that gates
  // them is disabled in this workspace. Object-backed widgets pointing at one
  // of these are dropped, so a dashboard only ever shows the modules its
  // workspace actually has.
  hiddenObjectMetadataIdsForDisabledFeatures?: string[];
};
