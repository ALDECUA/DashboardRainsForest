import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialRoutingModule } from './social-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealsComponent } from './deals/deals.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ProspectosComponent } from './prospectos/prospectos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { HerramientasComponent } from './herramientas/herramientas.component';
import { ReportesComponent } from './reportes/reportes.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SistemaComponent } from './sistema/sistema.component';
import { AddelementoComponent } from './addelemento/addelemento.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EdicionComponent } from './prospectos/edicion/edicion.component';
import { ModalComponent } from './prospectos/modal/modal.component';
import { PasosComponent } from './deals/pasos/pasos.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RecordatorioComponent } from './deals/pasos/recordatorio/recordatorio.component';
import { VentasComponent } from './ventas/ventas.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DealsComponent,
    ActivitiesComponent,
    ProspectosComponent,
    ClientesComponent,
    HerramientasComponent,
    ReportesComponent,
    NavbarComponent,
    SistemaComponent,
    AddelementoComponent,
    EdicionComponent,
    ModalComponent,
    PasosComponent,
    RecordatorioComponent,
    VentasComponent
  ],
  imports: [
    CommonModule,
    SocialRoutingModule,
    SharedModule,
    FormsModule,
    DragDropModule,
    HttpClientModule,
    
  ]
})
export class SocialModule { }
