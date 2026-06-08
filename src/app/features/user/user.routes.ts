import { Routes } from '@angular/router';

import { provideApplicationServices } from '../../shared/application-services.provider';
import { UserPage } from './pages/user-page';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserPage,
    providers: provideApplicationServices(),
  },
];
