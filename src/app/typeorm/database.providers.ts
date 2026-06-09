import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';

import { DatabaseOptions } from './database-options';
import { DatabaseService } from './database.service';
import { DATABASE_OPTIONS } from './database.tokens';
import {
  createDatabasePlatform,
  createSQLiteConnection,
  DATABASE_PLATFORM,
  PLATFORM_DATA_SOURCE_FACTORY,
  SQLITE_CONNECTION_FACTORY,
} from './database-platform';
import { PlatformDataSourceFactory } from './data-sources/platform-data-source.factory';

export function provideDatabase(options: DatabaseOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DATABASE_OPTIONS,
      useValue: options,
    },
    {
      provide: DATABASE_PLATFORM,
      useFactory: createDatabasePlatform,
    },
    {
      provide: SQLITE_CONNECTION_FACTORY,
      useValue: createSQLiteConnection,
    },
    {
      provide: PLATFORM_DATA_SOURCE_FACTORY,
      deps: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions): PlatformDataSourceFactory =>
        new PlatformDataSourceFactory(databaseOptions),
    },
    DatabaseService,
    provideAppInitializer(() => {
      const database = inject(DatabaseService);
      return database.initialize();
    }),
  ]);
}
