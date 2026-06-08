import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm/browser';

import { DataSourceProvider } from '../services/common/data-source-provider';
import {
  PLATFORM_DATABASE_NAME,
  PlatformDataSourceFactory,
} from './data-sources/platform-data-source.factory';

interface WebStoreDriver {
  save?: () => Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class DatabaseService implements DataSourceProvider {
  private readonly platformValue = Capacitor.getPlatform();
  private readonly sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  private readonly dataSourceFactory = new PlatformDataSourceFactory();
  private dataSource?: DataSource;
  private initializing?: Promise<DataSource>;

  get databaseName(): string {
    return PLATFORM_DATABASE_NAME;
  }

  get platform(): string {
    return this.platformValue;
  }

  get initialized(): boolean {
    return this.dataSource?.isInitialized ?? false;
  }

  async initialize(): Promise<void> {
    await this.getInitializedDataSource();
  }

  getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
  ): Repository<Entity> {
    if (!this.dataSource?.isInitialized) {
      throw new Error('TypeORM has not been initialized.');
    }

    return this.dataSource.getRepository(entity);
  }

  async persist(): Promise<void> {
    if (this.isNative()) {
      return;
    }

    const driver = this.dataSource?.driver as WebStoreDriver | undefined;
    await driver?.save?.();
  }

  private async getInitializedDataSource(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    this.initializing ??= this.initializeDataSource();
    return this.initializing;
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
