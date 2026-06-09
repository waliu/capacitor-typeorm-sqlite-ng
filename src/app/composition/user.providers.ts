import {
  EnvironmentProviders,
  Provider,
} from '@angular/core';
import { Repository } from 'typeorm/browser';

import { UserTypeormEntity } from '../database/entities/user/user.typeorm-entity';
import { TypeOrmUserRepository } from '../database/repositories/user/user.typeorm-repository';
import { UserController } from '../services/controllers/user/user.controller';
import { UserRepository } from '../services/repositories/user/user.repository';
import { UserService } from '../services/services/user/user.service';
import { getRepositoryToken } from '../typeorm/repositories/repository-token';
import { provideRepository } from '../typeorm/repositories/repository.providers';
import { USER_REPOSITORY } from './application.tokens';

export function provideUserServices(): Array<EnvironmentProviders | Provider> {
  return [
    provideRepository(UserTypeormEntity),
    {
      provide: USER_REPOSITORY,
      deps: [getRepositoryToken(UserTypeormEntity)],
      useFactory: (repository: Repository<UserTypeormEntity>): UserRepository =>
        new TypeOrmUserRepository(repository),
    },
    {
      provide: UserService,
      deps: [USER_REPOSITORY],
      useFactory: (userRepository: UserRepository): UserService =>
        new UserService(userRepository),
    },
    {
      provide: UserController,
      deps: [UserService],
      useFactory: (userService: UserService): UserController =>
        new UserController(userService),
    },
  ];
}
