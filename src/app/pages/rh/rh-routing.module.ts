import { EmpleadosComponent } from './empleados/empleados.component';
import { InversionistasComponent } from './inversionistas/inversionistas.component';
import { FuerzaventasComponent } from './fuerzaventas/fuerzaventas.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CumplesComponent } from './cumples/cumples.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReclutamientoComponent } from './reclutamiento/reclutamiento.component';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 8 }
  }, 
  {
    path: 'reclutamiento',
    component: ReclutamientoComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 9 }
  },
  {
    path: 'cumple',
    component: CumplesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 10 }
  },
  {
    path: 'fuerzaventas',
    component: FuerzaventasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 11 }
  },
  {
    path: 'inversionistas',
    component: InversionistasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 12 }
  },
  {
    path: 'empleados',
    component: EmpleadosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 13 }
  },
  {
    path: 'editarusuario/:id',
    component: EditarUsuarioComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
