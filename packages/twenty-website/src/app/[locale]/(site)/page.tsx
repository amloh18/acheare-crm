import {
  getRouteI18n,
  type LocaleRouteParams,
} from '@/platform/i18n/get-route-i18n';
import { buildRouteMetadata } from '@/platform/seo';
import { AchareCinemaLanding } from '@/sections/achare-cinema';

export const generateMetadata = buildRouteMetadata('home');

export default async function HomePage({
  params,
}: {
  params: Promise<LocaleRouteParams>;
}) {
  await getRouteI18n(params);

  return (
    <main style={{ backgroundColor: '#08090D', minHeight: '100vh' }}>
      <AchareCinemaLanding />
    </main>
  );
}

