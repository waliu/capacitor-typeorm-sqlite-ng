import { SQLiteConnection } from '@capacitor-community/sqlite';
import initSqlJs from 'sql.js';
import { DataSource } from 'typeorm/browser';

import { DatabaseOptions } from '../database-options';

export class PlatformDataSourceFactory {
  constructor(private readonly options: DatabaseOptions) {}

  createNative(driver: SQLiteConnection): DataSource {
    return new DataSource({
      type: 'capacitor',
      driver,
      database: this.options.databaseName,
      mode: 'no-encryption',
      entities: this.options.schema.entities,
      migrations: this.options.schema.migrations,
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
      location: this.options.databaseName,
      sqlJsConfig: {
        locateFile: (file: string) => `/assets/${file}`,
      },
      entities: this.options.schema.entities,
      migrations: this.options.schema.migrations,
      subscribers: [],
      logging: ['error', 'schema'],
      synchronize: false,
      migrationsRun: false,
    });
  }
}
