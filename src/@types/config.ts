import { getAWSSecrets } from '../third-party/secrets-manager';
import { ChainId } from '../utils/constants';

/**
 * Add any synchronous config inputs here
 */
type ConfigConstructorArgs = {
  isDev: boolean;
  env: string;
  clientID: string;
  aws: AWSConfig;
  sentry: SentryConfig;
  mintContracts: MintContractsConfig;
};

export class Config {
  private _isDev: boolean;
  private _env: string;
  private _clientID: string;
  private _aws: AWSConfig;
  private _sentry: SentryConfig;
  private _mintContracts: MintContractsConfig;

  // Optional values for data that is loaded async
  private _clientSecret?: string;
  private _quickNode?: QuickNodeConfig;
  private _wallet?: WalletConfig;

  constructor({
    isDev,
    env,
    clientID,
    aws,
    sentry,
    mintContracts,
  }: ConfigConstructorArgs) {
    this._isDev = isDev;
    this._env = env;
    this._clientID = clientID;
    this._aws = aws;
    this._sentry = sentry;
    this._mintContracts = mintContracts;
  }

  async init() {
    await this.loadSecrets();
  }

  get isDev(): boolean {
    return this._isDev;
  }

  get env(): string {
    return this._env;
  }

  get clientID(): string {
    return this._clientID;
  }

  get aws() {
    return this._aws;
  }

  get sentry(): SentryConfig {
    return this._sentry;
  }

  get mintContracts() {
    return this._mintContracts;
  }

  get clientSecret() {
    if (!this._clientSecret) {
      throw new Error('uninitialized');
    }
    return this._clientSecret;
  }

  set clientSecret(input: string) {
    this._clientSecret = input;
  }

  get quickNode(): QuickNodeConfig {
    if (!this._quickNode) {
      throw new Error('uninitialized');
    }

    return this._quickNode;
  }

  set quickNode(input: QuickNodeConfig) {
    this._quickNode = input;
  }

  get wallet(): WalletConfig {
    if (!this._wallet) {
      throw new Error('uninitialized');
    }

    return this._wallet;
  }

  set wallet(input: WalletConfig) {
    this._wallet = input;
  }

  private async loadSecrets() {
    const { secrets, walletSecrets } = await getAWSSecrets(this._aws);

    this.clientSecret = secrets.CLIENT_SECRET;

    this.quickNode = {
      ethereum: {
        endpoint: 'https://icy-misty-glade.quiknode.pro',
        api_token: secrets.QN_ETHEREUM_API_KEY,
      },
      rinkeby: {
        endpoint: 'https://patient-hidden-waterfall.rinkeby.quiknode.pro',
        api_token: secrets.QN_RINKEBY_API_KEY,
      },
      polygon: {
        endpoint: 'https://morning-purple-snowflake.matic.quiknode.pro',
        api_token: secrets.QN_POLYGON_API_KEY,
      },
      mumbai: {
        endpoint: 'https://delicate-proud-surf.matic-testnet.quiknode.pro',
        api_token: secrets.QN_MUMBAI_API_KEY,
      },
    };

    this.wallet = {
      address: walletSecrets.ETH_WALLET,
      pk: walletSecrets.ETH_WALLET_PK,
    };
  }
}

export type AWSConfig = {
  region: string;
  secretsID: string;
  walletSecretsID: string;
};

export type SentryConfig = {
  enabled: boolean;
  dsn: string;
  traceSampleRate: number;
  errorSampleRate: number;
};

type MintContractsConfig = {
  [roleLevel: string]: {
    chainId: ChainId;
    contract: string;
  };
};

type QuickNodeConfig = {
  ethereum: QuickNodeEndpoint;
  rinkeby: QuickNodeEndpoint;
  polygon: QuickNodeEndpoint;
  mumbai: QuickNodeEndpoint;
};

type QuickNodeEndpoint = {
  endpoint: string;
  api_token: string;
};

type WalletConfig = {
  address: string;
  pk: string;
};
