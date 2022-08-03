import { init } from './init';
import express from 'express';
import * as Sentry from '@sentry/node';
import { CaptureConsole } from '@sentry/integrations';
import rest from './servers/rest';
import { getSentryConfig } from './utils/config';

import './controllers/cache';

const sentryConfig = getSentryConfig();
Sentry.init({
  enabled: sentryConfig.enabled,
  dsn: sentryConfig.dsn,
  tracesSampleRate: sentryConfig.traceSampleRate,
  sampleRate: sentryConfig.errorSampleRate,
  integrations: [
    new CaptureConsole({
      levels: ['error', 'fatal'],
    }),
  ],
  release: process.env.SLASHAUTH_COMMIT_HASH,
  environment: process.env.DEMO_ENV || 'local',
});

(async () => {
  await init();
  const app = express();

  rest(app);

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log('Listening on port', port);
  });
})();
