import { Routes } from '@angular/router';

import { provideApplicationServices } from '../../composition/application.providers';
import { UserPage } from './pages/user-page';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserPage,
    providers: provideApplicationServices(),
  },
];
