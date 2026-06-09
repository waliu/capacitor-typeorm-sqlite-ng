import {
  EnvironmentProviders,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';

import { DatabaseOptions } from './database-options';
import { DatabaseService } from './database.service';

export const DATABASE_OPTIONS = new InjectionToken<DatabaseOptions>('DATABASE_OPTIONS');

export function provideDatabase(options: DatabaseOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DATABASE_OPTIONS,
      useValue: options,
    },
    DatabaseService,
    provideAppInitializer(() => {
      const database = inject(DatabaseService);
      return database.initialize();
    }),
  ]);
}
