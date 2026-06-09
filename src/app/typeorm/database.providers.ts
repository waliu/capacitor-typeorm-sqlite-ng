import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';

import { DatabaseService } from './database.service';

export function provideDatabase(): EnvironmentProviders {
  return makeEnvironmentProviders([
    DatabaseService,
    provideAppInitializer(() => {
      const database = inject(DatabaseService);
      return database.initialize();
    }),
  ]);
}
