import express from 'express';
import { parseAuthToken } from '../middleware/auth';
import { getAppMetadata } from '../routes/app';
import { addEvent, getEvents } from '../routes/event';
import { healthCheck } from '../routes/health_check';
import { getMe, getUsers, patchMe } from '../routes/user';
import { wrapAsync } from '../utils/routes';

export default (app: express.Application) => {
  const cors = require('cors')({ origin: true });
  app.use(cors);
  app.use(express.json());
  app.use(parseAuthToken);

  app.get('/', wrapAsync(healthCheck));

  app.get('/metadata', wrapAsync(getAppMetadata));

  app.get('/events', wrapAsync(getEvents));
  app.get('/users', wrapAsync(getUsers));

  app.get('/me', wrapAsync(getMe));

  app.patch('/me', wrapAsync(patchMe));

  app.post('/event', wrapAsync(addEvent));
};
