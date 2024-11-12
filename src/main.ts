import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {
  initWebStore,
  provideOrmService,
  provideSQLiteService,
  provideWebStoreServer
} from "./type-orm/services/sqlite-typeorm-init";
import { BsPlatformDBService } from "./type-orm/services/bs-platform-db.service";

// 判断如果等于 web 执行web的初始化库
initWebStore();
// 启动Angular
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideSQLiteService(),
    provideOrmService(),
    provideWebStoreServer(),
    BsPlatformDBService
  ],
});
