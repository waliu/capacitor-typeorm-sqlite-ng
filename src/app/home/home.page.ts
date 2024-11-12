import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { BsPlatformDBService } from "../../type-orm/services/bs-platform-db.service";
import { SysUser } from "../../type-orm/entities/sys-user";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements AfterViewInit {
  constructor(public bsPlatformDBService: BsPlatformDBService) {
  }

  async ngAfterViewInit() {
    console.log("123456")
    setTimeout(() => {
      let sysUser: SysUser = new SysUser();
      sysUser.user_name = "123456";
      sysUser.password = "123456";
      this.bsPlatformDBService.sysUserRepository.save(sysUser)
      this.bsPlatformDBService.sysUserRepository.findOne({
        where:{
          user_name:"123456"
        }
      }).then((res)=>console.log(res))
    }, 300)
  }
}
