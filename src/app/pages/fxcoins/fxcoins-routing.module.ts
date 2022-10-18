import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { ProductoComponent } from './producto/producto.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProductosComponent } from './productos/productos.component';
import { VerPedidoComponent } from './ver-pedido/ver-pedido.component';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 27 }
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 28 }
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 29 }
  },
  {
    path: 'agregarproducto',
    component: AgregarProductoComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 29 }
  },
  {
    path: 'editarproducto/:id',
    component: EditarProductoComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 29 }
  },
  {
    path: 'producto/:id',
    component: ProductoComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 28 }
  },
  {
    path: 'pedido/:id',
    component: VerPedidoComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 28 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxcoinsRoutingModule { }
