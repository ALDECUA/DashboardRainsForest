import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { FormsModule } from '@angular/forms';
import { CropperjsModule } from 'src/app/lib/cropperjs/cropperjs.module';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    CropperjsModule,
    PipesModule
  ]
})
export class UsuariosModule { }
