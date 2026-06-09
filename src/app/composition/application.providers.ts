import {
  EnvironmentProviders,
  Provider,
} from '@angular/core';
import { Repository } from 'typeorm/browser';

import { UserController } from '../services/controllers/user/user.controller';
import { UserEntity } from '../services/entities/user/user.entity';
import { UserRepository } from '../services/repositories/user/user.repository';
import { UserService } from '../services/services/user/user.service';
import { getRepositoryToken } from '../typeorm/repositories/repository-token';
import { provideRepository } from '../typeorm/repositories/repository.providers';
import { TypeOrmUserRepository } from '../typeorm/repositories/user.typeorm-repository';
import { USER_REPOSITORY } from './application.tokens';

export function provideApplicationServices(): Array<EnvironmentProviders | Provider> {
  return [
    provideRepository(UserEntity),
    {
      provide: USER_REPOSITORY,
      deps: [getRepositoryToken(UserEntity)],
      useFactory: (repository: Repository<UserEntity>): UserRepository =>
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
