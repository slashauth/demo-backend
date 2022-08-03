import express from 'express';
import { slashauthClient } from '../third-party/slashauth_client';
import { CONSTANTS } from '../utils/constants';

declare module 'express-serve-static-core' {
  interface Request {
    clientID?: string;
    walletAddress?: string;
    isAuthed?: boolean;
  }
}

export const parseAuthToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    if (req.method !== 'OPTIONS') {
      const authHeader = req.headers.authorization;
      const clientID = req.headers[CONSTANTS.CLIENT_ID_HEADER];

      if (authHeader && clientID && typeof clientID === 'string') {
        const tokenParts = authHeader.trim().split(/\s+/);
        if (
          tokenParts.length === 2 &&
          tokenParts[0].toLowerCase() === 'bearer'
        ) {
          const resp = await slashauthClient.validateToken({
            token: tokenParts[1],
          });

          req.walletAddress = resp.address;
          req.isAuthed = true;
          req.clientID = resp.clientID;
        }
      }
    }
  } catch (err) {}
  next();
  return;
};
