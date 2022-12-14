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
    const [userResp, , getUserErr] = await slashauthClient.user.getUserByID({
      userID,
    });

    if (getUserErr) {
      console.error(getUserErr);
      throw getUserErr;
    }

    if (!userResp) {
      throw new Error(
        `getUserByID did not return a result for clientID ${clientID} and user ${userID}`
      );
    }

    return {
      clientID: userResp.data.clientID,
      address: userResp.data.wallet,
      nickname: userResp.data.nickname,
      roles: userResp.data.roles,
      metadata: userResp.data.metadata,
      dateTime: userResp.data.createdAt,
    };
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
    const [updateResp, , updateUserErr] = await slashauthClient.user.updateUserMetadata({
      userID,
      nickname,
    });

    if (updateUserErr) {
      console.error(updateUserErr);
      throw updateUserErr;
    }

    if (!updateResp) {
      throw new Error(
        `updateUserMetadata did not return a result for clientID ${clientID} and user ${userID}`
      );
    }

    return {
      clientID: updateResp.data.clientID,
      address: updateResp.data.wallet,
      nickname: updateResp.data.nickname,
      roles: updateResp.data.roles,
      metadata: updateResp.data.metadata,
      dateTime: updateResp.data.createdAt,
    };
  };

  /**
   * getUsers fetches all the users for the clientID
   * @param clientID
   * @param address
   * @param cursor
   * @returns
   */
  getUsers = async (clientID: string, cursor?: string): Promise<User[]> => {
    let hasMore = true;
    const allUsers: User[] = [];

    while (hasMore) {
      const [users, metadata, err] = await slashauthClient.user.getUsers({ cursor });

      if (err) {
        console.error(err);
        throw err;
      }

      if (!users) {
        throw new Error(
          `getUsers did not return a result for clientID ${clientID}`
        );
      }

      users.forEach((elem) => {
        allUsers.push({
          clientID: elem.clientID,
          address: elem.wallet,
          nickname: elem.nickname,
          roles: elem.roles,
          metadata: elem.metadata,
          dateTime: elem.createdAt,
        });
      });

      hasMore = metadata.hasMore;
      cursor = metadata.cursor;
    }

    return allUsers;
  };
}
