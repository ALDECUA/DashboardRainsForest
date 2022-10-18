import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { EditarPerfilesComponent } from './editar-perfiles/editar-perfiles.component';
import { EditarComisionesComponent } from './editar-comisiones/editar-comisiones.component';
import { ComisionesComponent } from './comisiones/comisiones.component';  

@NgModule({
  declarations: [
    PerfilComponent,
    UsuarioComponent,
    EditarUsuarioComponent,
    EditarPerfilesComponent,
    EditarComisionesComponent,
    ComisionesComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    ComponentsModule,
    SharedModule,
    FormsModule
  ]
})
export class ConfiguracionModule { }
