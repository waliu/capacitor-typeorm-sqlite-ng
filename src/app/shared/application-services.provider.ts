import { InjectionToken, Provider } from '@angular/core';

import { createApplicationServices } from '../services/service.providers';
import { UserController } from '../services/controllers/user/user.controller';
import { DatabaseService } from '../typeorm/database.service';

export const USER_CONTROLLER = new InjectionToken<UserController>('USER_CONTROLLER');

export function provideApplicationServices(): Provider[] {
  return [
    {
      provide: USER_CONTROLLER,
      deps: [DatabaseService],
      useFactory: (databaseService: DatabaseService) =>
        createApplicationServices(databaseService).userController,
    },
  ];
}
