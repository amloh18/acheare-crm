export const ACHARE_IGNORED_OBJECT_NAMES = new Set([
  'rocket',
  'pet',
  'surveyResult',
  'employmentHistory',
  'petCareAgreement',
  'starHistory',
]);

export const isAchareIgnoredObject = (nameSingular?: string | null): boolean =>
  Boolean(nameSingular && ACHARE_IGNORED_OBJECT_NAMES.has(nameSingular));
