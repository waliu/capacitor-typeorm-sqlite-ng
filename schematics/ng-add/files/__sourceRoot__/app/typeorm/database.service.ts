import { inject, Injectable } from '@angular/core';
import { DataSource } from 'typeorm/browser';

import {
  DATABASE_PLATFORM,
  PLATFORM_DATA_SOURCE_FACTORY,
  SQLITE_CONNECTION_FACTORY,
} from './database-platform';
import { DATABASE_OPTIONS } from './database.tokens';

interface WebStoreDriver {
  save?: () => Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly options = inject(DATABASE_OPTIONS);
  private readonly platformValue = inject(DATABASE_PLATFORM);
  private readonly sqliteConnectionFactory = inject(SQLITE_CONNECTION_FACTORY);
  private readonly dataSourceFactory = inject(PLATFORM_DATA_SOURCE_FACTORY);
  private dataSource?: DataSource;
  private initializing?: Promise<DataSource>;

  get databaseName(): string {
    return this.options.databaseName;
  }

  get platform(): string {
    return this.platformValue.name;
  }

  get initialized(): boolean {
    return this.dataSource?.isInitialized ?? false;
  }

  async initialize(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    this.initializing ??= this.initializeDataSource();
    return this.initializing;
  }

  getInitializedDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database has not been initialized.');
    }

    return this.dataSource;
  }

  async persist(): Promise<void> {
    if (this.platformValue.isNative) {
      return;
    }

    const driver = this.dataSource?.driver as WebStoreDriver | undefined;
    await driver?.save?.();
  }

  private async initializeDataSource(): Promise<DataSource> {
    try {
      const dataSource = await this.createDataSource();

      await dataSource.initialize();
      await dataSource.runMigrations();

      this.dataSource = dataSource;
      await this.persist();

      return dataSource;
    } finally {
      this.initializing = undefined;
    }
  }

  private async createDataSource(): Promise<DataSource> {
    if (this.platformValue.isNative) {
      const sqliteConnection = this.sqliteConnectionFactory();

      await sqliteConnection.checkConnectionsConsistency();
      return this.dataSourceFactory.createNative(sqliteConnection);
    }

    return this.dataSourceFactory.createWeb();
  }
}
