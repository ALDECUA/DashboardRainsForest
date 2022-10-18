import { PagosComponent } from './pagos/pagos.component';
import { NominaComponent } from './nomina/nomina.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { CajaChicaComponent } from './caja-chica/caja-chica.component';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { LotesComponent } from './lotes/lotes.component';

const routes: Routes = [
  {
    path: 'comisiones',
    component: ComisionesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 21 },
  },
  {
    path: 'nomina',
    component: NominaComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 22 },
  },
  {
    path: 'inversionistas',
    component: PagosComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 23 },
  },
  {
    path: 'cobranza',
    component: CobranzaComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 18 },
  },
  {
    path: 'inversionistas/:id',
    component: LotesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 18 },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContabilidadRoutingModule {}
