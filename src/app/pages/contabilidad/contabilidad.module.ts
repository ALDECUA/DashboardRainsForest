import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { NominaComponent } from './nomina/nomina.component';
import { PagosComponent } from './pagos/pagos.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CajaChicaComponent } from './caja-chica/caja-chica.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { LotesComponent } from './lotes/lotes.component';


@NgModule({
  declarations: [
    ComisionesComponent,
    NominaComponent,
    PagosComponent,
    CajaChicaComponent,
    LotesComponent,
  ],
  imports: [
    CommonModule,
    ContabilidadRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    SharedModule
  ]
})
export class ContabilidadModule { }
