import { DatabaseOptions } from '../typeorm/database-options';

export const appDatabaseOptions: DatabaseOptions = {
  databaseName: '<%= databaseName %>',
  schema: {
    entities: [],
    migrations: [],
  },
};
