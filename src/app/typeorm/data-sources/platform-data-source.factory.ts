import { SQLiteConnection } from '@capacitor-community/sqlite';
import initSqlJs from 'sql.js';
import { DataSource } from 'typeorm/browser';

import { databaseEntities } from '../entities';
import { InitializePlatformDb1730764800000 } from '../migrations/initialize-platform-db';

export const PLATFORM_DATABASE_NAME = 'transaction';

export class PlatformDataSourceFactory {
  createNative(driver: SQLiteConnection): DataSource {
    return new DataSource({
      type: 'capacitor',
      driver,
      database: PLATFORM_DATABASE_NAME,
      mode: 'no-encryption',
      entities: databaseEntities,
      migrations: [InitializePlatformDb1730764800000],
      subscribers: [],
      logging: ['error', 'schema'],
      synchronize: false,
      migrationsRun: false,
    });
  }

  createWeb(): DataSource {
    return new DataSource({
      type: 'sqljs',
      driver: initSqlJs,
      autoSave: true,
      location: PLATFORM_DATABASE_NAME,
      sqlJsConfig: {
        locateFile: (file: string) => `/assets/${file}`,
      },
      entities: databaseEntities,
      migrations: [InitializePlatformDb1730764800000],
      subscribers: [],
      logging: ['error', 'schema'],
      synchronize: false,
      migrationsRun: false,
    });
  }
}
