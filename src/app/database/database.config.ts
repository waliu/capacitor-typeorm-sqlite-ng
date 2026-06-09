import { DatabaseOptions } from '../typeorm/database-options';
import { UserTypeormEntity } from './entities/user.typeorm-entity';
import { InitializePlatformDb1730764800000 } from './migrations/initialize-platform-db';

export const appDatabaseOptions: DatabaseOptions = {
  databaseName: 'transaction',
  schema: {
    entities: [UserTypeormEntity],
    migrations: [InitializePlatformDb1730764800000],
  },
};
