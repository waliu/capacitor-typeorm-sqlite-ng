import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, CapacitorSQLitePlugin } from '@capacitor-community/sqlite';

/**
 * SQLite 服务
 * @author Chen Yu
 */
@Injectable()
export class SQLiteService {
  /**
   * sqlite 连接
   */
  sqliteConnection: SQLiteConnection;
  /**
   * 服务
   */
  isService: boolean = false;
  /**
   * 平台字符串
   */
  platform: string;
  /**
   * sqlite 插件
   */
  sqlitePlugin: any;
  /**
   * 是否为原生（Android/ios）
   */
  native: boolean = false;
  /**
   * 构造函数
   */
  constructor() {
    // 获取平台字符串
    this.platform = Capacitor.getPlatform();
    // 判断是否为原生平台
    if (this.platform === 'ios' || this.platform === 'android') this.native = true;
    // 赋值 sql 插件
    this.sqlitePlugin = CapacitorSQLite;
    // sql 连接
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    // 服务
    this.isService = true;
  }

  /**
   * Initialize web platform
   * 初始化web平台
   */
  async initializeWebStore() {
    if (this.platform === 'web') await this.sqliteConnection.initWebStore();
  }

  /**
   * Get the Sqlite Plugin
   * 获取 Sqlite 插件
   * @returns CapacitorSQLitePlugin
   */
  getSqlitePlugin(): CapacitorSQLitePlugin {
    return this.sqlitePlugin;
  }

  /**
   * Get the Platform
   * 获取平台
   * @returns string
   */
  getPlatform(): string {
    return this.platform;
  }

  /**
   * Get the Sqlite Connection
   * 获取 Sqlite 连接
   * @returns SQLiteConnection
   */
  getSqliteConnection(): SQLiteConnection {
    return this.sqliteConnection;
  }

  /**
   * 获取平台是否为原生平台
   * @returns boolean
   */
  getIsNative(): boolean {
    return this.native;
  }

  /**
   * 获取服务是否已初始化
   * @returns boolean
   */
  getIsService(): boolean {
    return this.isService;
  }

  /**
   * 检查连接一致性
   * @returns Promise<void>
   */
  async checkConnectionConsistency(): Promise<void> {
    try {
      await this.sqliteConnection.checkConnectionsConsistency();
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      throw new Error(`Error: ${msg}`);
    }
  }
}
