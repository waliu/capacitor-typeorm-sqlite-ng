import { AfterViewInit, Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel,
  IonIcon,
  IonItem, IonAvatar, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { BsPlatformDBService } from "../../type-orm/services/bs-platform-db.service";
import { SysUser } from "../../type-orm/entities/sys-user";
import AuthorDataSource from "../../type-orm/data-sources/AuthorDataSource";
import { DataSource } from "typeorm";
import { OrmService } from "../../type-orm/services/orm.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonLabel, IonIcon, IonItem, IonAvatar, IonButtons, IonButton],
})
export class HomePage implements AfterViewInit {
  /**
   * 用户集合
   */
  users: SysUser[] = [];

  /**
   * 构造函数
   * @param bsPlatformDBService
   * @param ormService
   */
  constructor(public bsPlatformDBService: BsPlatformDBService, private ormService: OrmService) {
  }

  async ngAfterViewInit() {
    setTimeout(async () => {
      await this.getUsers();
    }, 300)
  }

  /**
   * 添加用户名称
   */
  async addUser() {
    let sysUser: SysUser = new SysUser();
    sysUser.user_name = this.generateRandomName();
    sysUser.password = "123456";
    // 保存数据
    await this.bsPlatformDBService.sysUserRepository.save(sysUser)
    // 当在web运行时需要将数据库保存到index db
    if (this.ormService.sqliteService.getPlatform() === 'web') {
      // 获取数据源 AuthorDataSource
      let dataSource: DataSource = AuthorDataSource;
      // 获取数据库名称
      const database: string = String(dataSource.options.database);
      // 保存到数据库
      await this.ormService.sqliteService.getSqliteConnection().saveToStore(database);
    }
    // 重新获取名称
    await this.getUsers();
  }

  /**
   * 获取所有用户
   */
  async getUsers() {
    this.users = await this.bsPlatformDBService.sysUserRepository.find();
  }

  /**
   * 随机生成一个名字
   */
  generateRandomName(): string {
    const firstNames = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Cameron", "Riley", "Parker", "Jamie", "Avery"];
    const lastNames = ["Smith", "Johnson", "Taylor", "Brown", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${randomFirstName} ${randomLastName}`;
  }
}
