import { slashauthClient } from '../third-party/slashauth_client';

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
   * @param userID
   * @returns
   */
  getMe = async (clientID: string, userID: string): Promise<User> => {
    try {
      const userResp = await slashauthClient.user.getUserByID({
        userID,
      });

      if (!userResp.result || !userResp.result.data) {
        throw new Error(
          `getUserByID did not return a result for clientID ${clientID} and user ${userID}`
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
   * @param userID
   * @param nickname
   * @returns
   */
  patchMe = async (
    clientID: string,
    userID: string,
    nickname: string
  ): Promise<User> => {
    try {
      const updateResp = await slashauthClient.user.updateUserMetadata({
        userID,
        nickname,
      });

      if (!updateResp.result || !updateResp.result.data) {
        throw new Error(
          `updateUserMetadata did not return a result for clientID ${clientID} and user ${userID}`
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
  getUsers = async (clientID: string, cursor?: string): Promise<User[]> => {
    try {
      let hasMore = true;
      const users: User[] = [];

      while (hasMore) {
        const usersResp = await slashauthClient.user.getUsers({ cursor });

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
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
