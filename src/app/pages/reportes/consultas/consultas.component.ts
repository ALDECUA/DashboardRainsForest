import { Component, Input, OnInit } from '@angular/core';
import { Console } from 'console';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AppService } from 'src/app/services/app.service';
import { ReportesService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss'],
})
export class ConsultasComponent implements OnInit {
  @Input()
  nombre = 'DesarrolloWeb.com';
  public parques;
  public desde;
  public hasta;
  public tipo;
  public pagos: any = [];
  public lotes: any = [];
  public lotesb;
  public Volumen : any [];
  public CotizacionesPorDesarrollo: any [];
  Desarrollodos: {};

  constructor(public app: AppService, public reportes: ReportesService) {
    this.app.currentModule = 'Reportes';
    this.app.currentSection = ' - Consultas';
  }

  ngOnInit(): void {
    this.obtenerparques();
   /*  this.ObtenerPagos();
    this.ObtenerLotes();
    this.ObtenerVolumenHR();
    this.ObtenerCotizaciones(); */
  }
  obtenerparques(){
    this.reportes.parquesrainfores().subscribe((res:any) => {
    if(!res.error){
      this.parques = res
    }
      

  })
  }
  ObtenerCotizaciones(){
    this.reportes.Cotizaciones().subscribe((res:any) => {
      this.CotizacionesPorDesarrollo= res
      for(let i = 0 ; i < this.CotizacionesPorDesarrollo.length; i ++ ){
        this.CotizacionesPorDesarrollo[i].Lotes_Informacion = JSON.parse(this.CotizacionesPorDesarrollo[i].Lotes_Informacion)
      }
      
      console.log(this.CotizacionesPorDesarrollo)
  })
  }
  ObtenerPagos() {
    this.reportes.ReporteHR().subscribe((res: any) => {
      for (let i = 0; i < 5; i++) {
        this.pagos.push(res[i]);
      }
    });
  }
  ObtenerLotes() {
    this.reportes.lotes().subscribe((res: any) => {
      this.lotesb = res;
      for (let i = res.length - 2; i >= 0; i--) {
        if (res[i][0].Desarrollo !== 'NA') {
           this.lotes.push(res[i][0]); 
        }
      }
      console.log(this.lotes);
    });
  }
  ObtenerVolumenHR()
  {
    this.reportes.VolumenHR({}).subscribe((res:any)=>{
     this.Volumen= res;
     console.log(this.Volumen);
    });
  }
  pdf() {
    Swal.fire({
      title: 'Elige un reporte en PDF',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#0E1D60',
      /* denyButtonColor: '#0E1D60', */
      confirmButtonText: 'Reporte Global',
     /*  denyButtonText: `Reporte Global`, */
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('entro pdf')
      } 
    });
  }
  excell() {
    Swal.fire({
      title: 'Elige un reporte en Excel',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#1C6C40',
      /* denyButtonColor: '#1C6C40', */
      confirmButtonText: 'Reporte Global',
      /* denyButtonText: `Reporte Global`, */
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('entro excel')
      } 
    });
  }
}
