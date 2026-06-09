import { InjectionToken } from '@angular/core';

import { DatabaseOptions } from './database-options';

export const DATABASE_OPTIONS = new InjectionToken<DatabaseOptions>(
  'DATABASE_OPTIONS',
);
