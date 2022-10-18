import { EditarContratosComponent } from './editar-contratos/editar-contratos.component';
import { EditarEtapaComponent } from './editar-etapa/editar-etapa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesarrollosComponent } from './desarrollos.component';
import { EditarDesarrollosComponent } from './editar-desarrollos/editar-desarrollos.component';
import { EditarEmpresasComponent } from './editar-empresas/editar-empresas.component';
import { EditarLotesComponent } from './editar-lotes/editar-lotes.component';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { DriveComponent } from './drive/drive.component';

const routes: Routes = [
  {
    path: '',
    component: DesarrollosComponent,
  },
  {
    path: ':section',
    component: DesarrollosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 15 }
  },
  {
    path: 'editarempresa/:id',
    component: EditarEmpresasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 15 }
  },
  {
    path: 'editarlote/:id',
    component: EditarLotesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 15 }
  },
  {
    path: 'editardesarrollo/:id',
    component: EditarDesarrollosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 15 }
  },
  {
    path: 'editaretapa/:id',
    component: EditarEtapaComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 15 }
  },
  {
    path: 'editarcontrato/:id',
    component: EditarContratosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 15 }
  },
  {
    path: 'drive/:id',
    component: DriveComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesarrollosRoutingModule { }
