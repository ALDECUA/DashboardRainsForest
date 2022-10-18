import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratosRoutingModule } from './contratos-routing.module';
import { EmpresasComponent } from './empresas/empresas.component';
import { BancosComponent } from './bancos/bancos.component';
import { MachotesComponent } from './machotes/machotes.component';
import { FormsModule } from '@angular/forms';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { AddContratoComponent } from './machotes/add-contrato/add-contrato.component';
import { AddEmpresaComponent } from './empresas/add-empresa/add-empresa.component';



@NgModule({
  declarations: [
    EmpresasComponent,
    BancosComponent,
    MachotesComponent,
    AddContratoComponent,
    AddEmpresaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContratosRoutingModule,
    CKEditorModule,
    ComponentsModule
  ]
})
export class ContratosModule { }
