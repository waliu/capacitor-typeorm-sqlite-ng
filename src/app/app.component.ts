import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { OrmService } from "../type-orm/services/orm.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  /**
   *
   * @param ormService
   */
  constructor(private ormService: OrmService) {
  }

  /**
   * 生命钩子
   */
  async ngOnInit() {
    // 初始化 Orm服务
    await this.initOrmService().catch((e) => console.log(e));
    // 判断 orm 服务是否启动
    if (!this.ormService.isOrmService) throw new Error(`TypeOrm 服务未启动`);
  }

  /**
   * Initialize the TypeOrm service
   */
  async initOrmService(): Promise<void> {
    await this.ormService.initialize();
    console.log(`*** ORM服务已初始化 ***`)
  }
}
