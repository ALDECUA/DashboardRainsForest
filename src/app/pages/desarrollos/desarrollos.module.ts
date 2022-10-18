import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesarrollosComponent } from './desarrollos.component';
import { DesarrollosRoutingModule } from './desarrollos-routing.module';
import { ComponentsModule } from '../components/components.module';
import { ListarDesarrollosComponent } from './listar-desarrollos/listar-desarrollos.component';
import { ListarEmpresasComponent } from './listar-empresas/listar-empresas.component';
import { EditarEmpresasComponent } from './editar-empresas/editar-empresas.component';
import { FormsModule } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { ListarEtapasComponent } from './listar-etapas/listar-etapas.component';
import { ListarLotesComponent } from './listar-lotes/listar-lotes.component';
import { ListarContratosComponent } from './listar-contratos/listar-contratos.component';
import { ListarSociosComponent } from './listar-socios/listar-socios.component';
import { ListarComisionesComponent } from './listar-comisiones/listar-comisiones.component';
import { ListarEstatusContratosComponent } from './listar-estatus-contratos/listar-estatus-contratos.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { EditarLotesComponent } from './editar-lotes/editar-lotes.component';
import { QuillModule } from 'ngx-quill';
import { EditarDesarrollosComponent } from './editar-desarrollos/editar-desarrollos.component';
import { EditarEtapaComponent } from './editar-etapa/editar-etapa.component';
import { EditarContratosComponent } from './editar-contratos/editar-contratos.component';
import { AddLoteComponent } from './add-lote/add-lote.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AddLoteMasivoComponent } from './add-lote-masivo/add-lote-masivo.component';
import { DriveComponent } from './drive/drive.component';


const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'link'],        // toggled buttons

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                           // text direction

   /*  [{ 'font': [] }], */
  ]
};

@NgModule({
  declarations: [
    DesarrollosComponent,
    ListarDesarrollosComponent,
    ListarEmpresasComponent,
    EditarEmpresasComponent,
    ListarEtapasComponent,
    ListarLotesComponent,
    ListarContratosComponent,
    ListarSociosComponent,
    ListarComisionesComponent,
    ListarEstatusContratosComponent,
    EditarLotesComponent,
    EditarDesarrollosComponent,
    EditarEtapaComponent,
    EditarContratosComponent,
    AddLoteComponent,
    AddLoteMasivoComponent,
    DriveComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DesarrollosRoutingModule,
    FormsModule,
    CKEditorModule,CKEditorModule,
    PipesModule,
    SharedModule,
    QuillModule.forRoot({
      format:'text',
      modules:modules
    })
  ]
})
export class DesarrollosModule { 
  constructor(private app: AppService) {
    this.app.currentModule = 'Desarrollos';
  }
}

