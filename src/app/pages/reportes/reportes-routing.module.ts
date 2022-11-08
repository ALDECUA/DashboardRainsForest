import { ConsultasComponent } from './consultas/consultas.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ReporteComponent } from './consultas/reporte_desglozado/reporte/reporte.component';
import { ReportepersonasComponent } from './consultas/reportepersonas/reportepersonas.component';


const routes: Routes = [
  {
    path: 'consultas',
    component: ConsultasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 3 }
  },
  {
    path: 'estadisticas',
    component: EstadisticasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 2 }
  },
  
  {
    path: 'reporte/:id',
    component: ReporteComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 3 }
  },
  {
    path: 'reportepersonas/:id',
    component: ReportepersonasComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 3 }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
