import { getAWSSecrets } from '../third-party/secrets-manager';

/**
 * Add any synchronous config inputs here
 */
type ConfigConstructorArgs = {
  isDev: boolean;
  env: string;
  clientID: string;
  aws: AWSConfig;
  sentry: SentryConfig;
};

export class Config {
  private _isDev: boolean;
  private _env: string;
  private _clientID: string;
  private _aws: AWSConfig;
  private _sentry: SentryConfig;

  // Optional values for data that is loaded async
  private _clientSecret?: string;

  constructor({ isDev, env, clientID, aws, sentry }: ConfigConstructorArgs) {
    this._isDev = isDev;
    this._env = env;
    this._clientID = clientID;
    this._aws = aws;
    this._sentry = sentry;
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

  get clientSecret() {
    if (!this._clientSecret) {
      throw new Error('uninitialized');
    }
    return this._clientSecret;
  }

  set clientSecret(input: string) {
    this._clientSecret = input;
  }

  private async loadSecrets() {
    const secrets = await getAWSSecrets(this._aws);

    this.clientSecret = secrets.CLIENT_SECRET;
  }
}

export type AWSConfig = {
  region: string;
  secretsID: string;
};

export type SentryConfig = {
  enabled: boolean;
  dsn: string;
  traceSampleRate: number;
  errorSampleRate: number;
};
