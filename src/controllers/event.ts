import { slashauthClient } from '../third-party/slashauth_client';
import { CONSTANTS } from '../utils/constants';

type Event = {
  name: string;
  description?: string;
  link: string;
  dateTime: string;
};

export class EventController {
  getEventsController = async (clientID: string): Promise<Event[]> => {
    try {
      const roleMetadataResp = await slashauthClient.app.getRoleRestrictedData({
        role: CONSTANTS.MEMBER_ROLE_LEVEL,
      });

      if (!roleMetadataResp.result || !roleMetadataResp.result.data) {
        throw new Error(
          `getAppRoleMetadata did not return a result for clientID ${clientID}`
        );
      }

      const events = roleMetadataResp.result.data[CONSTANTS.EVENTS_KEY];

      return (events as Event[]) || [];
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  putEventController = async (
    clientID: string,
    input: Event
  ): Promise<Event> => {
    try {
      // Fetch roleMetadata
      const roleMetadataResp = await slashauthClient.app.getRoleRestrictedData({
        role: CONSTANTS.MEMBER_ROLE_LEVEL,
      });

      if (!roleMetadataResp.result || !roleMetadataResp.result.data) {
        throw new Error(
          `getAppRoleMetadata did not return a result for clientID ${clientID}`
        );
      }

      const metadata = roleMetadataResp.result.data;

      // Check if events already exist. If they do, append. If not, create a new array
      if (metadata[CONSTANTS.EVENTS_KEY]) {
        metadata[CONSTANTS.EVENTS_KEY].push(input);
      } else {
        metadata[CONSTANTS.EVENTS_KEY] = [input];
      }

      // Update metadata
      await slashauthClient.app.updateRoleRestrictedData({
        role: CONSTANTS.MEMBER_ROLE_LEVEL,
        metadata,
      });

      return input;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
