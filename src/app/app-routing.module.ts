import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { LoadapppageGuard } from './guards/loadapppage.guard';
import { LoadloginpageGuard } from './guards/loadloginpage.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'crm',
    pathMatch: 'full'
  },
  {
    path: 'crm',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canLoad: [IsAuthenticatedGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./shared/shared.module').then(m => {
      return  m.SharedModule;
    }),
    canLoad: [LoadloginpageGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
