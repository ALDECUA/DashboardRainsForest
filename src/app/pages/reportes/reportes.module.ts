import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ConsultasComponent } from './consultas/consultas.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ReporteComponent } from './consultas/reporte_desglozado/reporte/reporte.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportepersonasComponent } from './consultas/reportepersonas/reportepersonas.component';



@NgModule({
  declarations: [
    ConsultasComponent,
    EstadisticasComponent,
    ReporteComponent,
    ReportepersonasComponent,
   
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ComponentsModule,
    FormsModule,
    SharedModule,

    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class ReportesModule { }
