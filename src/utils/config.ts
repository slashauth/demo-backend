import { Config, SentryConfig } from '../@types/config';
import { ChainId, CONSTANTS, ENV } from './constants';

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
      secretsID: `/demo/slashauth/secrets`,
      walletSecretsID: '/demo/slashauth/wallet',
    },
    sentry: getSentryConfig(),
    mintContracts: {
      [CONSTANTS.ADMIN_ROLE_LEVEL]: {
        chainId: ChainId.Polygon,
        contract: '0x3B7e292022C862DD39Cc4F36E75c243bf44246d0',
      },
      [CONSTANTS.MEMBER_ROLE_LEVEL]: {
        chainId: ChainId.Polygon,
        contract: '0x757F46D81a8259281Da43854F624a5923C03E000',
      },
    },
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
      walletSecretsID: '',
    },
    sentry: getSentryConfig(),
    mintContracts: {
      [CONSTANTS.ADMIN_ROLE_LEVEL]: {
        chainId: ChainId.Mumbai,
        contract: '0x5fd0c2FF34E5db8cfF94d43bEb5B1F0875729cC4',
      },
      [CONSTANTS.MEMBER_ROLE_LEVEL]: {
        chainId: ChainId.Mumbai,
        contract: '0xE3Ad2f0aC315Af5c73Ff07E5C5813f3Db04dcf95',
      },
    },
  });

  if (
    !process.env.CLIENT_SECRET ||
    !process.env.QN_ETHEREUM_API_KEY ||
    !process.env.QN_RINKEBY_API_KEY ||
    !process.env.QN_POLYGON_API_KEY ||
    !process.env.QN_MUMBAI_API_KEY ||
    !process.env.ETH_WALLET ||
    !process.env.ETH_WALLET_PK
  ) {
    throw new Error('.env file must exist with correct keys');
  }

  conf.clientSecret = process.env.CLIENT_SECRET;

  const ethWallet = process.env.ETH_WALLET;
  const ethWalletPk = process.env.ETH_WALLET_PK;

  conf.quickNode = {
    ethereum: {
      endpoint: 'https://icy-misty-glade.quiknode.pro',
      api_token: process.env.QN_ETHEREUM_API_KEY,
    },
    rinkeby: {
      endpoint: 'https://patient-hidden-waterfall.rinkeby.quiknode.pro',
      api_token: process.env.QN_RINKEBY_API_KEY,
    },
    polygon: {
      endpoint: 'https://morning-purple-snowflake.matic.quiknode.pro',
      api_token: process.env.QN_POLYGON_API_KEY,
    },
    mumbai: {
      endpoint: 'https://delicate-proud-surf.matic-testnet.quiknode.pro',
      api_token: process.env.QN_MUMBAI_API_KEY,
    },
  };

  conf.wallet = {
    address: ethWallet,
    pk: ethWalletPk,
  };

  return conf;
};

const GetConfig = (): Config => {
  let env = process.env.DEMO_ENV;

  switch (env) {
    case ENV.DEMO:
      return readProdConfig();
      break;
    case ENV.LOCAL:
    default:
      return readLocalConfig();
      break;
  }
};

export const conf = GetConfig();
