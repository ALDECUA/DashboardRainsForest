import { ContratosComponent } from './contratos/contratos.component';
import { CobranzaComponent } from '../contabilidad/cobranza/cobranza.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RhComponent } from './rh/rh.component';
import { EditarHrComponent } from './rh/editar-hr/editar-hr.component';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { LlamadasComponent } from './llamadas/llamadas.component';
import { InversionistasComponent } from './inversionistas/inversionistas.component';
import { EditarHrComponentInv } from './inversionistas/editar-hr/editar-hr.component';
import { SurveyComponent } from './survey/survey.component';

const routes: Routes = [
  {
    path: 'hr',
    component: RhComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 17 }
  },
  {
    path: 'editarhr/:IdPersona/:IdLote/:IdHr',
    component: EditarHrComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 17 }
  },
  {
    path: 'contratos',
    component: ContratosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 19 }
  },
  {
    path: 'llamadas',
    component: LlamadasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 30 }
  },
  {
    path: 'inversionistas',
    component: InversionistasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 30 }
  },
  {
    path: 'editarhrInv/:IdPersona/:IdLote/:IdHr',
    component: EditarHrComponentInv,
    canActivate: [HasGrantGuard],
    data: { grant: 17 }
  },
  {
    path: 'survey',
    component: SurveyComponent,
    canActivate: [HasGrantGuard], 
     data: { grant: 38 } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlcalidadRoutingModule { }
