import { Injectable } from "@angular/core";
import { DataSource, Repository } from "typeorm";
import { SysUser } from "../entities/sys-user";

@Injectable()
export class BsPlatformDBService {
  /**
   * 数据源
   */
  public dataSource!: DataSource;
  /**
   *  用户 Repository 对象
   * @private
   */
  public sysUserRepository!: Repository<SysUser>;

  /**
   * Initialize the author-post service
   * @returns
   */
  async initialize(): Promise<void> {
    // Log
    console.log(`@@@ this.dataSource.isInitialized: ${this.dataSource.isInitialized} @@@@`)
    // 判断数据库是否初始化了
    if (!this.dataSource.isInitialized) return Promise.reject(`Error: AuthorDataSource not initialized`)
    // 获取SysUser Repository 对象
    this.sysUserRepository = this.dataSource.getRepository(SysUser);
  }
}
