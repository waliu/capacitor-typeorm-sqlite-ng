import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideDatabaseInfo } from './composition/database-info.providers';
import { routes } from './app.routes';
import { appDatabaseOptions } from './database/database.config';
import { provideDatabase } from './typeorm/database.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideDatabase(appDatabaseOptions),
    provideDatabaseInfo(),
  ],
};
