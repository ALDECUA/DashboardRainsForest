import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReclutamientoComponent } from './reclutamiento/reclutamiento.component';
import { CumplesComponent } from './cumples/cumples.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { VisualizarCuentaComponent } from './visualizar-cuenta/visualizar-cuenta.component';
import { FuerzaventasComponent } from './fuerzaventas/fuerzaventas.component';
import { InversionistasComponent } from './inversionistas/inversionistas.component';
import { EmpleadosComponent } from './empleados/empleados.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ReclutamientoComponent,
    CumplesComponent,
    EditarUsuarioComponent,
    VisualizarCuentaComponent,
    FuerzaventasComponent,
    InversionistasComponent,
    EmpleadosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RhRoutingModule,
    FormsModule
  ]
})
export class RhModule { }
