import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/user/user.routes').then((module) => module.USER_ROUTES),
  },
];
