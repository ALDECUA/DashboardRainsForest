import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ZapierService } from 'src/app/services/zapier.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  public leadsObtenidos:any = [];
  public loader: boolean = false;

  constructor(private zap:ZapierService, public app: AppService) {
    this.app.currentModule = 'SOCIAL';
    this.app.currentSection = '- Actividades';
   }

  ngOnInit(): void {

    this.loader = true;

    const fechaInicio = this.obtenerFechaInicioDeMes();
    const fechaFin = this.obtenerFechaFinDeMes();
    const fechaInicioFormateada = this.formatearFecha(fechaInicio);
    const fechaFinFormateada = this.formatearFecha(fechaFin);
    console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
    this.ObtenerProcesos(fechaInicioFormateada,fechaFinFormateada);
    
  }

  public ObtenerProcesos(fechaInicial,FechaFinal){
    
    this.zap.ObtenerAsigandos({
      fechaInicial:fechaInicial,
      fechaFinal: FechaFinal,
      Origen: 'crm'
    }).subscribe((response:any) => {
      this.leadsObtenidos = response;
      console.log(this.leadsObtenidos);
      this.loader = false;
    });

  }

  obtenerFechaInicioDeMes() {

    const fechaInicio = new Date();
    // Iniciar en este año, este mes, en el día 1
    return new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
  };

  obtenerFechaFinDeMes() {

    const fechaFin = new Date();
    // Iniciar en este año, el siguiente mes, en el día 0 (así que así nos regresamos un día)
    return new Date(fechaFin.getFullYear(), fechaFin.getMonth() +1, 0);
  };

  formatearFecha(fecha){
    const mes = fecha.getMonth() +1;
    const dia = fecha.getDate();

    return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat(mes)}-${(dia < 10 ? '0' : '').concat(dia)}`;
  };

}
