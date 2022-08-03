import { slashauthClient } from '../third-party/slashauth_client';
import { CONSTANTS } from '../utils/constants';

type User = {
  clientID: string;
  address: string;
  nickname?: string;
  roles: string[];
  metadata?: { [key: string]: any };
  dateTime: string;
};

export class UserController {
  /**
   * getMe gets the current user's data
   * @param clientID
   * @param address
   * @returns
   */
  getMe = async (clientID: string, address: string): Promise<User> => {
    try {
      const userResp = await slashauthClient.getUserByID({ userID: address });

      if (!userResp.result || !userResp.result.data) {
        throw new Error(
          `getUserByID did not return a result for clientID ${clientID} and address ${address}`
        );
      }

      return {
        clientID: userResp.result.data.clientID,
        address: userResp.result.data.wallet,
        nickname: userResp.result.data.nickname,
        roles: userResp.result.data.roles,
        metadata: userResp.result.data.metadata,
        dateTime: userResp.result.data.createdAt,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * patchMe allows the current user to update their data
   * @param clientID
   * @param address
   * @param nickname
   * @returns
   */
  patchMe = async (
    clientID: string,
    address: string,
    nickname: string
  ): Promise<User> => {
    try {
      const updateResp = await slashauthClient.updateUserMetadata({
        userID: address,
        nickname,
      });

      if (!updateResp.result || !updateResp.result.data) {
        throw new Error(
          `updateUserMetadata did not return a result for clientID ${clientID} and address ${address}`
        );
      }

      return {
        clientID: updateResp.result.data.clientID,
        address: updateResp.result.data.wallet,
        nickname: updateResp.result.data.nickname,
        roles: updateResp.result.data.roles,
        metadata: updateResp.result.data.metadata,
        dateTime: updateResp.result.data.createdAt,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * getUsers fetches all the users for the clientID
   * @param clientID
   * @param address
   * @param cursor
   * @returns
   */
  getUsers = async (
    clientID: string,
    address: string,
    cursor?: string
  ): Promise<User[]> => {
    try {
      if (
        (
          await slashauthClient.hasRole({
            address,
            role: CONSTANTS.ADMIN_ROLE_LEVEL,
          })
        ).result?.hasRole
      ) {
        let hasMore = true;
        const users: User[] = [];

        while (hasMore) {
          const usersResp = await slashauthClient.getUsers({ cursor });

          if (!usersResp.result || !usersResp.result.data) {
            throw new Error(
              `getUsers did not return a result for clientID ${clientID}`
            );
          }

          usersResp.result.data.forEach((elem) => {
            users.push({
              clientID: elem.clientID,
              address: elem.wallet,
              nickname: elem.nickname,
              roles: elem.roles,
              metadata: elem.metadata,
              dateTime: elem.createdAt,
            });
          });

          hasMore = usersResp.result.hasMore;
          cursor = usersResp.result.cursor;
        }

        return users;
      } else {
        throw new Error('unauthenticated');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
