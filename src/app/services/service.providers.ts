import { DataSourceProvider } from './common/data-source-provider';
import { UserController } from './controllers/user/user.controller';
import { TypeOrmUserRepository } from './repositories/user/user.typeorm-repository';
import { UserService } from './services/user/user.service';

export interface ApplicationServices {
  userController: UserController;
}

export function createApplicationServices(
  dataSourceProvider: DataSourceProvider,
): ApplicationServices {
  const userRepository = new TypeOrmUserRepository(dataSourceProvider);
  const userService = new UserService(userRepository);

  return {
    userController: new UserController(dataSourceProvider, userService),
  };
}
