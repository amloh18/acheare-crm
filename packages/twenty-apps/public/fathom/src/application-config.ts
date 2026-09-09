import { defineApplication } from 'twenty-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  logo: 'public/logo.svg',
  author: 'Twenty',
  category: 'Productivity',
  websiteUrl: 'https://docs.morigird.com/developers/extend/apps/getting-started',
  termsUrl: 'https://www.morigird.com/terms',
  emailSupport: 'contact@morigird.com',
  issueReportUrl: 'https://github.com/twentyhq/twenty/issues',
  galleryImages: [
    'public/gallery/fathom-cover-image-1.png',
    'public/gallery/fathom-cover-image-2.png',
  ],
  serverVariables: {
    FATHOM_CLIENT_ID: {
      description: 'OAuth client ID from the Twenty Fathom application.',
      isSecret: false,
      isRequired: true,
    },
    FATHOM_CLIENT_SECRET: {
      description: 'OAuth client secret from the Twenty Fathom application.',
      isSecret: true,
      isRequired: true,
    },
  },
});
