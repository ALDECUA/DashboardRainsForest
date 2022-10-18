import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { BancosComponent } from './bancos/bancos.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { MachotesComponent } from './machotes/machotes.component';

const routes: Routes = [
  {
    path: 'empresas',
    component: EmpresasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 5 }
  }, 
  {
    path: 'bancos',
    component: BancosComponent
  },
  {
    path: 'machotes',
    component: MachotesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 6 }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratosRoutingModule { }
