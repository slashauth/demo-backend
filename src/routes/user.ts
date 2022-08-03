import { Handler } from 'express';
import { controllers } from '../controllers';
import { isEmpty } from '../utils/strings';

export const getMe: Handler = async (request, response) => {
  try {
    // Make sure the user is authed
    if (request.isAuthed && request.clientID && request.walletAddress) {
      const clientID = request.clientID;
      const address = request.walletAddress;

      if (
        typeof clientID === 'string' &&
        !isEmpty(clientID) &&
        typeof address === 'string' &&
        !isEmpty(address)
      ) {
        const user = await controllers.user.getMe(clientID, address);
        return response.status(200).json(user);
      }
    }
    return response.sendStatus(403);
  } catch (err) {
    return response.sendStatus(400);
  }
};

export const patchMe: Handler = async (request, response) => {
  try {
    if (request.isAuthed && request.clientID && request.walletAddress) {
      const clientID = request.clientID;
      const address = request.walletAddress;

      const { nickname } = request.body;

      if (
        typeof clientID === 'string' &&
        !isEmpty(clientID) &&
        typeof address === 'string' &&
        !isEmpty(address) &&
        typeof nickname === 'string' &&
        !isEmpty(nickname)
      ) {
        const user = await controllers.user.patchMe(
          clientID,
          address,
          nickname
        );
        return response.status(200).json(user);
      }
    }
    return response.sendStatus(403);
  } catch (err) {
    return response.sendStatus(400);
  }
};

export const getUsers: Handler = async (request, response) => {
  try {
    // Make sure the user is authed
    if (request.isAuthed && request.clientID && request.walletAddress) {
      const clientID = request.clientID;
      const address = request.walletAddress;
      const cursor = request.query.cursor;

      if (typeof clientID === 'string' && !isEmpty(clientID)) {
        const users = await controllers.user.getUsers(
          clientID,
          address,
          cursor as string
        );

        return response.status(200).json(users);
      }
    }
    return response.sendStatus(400);
  } catch (err) {
    if (err instanceof Error && err.message === 'unauthenticated') {
      return response.sendStatus(403);
    }
    return response.sendStatus(400);
  }
};

export const mintNFT: Handler = async (request, response) => {
  try {
    // Make sure the user is authed
    if (request.isAuthed && request.clientID && request.walletAddress) {
      const clientID = request.clientID;
      const address = request.walletAddress;
      const { roleLevel } = request.body;

      if (
        typeof clientID === 'string' &&
        !isEmpty(clientID) &&
        typeof roleLevel === 'string' &&
        !isEmpty(roleLevel) &&
        typeof address === 'string' &&
        !isEmpty(address)
      ) {
        const resp = await controllers.eth.mintToken(
          clientID,
          roleLevel,
          address
        );
        return response.status(200).json(resp);
      }
    }
    return response.sendStatus(403);
  } catch (err) {
    console.error(err);
    return response.sendStatus(400);
  }
};
