import { Config, SentryConfig } from '../@types/config';
import { ENV } from './constants';

import 'dotenv/config';

export const getSentryConfig = (): SentryConfig => {
  let env = process.env.DEMO_ENV;

  switch (env) {
    case ENV.DEMO:
      return {
        dsn: '',
        traceSampleRate: 0.0,
        errorSampleRate: 0.0,
        enabled: true,
      };
    default:
      return {
        dsn: '',
        traceSampleRate: 0.0,
        errorSampleRate: 0.0,
        enabled: false,
      };
  }
};

const readProdConfig = (): Config => {
  const conf = new Config({
    isDev: false,
    env: 'demo',
    clientID: 'clientID',
    aws: {
      region: 'us-west-2',
      secretsID: ``,
    },
    sentry: getSentryConfig(),
  });

  return conf;
};

const readLocalConfig = (): Config => {
  const conf = new Config({
    isDev: true,
    env: 'local',
    clientID: 'clientID',
    aws: {
      region: 'us-west-2',
      secretsID: '',
    },
    sentry: getSentryConfig(),
  });

  if (!process.env.CLIENT_SECRET) {
    throw new Error('.env file must exist with CLIENT_SECRET');
  }

  conf.clientSecret = process.env.CLIENT_SECRET;

  return conf;
};

const GetConfig = (): Config => {
  let env = process.env.DEMO_ENV;

  switch (env) {
    case ENV.DEMO:
      return readProdConfig();
    case ENV.LOCAL:
    default:
      return readLocalConfig();
  }
};

export const conf = GetConfig();
