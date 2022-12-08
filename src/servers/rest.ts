import { SlashauthMiddlewareExpress } from '@slashauth/express';
import express from 'express';
import { getAppMetadata } from '../routes/app';
import { addEvent, getEvents } from '../routes/event';
import { healthCheck } from '../routes/health_check';
import { getMe, getUsers, patchMe } from '../routes/user';
import { slashauthClient } from '../third-party/slashauth_client';
import { CONSTANTS } from '../utils/constants';
import { wrapAsync } from '../utils/routes';

export default (app: express.Application) => {
  const cors = require('cors')({ origin: true });
  const middleware = new SlashauthMiddlewareExpress(slashauthClient);
  app.use(cors);
  app.use(express.json());

  // Middleware to parse the slashauth token
  app.use(middleware.validateCredentials);

  app.get('/', wrapAsync(healthCheck));

  app.get('/metadata', wrapAsync(getAppMetadata));

  // Middleware to check roles
  app.get(
    '/events',
    middleware.hasRole(CONSTANTS.MEMBER_ROLE_LEVEL),
    wrapAsync(getEvents)
  );
  app.get(
    '/users',
    middleware.hasRole(CONSTANTS.ADMIN_ROLE_LEVEL),
    wrapAsync(getUsers)
  );

  app.get('/me', wrapAsync(getMe));

  app.patch('/me', wrapAsync(patchMe));

  app.post(
    '/event',
    middleware.hasRole(CONSTANTS.ADMIN_ROLE_LEVEL),
    wrapAsync(addEvent)
  );
};
