import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { PromosComponent } from './promos/promos.component';

const routes: Routes = [
  {
    path: 'notificaciones',
    component: NotificacionesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 36 }
  },
  {
    path: 'promos',
    component: PromosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 37}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvisosRoutingModule { }
