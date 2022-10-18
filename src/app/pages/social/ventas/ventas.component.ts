import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ZapierService } from 'src/app/services/zapier.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  public listaProcesos:any = [];
  public prospecto:any = [];
  public asignado:any = [];
  public conectado:any = [];
  public cierre:any = [];
  public count:any = {};
  public loader:boolean = false;

  constructor(public app: AppService,private zap: ZapierService) { 
    this.app.currentModule = 'SOCIAL';
    this.app.currentSection = '- Proceso';
  }

  ngOnInit(): void {

    this.loader = true;
    this.ObtenerProcesos();

  }

  ObtenerProcesos(){

    this.zap.ObtenerAsigandos({
      Origen: 'crm-v'
    }).subscribe((response:any) => {

      console.log(response);
      this.listaProcesos = response;

      let countprospectos:number = 0,coutnasignado:number = 0, countconectado:number = 0, countcierre:number = 0;

      this.listaProcesos.forEach(element => {

        if (element.PasosLeads === 1 && element.IdStatus == 2) {
          this.prospecto.push(element);
          countprospectos += 1;
        }
        if ((element.PasosLeads > 1 && element.PasosLeads  < 3) && (element.IdStatus == 2)) {
          this.asignado.push(element);
          coutnasignado += 1;
        }
        if (element.IdStatus === 1 ) {
          this.conectado.push(element);
          countconectado += 1;
        }
        if (element.PasosLeads === 7 && element.IdStatus === 1) {
          this.cierre.push(element);
          countcierre += 1;
        }

      });

      this.count.prospectos = countprospectos;
      this.count.asignado = coutnasignado;
      this.count.conectado = countconectado;
      this.count.cierre = countcierre;
      this.loader = false;
    });

  }

  
  verDatos(item,opcion){
    console.log(item);
    this.zap.disparadorProcesos.emit({
      data:item,
      opcion: opcion
    })
  }
}
