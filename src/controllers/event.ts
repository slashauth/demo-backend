import { slashauthClient } from '../third-party/slashauth_client';
import { CONSTANTS } from '../utils/constants';

type Event = {
  name: string;
  description?: string;
  link: string;
  dateTime: string;
};

export class EventController {
  getEventsController = async (
    clientID: string,
    address: string
  ): Promise<Event[]> => {
    try {
      if (
        (
          await slashauthClient.hasRole({
            address,
            role: CONSTANTS.MEMBER_ROLE_LEVEL,
          })
        ).result?.hasRole
      ) {
        const roleMetadataResp = await slashauthClient.getAppRoleMetadata({
          role: CONSTANTS.MEMBER_ROLE_LEVEL,
        });

        if (!roleMetadataResp.result || !roleMetadataResp.result.data) {
          throw new Error(
            `getAppRoleMetadata did not return a result for clientID ${clientID}`
          );
        }

        const events = roleMetadataResp.result.data[CONSTANTS.EVENTS_KEY];

        return (events as Event[]) || [];
      } else {
        throw new Error('unauthenticated');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  putEventController = async (
    clientID: string,
    address: string,
    input: Event
  ): Promise<Event> => {
    try {
      if (
        (
          await slashauthClient.hasRole({
            address,
            role: CONSTANTS.ADMIN_ROLE_LEVEL,
          })
        ).result?.hasRole
      ) {
        // Fetch roleMetadata
        const roleMetadataResp = await slashauthClient.getAppRoleMetadata({
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
        await slashauthClient.updateAppRoleMetadata({
          role: CONSTANTS.MEMBER_ROLE_LEVEL,
          metadata,
        });

        return input;
      } else {
        throw new Error('unauthenticated');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
