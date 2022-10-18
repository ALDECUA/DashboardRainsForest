import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { ActivitiesComponent } from './activities/activities.component';
import { ClientesComponent } from './clientes/clientes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealsComponent } from './deals/deals.component';
import { HerramientasComponent } from './herramientas/herramientas.component';
import { EdicionComponent } from './prospectos/edicion/edicion.component';
import { ProspectosComponent } from './prospectos/prospectos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SistemaComponent } from './sistema/sistema.component';
import { VentasComponent } from './ventas/ventas.component';


const routes: Routes = [
  {
    path: 'leads',
    component: DealsComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 34 }
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 33 }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 32 }
  },
  {
    path: 'prospectos',
    component: ProspectosComponent,
  },
  {
    path: 'clientes',
    component: ClientesComponent,
  },
  {
    path: 'herramientas',
    component: HerramientasComponent,
  },
  {
    path: 'reportes',
    component: ReportesComponent
  },
  {
    path: 'sistema',
    component: SistemaComponent
  },
  {
    path: 'prospectos/edicion/:id',
    component: EdicionComponent
  },
  {
    path: 'proceso',
    component: VentasComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialRoutingModule { }
