import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AppService } from 'src/app/services/app.service';
import { ReportesService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2';
import { isGetAccessor } from 'typescript';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
})
export class ReporteComponent implements OnInit {
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  lista:string[]=["1","2","3","4"];
  public DesarrolloFiltro:any;
  openAccordion = []
  public Etapa:any;
  public pagos: any;
  pagosb: any;
  lotes: any = [];
  lotesb: any;
  Volumen: any;
  public titulo;
  public desde = '';
  public hasta = '';
  public tipo = 0;
  public Desarrollo = 'all';
  public des: any = [];
  public todolotes:any ;
  public hrss = [];
  public hrs = [];
  public personas = [];
  public buscar = '';
  public busqueda = 0;
  public loading = false;
  public fechas: any = {};
  public backupPersonas = [];
  public datos = [];
  filtrolotes: any;
  renderer: any;
  Desarrollodos
  CotizacionesPorDesarrollo: any;
  InformacionCotizacion: any;
  parques: any;
  id: any;
  respaldo: any;
  constructor(
    private activatedRouter: ActivatedRoute,
    public app: AppService,
    public reportes: ReportesService,
    public datepipe: DatePipe
  ) {}
  public reporte;


 

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params: any) => {
      this.reporte = params.params.id;
    });

    this.reportes.obtenerparqueid( this.reporte).subscribe((res:any) => { 
      this.titulo = res.datosparques[0].ParkeName;
      this.id = res.datosparques[0].IdParque;
      this.parques = res.datosparques
      this.des = res.parques
      this.respaldo = res.datosparques
    })

  }

  first(){
    try {
  const errorField = this.renderer.selectRootElement('.first-class');
    errorField.scrollIntoView();
} catch (err) {

}
}
 
SearchTour(){
  let search = []
  this.parques = this.respaldo
  if(this.Desarrollo === 'all'){
    return
  }
  this.parques.forEach(element => {
    element.Tour === this.Desarrollo ? search.push(element) : null 
  });
  this.parques = search;
}

  
}
