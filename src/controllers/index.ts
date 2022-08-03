import { AppController } from './app';
import { EthController } from './eth';
import { EventController } from './event';
import { UserController } from './user';

interface Controllers {
  app: AppController;
  eth: EthController;
  event: EventController;
  user: UserController;
}

const CreateControllers = (): Controllers => {
  const cont: Controllers = {
    app: new AppController(),
    eth: new EthController(),
    event: new EventController(),
    user: new UserController(),
  };

  return cont;
};

export const controllers = CreateControllers();
