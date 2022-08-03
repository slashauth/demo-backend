import {
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import * as Sentry from '@sentry/node';
import { Secrets, WalletSecrets } from '../@types/aws';
import { AWSConfig } from '../@types/config';

type SecretsResponse = {
  secrets: Secrets;
  walletSecrets: WalletSecrets;
};

export const getAWSSecrets = async (
  conf: AWSConfig
): Promise<SecretsResponse> => {
  let client = new SecretsManagerClient({ region: conf.region });

  // input
  const secretParams: GetSecretValueCommandInput = {
    SecretId: conf.secretsID,
  };
  const walletSecretParams: GetSecretValueCommandInput = {
    SecretId: conf.walletSecretsID,
  };

  try {
    const secretData = await client.send(
      new GetSecretValueCommand(secretParams)
    );
    const walletData = await client.send(
      new GetSecretValueCommand(walletSecretParams)
    );

    // fetch secret string from results
    let secretString: string;
    if (secretData.SecretString) {
      secretString = secretData.SecretString;
    } else if (secretData.SecretBinary) {
      const buff = Buffer.from(secretData.SecretBinary);
      secretString = buff.toString();
    } else {
      throw new Error('Secrets Manager did not return any secrets');
    }

    let walletSecretString: string;
    if (walletData.SecretString) {
      walletSecretString = walletData.SecretString;
    } else if (walletData.SecretBinary) {
      const buff = Buffer.from(walletData.SecretBinary);
      walletSecretString = buff.toString();
    } else {
      throw new Error('Secrets Manager did not return any secrets');
    }

    return {
      secrets: JSON.parse(secretString) as Secrets,
      walletSecrets: JSON.parse(walletSecretString) as WalletSecrets,
    };
  } catch (err) {
    Sentry.captureException(err);
    console.error(err);
    throw err;
  }
};
