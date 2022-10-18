import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlcalidadRoutingModule } from './controlcalidad-routing.module';
import { RhComponent } from './rh/rh.component';
import { CobranzaComponent } from '../contabilidad/cobranza/cobranza.component';
import { ContratosComponent } from './contratos/contratos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditarHrComponent } from './rh/editar-hr/editar-hr.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { LlamadasComponent } from './llamadas/llamadas.component';
import { InversionistasComponent } from './inversionistas/inversionistas.component';
import { EditarHrComponentInv } from './inversionistas/editar-hr/editar-hr.component';
import { AddLoteInvComponent } from './inversionistas/add-lote-inv/add-lote-inv.component';
import { SurveyComponent } from './survey/survey.component';
import { EncuestasComponent } from './survey/encuestas/encuestas.component';
import { HistoricoComponent } from './survey/historico/historico.component';
import { AltainversionistaComponent } from './inversionistas/altainversionista/altainversionista.component';


@NgModule({
  declarations: [
    RhComponent,
    CobranzaComponent,
    ContratosComponent,
    EditarHrComponent,
    LlamadasComponent,
    InversionistasComponent,
    EditarHrComponentInv,
    AddLoteInvComponent,
    SurveyComponent,
    EncuestasComponent,
    HistoricoComponent,
    AltainversionistaComponent
  ],
  imports: [
    CommonModule,
    ControlcalidadRoutingModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
})
export class ControlcalidadModule { }
