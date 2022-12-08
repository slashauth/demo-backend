import { slashauthClient } from '../third-party/slashauth_client';

type AppRecord = {
  clientID: string;
  name: string;
  description?: string;
};

export class AppController {
  /**
   * getAppMetadataController returns the appMetadata to render the home page
   * @param clientID
   * @returns
   */
  getAppMetadataController = async (clientID: string): Promise<AppRecord> => {
    try {
      const appResp = await slashauthClient.app.getInfo();

      if (!appResp.result || !appResp.result.data) {
        throw new Error(
          `getApp did not return a result for clientID ${clientID}`
        );
      }

      return {
        clientID: appResp.result.data.clientID,
        name: appResp.result.data.name,
        description: appResp.result.data.description,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
