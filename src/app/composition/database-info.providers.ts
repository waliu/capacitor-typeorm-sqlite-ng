import { Provider } from '@angular/core';

import { DATABASE_INFO, DatabaseInfo } from '../shared/database-info';
import { DatabaseService } from '../typeorm/database.service';

export function provideDatabaseInfo(): Provider {
  return {
    provide: DATABASE_INFO,
    deps: [DatabaseService],
    useFactory: (database: DatabaseService): DatabaseInfo => ({
      databaseName: database.databaseName,
      platform: database.platform,
    }),
  };
}
