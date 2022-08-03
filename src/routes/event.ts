import { Handler } from 'express';
import { controllers } from '../controllers';
import { isEmpty } from '../utils/strings';

export const getEvents: Handler = async (request, response) => {
  try {
    // Make sure the user is authed
    if (request.isAuthed && request.clientID && request.walletAddress) {
      const clientID = request.clientID;
      const address = request.walletAddress;

      if (typeof clientID === 'string' && !isEmpty(clientID)) {
        const events = await controllers.event.getEventsController(
          clientID,
          address
        );

        return response.status(200).json(events);
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

export const addEvent: Handler = async (request, response) => {
  try {
    // Make sure the user is authed
    if (request.isAuthed && request.clientID && request.walletAddress) {
      const clientID = request.clientID;
      const address = request.walletAddress;

      const { name, description, link, dateTime } = request.body;

      if (
        typeof clientID === 'string' &&
        !isEmpty(clientID) &&
        typeof name === 'string' &&
        !isEmpty(name) &&
        typeof dateTime === 'string' &&
        !isEmpty(dateTime)
      ) {
        const event = await controllers.event.putEventController(
          clientID,
          address,
          {
            name,
            dateTime,
            description,
            link,
          }
        );

        return response.status(200).json(event);
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
