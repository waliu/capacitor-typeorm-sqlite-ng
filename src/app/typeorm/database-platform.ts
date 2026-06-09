import { InjectionToken } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

import { PlatformDataSourceFactory } from './data-sources/platform-data-source.factory';

export interface DatabasePlatform {
  readonly name: string;
  readonly isNative: boolean;
}

export type SQLiteConnectionFactory = () => SQLiteConnection;

export const DATABASE_PLATFORM = new InjectionToken<DatabasePlatform>(
  'DATABASE_PLATFORM',
);

export const SQLITE_CONNECTION_FACTORY =
  new InjectionToken<SQLiteConnectionFactory>('SQLITE_CONNECTION_FACTORY');

export const PLATFORM_DATA_SOURCE_FACTORY =
  new InjectionToken<PlatformDataSourceFactory>('PLATFORM_DATA_SOURCE_FACTORY');

export function createDatabasePlatform(): DatabasePlatform {
  const name = Capacitor.getPlatform();

  return {
    name,
    isNative: name === 'ios' || name === 'android',
  };
}

export function createSQLiteConnection(): SQLiteConnection {
  return new SQLiteConnection(CapacitorSQLite);
}
