import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { DataSource } from 'typeorm/browser';

import { DATABASE_OPTIONS } from './database.providers';
import { PlatformDataSourceFactory } from './data-sources/platform-data-source.factory';

interface WebStoreDriver {
  save?: () => Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly options = inject(DATABASE_OPTIONS);
  private readonly platformValue = Capacitor.getPlatform();
  private readonly sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  private readonly dataSourceFactory = new PlatformDataSourceFactory(this.options);
  private dataSource?: DataSource;
  private initializing?: Promise<DataSource>;

  get databaseName(): string {
    return this.options.databaseName;
  }

  get platform(): string {
    return this.platformValue;
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
    if (this.isNative()) {
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
    if (this.isNative()) {
      await this.sqliteConnection.checkConnectionsConsistency();
      return this.dataSourceFactory.createNative(this.sqliteConnection);
    }

    return this.dataSourceFactory.createWeb();
  }

  private isNative(): boolean {
    return this.platformValue === 'ios' || this.platformValue === 'android';
  }
}
