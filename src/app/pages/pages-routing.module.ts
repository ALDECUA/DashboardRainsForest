import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'desarrollos',
    loadChildren: () => import('./desarrollos/desarrollos.module').then(m => m.DesarrollosModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
  },
  {
    path: 'rh',
    loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
  },
  {
    path: 'fxcoins',
    loadChildren: () => import('./fxcoins/fxcoins.module').then(m => m.FxcoinsModule)
  },
  {
    path: 'contratos',
    loadChildren: () => import('./contratos/contratos.module').then(m => m.ContratosModule)
  },
  {
    path: 'controlcalidad',
    loadChildren: () => import('./controlcalidad/controlcalidad.module').then(m => m.ControlcalidadModule)
  },
  {
    path: 'contabilidad',
    loadChildren: () => import('./contabilidad/contabilidad.module').then(m => m.ContabilidadModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
  },
  {
    path: 'reportes',
    loadChildren: ()  => import('./reportes/reportes.module').then(m => m.ReportesModule)
  },
  {
    path: 'social',
    loadChildren: () => import('./social/social.module').then(m => m.SocialModule)
  },
  {
    path: 'avisos',
    loadChildren:() => import('./avisos/avisos.module').then(m=>m.AvisosModule)
  },
  {
    path: 'admin',
    loadChildren:() => import('./admin/admin.module').then(m=>m.AdminModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
