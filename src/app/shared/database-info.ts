import { InjectionToken } from '@angular/core';

export interface DatabaseInfo {
  readonly databaseName: string;
  readonly platform: string;
}

export const DATABASE_INFO = new InjectionToken<DatabaseInfo>('DATABASE_INFO');
