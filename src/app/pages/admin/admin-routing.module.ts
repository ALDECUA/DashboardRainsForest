import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { ArqueoComponent } from './arqueo/arqueo.component';
import { CajaGrandeComponent } from './caja-grande/caja-grande.component';

const routes: Routes = [
  {
    path: 'arqueo',
    component:ArqueoComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 42 }
  },
  {
    path: 'bancos',
    component: CajaGrandeComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 42 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
