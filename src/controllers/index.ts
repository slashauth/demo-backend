import { AppController } from './app';
import { EventController } from './event';
import { UserController } from './user';

interface Controllers {
  app: AppController;
  event: EventController;
  user: UserController;
}

const CreateControllers = (): Controllers => {
  const cont: Controllers = {
    app: new AppController(),
    event: new EventController(),
    user: new UserController(),
  };

  return cont;
};

export const controllers = CreateControllers();
