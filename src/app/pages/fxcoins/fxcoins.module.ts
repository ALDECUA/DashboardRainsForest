import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProductosComponent } from './productos/productos.component';
import { FxcoinsRoutingModule } from './fxcoins-routing.module';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ProductoComponent } from './producto/producto.component';
import { ModalComponent } from './pedidos/modal/modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { VerPedidoComponent } from './ver-pedido/ver-pedido.component';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { AgregarPedidoComponent } from './agregar-pedido/agregar-pedido.component';
import { VerProductoModalComponent } from './productos/ver-producto-modal/ver-producto-modal.component';
import { RecibosComponent } from './ver-pedido/recibos/recibos.component';



@NgModule({
  declarations: [
    DashboardComponent,
    PedidosComponent,
    ProductosComponent,
    EditarProductoComponent,
    ProductoComponent,
    ModalComponent,
    VerPedidoComponent,
    AgregarProductoComponent,
    AgregarPedidoComponent,
    VerProductoModalComponent,
    RecibosComponent,
  ],
  imports: [
    CommonModule,
    FxcoinsRoutingModule,
    ComponentsModule,
    SharedModule,
    CKEditorModule,
    PipesModule,
    FormsModule,
  ]
})
export class FxcoinsModule { }
