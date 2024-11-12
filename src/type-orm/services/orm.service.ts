import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import AuthorDataSource from '../data-sources/AuthorDataSource';
import { DataSource } from "typeorm";
import { BsPlatformDBService } from "./bs-platform-db.service";

/**
 * ORM 服务
 * @author Chen Yu
 * @version 1.0.0
 */
@Injectable()
export class OrmService {
  /**
   * 判断 ORM 服务是否初始化
   */
  isOrmService: Boolean = false;

  /**
   * 构造函数
   * @param sqliteService
   * @param bsPlatformDBService
   */
  constructor(
    public sqliteService: SQLiteService,
    public bsPlatformDBService:BsPlatformDBService
  ) {}

  /**
   * 初始化TypeOrm服务
   */
  async initialize(): Promise<void> {
    // 检查连接一致性
    await this.sqliteService.checkConnectionConsistency();
    // 定义数据源为 AuthorDataSource
    let dataSource: DataSource = AuthorDataSource;
    // 获取数据库名称
    const database: string = String(dataSource.options.database);
    // 如果数据源已初始化，则返回
    if (dataSource.isInitialized) return;
    // 初始化数据源
    await dataSource.initialize();
    // Log
    console.log(`*** dataSource 已初始化 ***`);
    // 运行数据库迁移
    await dataSource.runMigrations();
    // 赋值
    this.bsPlatformDBService.dataSource = dataSource;
    // 初始化连接类
    await this.bsPlatformDBService.initialize();
    // Log
    console.log(`*** dataSource 迁移成功运行 ***`);
    // 如果当前平台是 web 将数据库从内存保存到存储中
    if (this.sqliteService.getPlatform() === 'web'){
      await this.sqliteService.getSqliteConnection().saveToStore(database);
    }
    // Log
    console.log(`*** inORMService 已保存到存储中 ***`);
    // 输出数据源已初始化的日志
    console.log(`数据源: ${database} 已初始化`);
    // 设置 isOrmService 为 true，表示 ORM 服务已初始化
    this.isOrmService = true;
  }
}

