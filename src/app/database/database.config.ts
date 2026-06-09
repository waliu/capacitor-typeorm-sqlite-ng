import { DatabaseOptions } from '../typeorm/database-options';
import { UserEntity } from '../services/entities/user/user.entity';
import { InitializePlatformDb1730764800000 } from './migrations/initialize-platform-db';

export const appDatabaseOptions: DatabaseOptions = {
  databaseName: 'transaction',
  schema: {
    entities: [UserEntity],
    migrations: [InitializePlatformDb1730764800000],
  },
};
