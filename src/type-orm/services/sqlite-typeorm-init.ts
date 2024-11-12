import { APP_INITIALIZER } from "@angular/core";
import { SQLiteService } from "./sqlite.service";
import { OrmService } from "./orm.service";
import { Capacitor } from "@capacitor/core";
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
/**
 * 获取平台
 * @version 1.0.0
 */
const platform: string = Capacitor.getPlatform();
/**
 * 等于web时使用jeep Sqlite
 * @version 1.0.0
 */
export function initWebStore(){
  if (platform === "web") {
    pwaElements(window);
    jeepSqlite(window);
    window.addEventListener('DOMContentLoaded', async () => {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
    });
  }
}

/**
 * web Store 服务
 * @version 1.0.0
 */
export function provideWebStoreServer() {
  return {
    provide: APP_INITIALIZER,
    useFactory: initializeFactory,
    deps: [SQLiteService],
    multi: true
  }
}

/**
 * 初始化App
 * @param init
 * @version 1.0.0
 */
export function initializeFactory(init: SQLiteService) {
  return () => init.initializeWebStore();
}

/**
 * SQLiteService 服务
 * @author ChenYu
 * @version 1.0.0
 */
export function provideSQLiteService() {
  return SQLiteService;
}

/**
 * OrmService 服务
 * @author ChenYu
 * @version 1.0.0
 */
export function provideOrmService() {
  return OrmService;
}
