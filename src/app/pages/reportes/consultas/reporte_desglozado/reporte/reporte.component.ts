import { Component, OnInit } from '@angular/core';
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
  public Desarrollo = 0;
  public des: any = [];
  public todolotes:any ;
  filtrolotes: any;
  renderer: any;
  Desarrollodos
  CotizacionesPorDesarrollo: any;
  InformacionCotizacion: any;
  constructor(
    private activatedRouter: ActivatedRoute,
    public app: AppService,
    public reportes: ReportesService
  ) {}
  public reporte;

  onChangeObj():void{
   let Desarrollo = new Number(this.DesarrolloFiltro)
   let estapa = new Number(this.Etapa) 
   this.reportes.FiltrarLotes({IdDesarrollo :Desarrollo,IdFase:estapa }).subscribe((res: any) => {
    this.filtrolotes=res
    for(let i=0;i <= this.filtrolotes.length; i++){
      if(this.filtrolotes[i].Fecha_Registro == null || this.filtrolotes[i].Fecha_Registro == undefined || this.filtrolotes[i].Fecha_Registro == '' ){
        this.filtrolotes[i].Fecha_Registro = "-"
      }else{
        let cadena = this.filtrolotes[i].Fecha_Registro.split('T')
      this.filtrolotes[i].Fecha_Registro = cadena[0];
    }
  }
   });
  }
 

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params: any) => {
      this.reporte = params.params.id;
     
      /* this.titulo = 'Volumen HR'; */
    });
    this.reportes.obtenerparqueid(this.reporte).subscribe((res:any) => {

    })

    this.DescargaGeneral();
    this.getDesarrollos();
  }
  ObtenerCotizaciones(){
    this.reportes.Cotizaciones().subscribe((res:any) => {
      this.CotizacionesPorDesarrollo= res
      for(let i = 0 ; i < this.CotizacionesPorDesarrollo.length; i ++ ){
        this.CotizacionesPorDesarrollo[i].Lotes_Informacion = JSON.parse(this.CotizacionesPorDesarrollo[i].Lotes_Informacion)
        if(this.CotizacionesPorDesarrollo[i].IdHR == null){
          this.CotizacionesPorDesarrollo[i].IdHR = 'No'
        }else{
          this.CotizacionesPorDesarrollo[i].IdHR = 'Si'
        }   
      }
  })
  }

  Filtros() {
    switch (this.reporte) {
      case '2':
        this.filtrarpagos();
        break;
      case '1':
        this.ObtenerVolumenHR();
        break;
    }
  }
  Descarga() {
    switch (this.reporte) {
      case '2':
        this.ImprimirPagos();
        break;
      case '1':
        this.ImprimirVolumenHR();
        break;
        case '3':
        this.ImprimirLotes();
        break;
        case '4':
          this.ImprimirCotizaciones();
          break;

    }
  }

  ImprimirCotizaciones(){
    let datos = '';
    for (let i = 0; i < this.CotizacionesPorDesarrollo.length; i++) {
     if(i == 0 ){
      datos +=` 
      <tr style="background-color: #cadcf9;">
    <td ><strong> ` +
      this.CotizacionesPorDesarrollo[i].Nombre_Interesado +
      `</strong></td>
    <td ><strong>` +
      this.CotizacionesPorDesarrollo[i].Telefono_Interesado +
      `</strong></td>
    <td ><strong>` +
      this.CotizacionesPorDesarrollo[i].Email +
      `</strong></td>
    <td ><strong> ` +
      this.CotizacionesPorDesarrollo[i].IdHR +
      `</strong> </td>
  </tr>
  <tr >
  <table style="margin-top: -10px" class="table">
  <thead >
  <tr>
      <th>Lote</th>
      <th>Desarrollo</th>
      <th>Etapa</th>
      <th>Financiamiento</th>
      <th>Precio</th>
   </tr>
  </thead>
  <tbody>
  `;
     }else{
      datos +=
      ` <tr>
      <table style="margin-top: -10px 10px" class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #cadcf9;">
        <td ><strong>` +
          this.CotizacionesPorDesarrollo[i].Nombre_Interesado +
          `</strong></td>
        <td ><strong>` +
          this.CotizacionesPorDesarrollo[i].Telefono_Interesado +
          `</strong></td>
        <td ><strong>` +
          this.CotizacionesPorDesarrollo[i].Email +
          `</strong></td>
        <td ><strong> ` +
          this.CotizacionesPorDesarrollo[i].IdHR +
          `</strong> </td>
      </tr>
      </tbody>
    </table>
    </tr>
  <tr >
  <table style="margin-top: -10px  10px"  class="table">
  <thead >
  <tr >
      <th >Lote</th>
      <th >Desarrollo</th>
      <th >Etapa</th>
      <th >Financiamiento</th>
      <th >Precio</th>
   </tr>
  </thead>
  <tbody  >
  `;
     }
      for(let a = 0; a< this.CotizacionesPorDesarrollo[i].Lotes_Informacion.length; a++){

        if(this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 21 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 20 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 15 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 11 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 9 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 128 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 130   ){
            this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa = '1'
        }  
        if(this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 2 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 16 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 8 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 129 ||
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 131  ){
            this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa = '2'
       }
       if(this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 3  ){
        this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa = '3'
     }
     if(this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa == 4  ){
      this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa = '4'
    }

          datos +=
          `<tr>
        <td>` +
        this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].NombreLote +
          `</td>
        <td>` +
        this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].NDesarrollo +
          `</td>
        <td>` +
        this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].IdEtapa +
          `</td>
          <td>` +
          this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].Financiamiento +
        `</td>
        <td> ` +
        this.CotizacionesPorDesarrollo[i].Lotes_Informacion[a].Precio_Total +
          ` </td>
      </tr>`;
        }
        datos += ` </tbody>
        </table>
        </tr><br>`
        ;
    }
    console.log(this.CotizacionesPorDesarrollo)
    this.reportes
      .enviarReporte({
        reporte: ' Cotización General',
        campos_tabla: ` <tr>
      <th>Nombre Interesado</th>
      <th>Teléfono</th>
      <th>Correo</th>
      <th>HR</th>
    </tr>`,
        registros: datos,
        detalles:'Fecha: ' +new Date().toLocaleDateString(),
      })
      .subscribe((res: any) => {
        var blob = new Blob([res]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.pdf';
        link.click();
      });
  }

  DescargaGeneral(){
    this.reportes.getDesarrolloslotes().subscribe((res: any) => {
      console.log(res);
      this.todolotes = res 
      for(let i=0;i <= this.todolotes.length; i++){
        if(this.todolotes[i].Fecha_Registro == null || this.todolotes[i].Fecha_Registro == undefined || this.todolotes[i].Fecha_Registro == '' ){
          this.todolotes[i].Fecha_Registro = "-"
        }else{
          let cadena = this.todolotes[i].Fecha_Registro.split('T')
        this.todolotes[i].Fecha_Registro = cadena[0];
      }
      }   
      for(let i=0;i <= this.todolotes.length; i++){
        if(this.todolotes[i].NombreInversionista == ''){
          this.todolotes[i].NombreInversionista = "-"
          console.log(this.todolotes[i].NombreInversionista)
        }
      }   
      for(let i=0;i <= this.todolotes.length; i++){
        if(this.todolotes[i].Precio_Final == null){
          this.todolotes[i].Precio_Final = "-"
        }
      } 
    });
  }
  ImprimirLotes()
  {
    let detall = this.consultafecha();
    let datos = '';
    for (let i = 0; i < this.lotes.length; i++) {
      datos +=
        `<tr>
      <td>` +
        this.lotes[i].Desarrollo +
        `</td>
      <td>` +
        this.lotes[i].TotalLotes +
        `</td>
      <td>` +
        this.lotes[i].LotesDisponibles +
        `</td>
      <td> ` +
        this.lotes[i].LotesApartados +
        ` </td>
        <td> ` +
        this.lotes[i].LotesVendidos +
        ` </td>
        <td> ` +
        this.lotes[i].LotesSecretos +
        ` </td>
    </tr>`;
    }
    
    this.reportes
      .enviarReporte({
        reporte: this.titulo,
        campos_tabla: ` <tr>
        <th>Desarrollo</th>
        <th># total de lotes</th>
        <th>Disponibles</th>
        <th>Apartados</th>
        <th>Vendidos</th>
        <th>Secretos</th>
    </tr>`,
        registros: datos,
        detalles: 'Fecha: ' +new Date().toLocaleDateString(),
      })
      .subscribe((res: any) => {
        var blob = new Blob([res]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.pdf';
        link.click();
      });
  }
  ObtenerPagos() {
    this.reportes.ReporteHR().subscribe((res: any) => {
      this.pagos = res;
      this.pagosb = res;
      console.log(this.pagos);
    });
  }
  ObtenerLotes() {
    this.reportes.lotes().subscribe((res: any) => {
      this.lotesb = res;
      console.log(this.lotesb, 'asd');
      for (let i = res.length - 3; i >= 0; i--) {
        if (res[i][0].Desarrollo !== 'NA') {
          this.lotes.push(res[i][0]);
        }
      }
      console.log(this.lotes , 'este');
    });
  }
  ObtenerVolumenHR() {
    console.log(this.desde + ' ' + this.hasta);
    if (this.desde == '') {
      this.desde = null;
    }
    if (this.hasta == '') {
      this.hasta = null;
    }
    this.reportes
      .VolumenHR({ FechaInicio: this.desde, FechaFinal: this.hasta })
      .subscribe((res: any) => {
        this.Volumen = res;
        console.log(this.Volumen);
      });
  }
  g_reporte() {}
  filtrarpagos() {
    console.log(this.desde + this.hasta);
    let fecha;
    let cont;
    let des;
    this.pagos = this.pagosb.filter((elem) => {
      cont = 0;
      let str;
      ['IdConcepto'].forEach((field) => {
        str = elem[field];
      });
      ['FechaPago'].forEach((field) => {
        fecha = elem[field];
      });
      ['IdDesarrollo'].forEach((field) => {
        des = elem[field];
      });
      if (this.Desarrollo == 0) {
        cont++;
      } else {
        if (des == this.Desarrollo) {
          cont++;
        }
      }
      if (this.tipo == 0) {
        cont++;
      } else {
        if (str == this.tipo) {
          cont++;
        }
      }
      if (this.desde == '') {
        cont++;
      } else {
        if (new Date(fecha) >= new Date(this.desde)) {
          cont++;
        }
      }
      if (this.hasta == '') {
        cont++;
      } else {
        if (new Date(fecha) <= new Date(this.hasta)) {
          cont++;
        }
      }
      if (cont == 4) {
        return true;
      } else return false;
    });
  }
  getDesarrollos() {
    this.reportes.getDesarrollos().subscribe((res: any) => {
      this.des = res.desarrollos;
      console.log(this.des ,'aqui' );
    });
  }
  ImprimirPagos() {
    let detall =
      'Desarrollo:' +
      this.consultardes() +
      '&nbsp;&nbsp;&nbsp;' +
      this.consultafecha();
    let datos = '';
    for (let i = 0; i < this.pagos.length; i++) {
      datos +=
        `<tr>
      <td>` +
        this.pagos[i].Desarrollo +
        `</td>
      <td>` +
        this.pagos[i].nombre +
        `</td>
      <td>` +
        this.pagos[i].Concepto +
        `</td>
      <td> ` +
        this.pagos[i].Importe +
        ` </td>
      <td>` +
        this.pagos[i].FPago +
        `</td>
    </tr>`;
    }

    this.reportes
      .enviarReporte({
        reporte: this.titulo,
        campos_tabla: ` <tr>
      <th>Desarrollo</th>
      <th>Lote</th>
      <th>Concepto</th>
      <th>Monto</th>
      <th>Fecha pago</th>
    </tr>`,
        registros: datos,
        detalles: detall,
      })
      .subscribe((res: any) => {
        var blob = new Blob([res]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.pdf';
        link.click();
      });
  }
  ImprimirReporteGeneral(){
    let datos = '';
    for (let i = 0; i < this.todolotes.length; i++) {
      datos +=
        `<tr>
        <td>` +
        this.todolotes[i].Desarrollo +
        `<td>
      <td>` +
        this.todolotes[i].Nombre +
        `</td>
      <td>` +
        this.todolotes[i].NombreInversionista +
        `</td>
      <td>` +
        this.todolotes[i].Precio_Final +
        `</td>
      <td> ` +
        this.todolotes[i].Fecha_Registro +
        ` </td>
        <td> ` +
        this.todolotes[i].Status +
        ` </td>
    </tr>`;
    }

    this.reportes
      .enviarReporte({
        reporte: 'Reporte General',
        campos_tabla: ` <tr>
      <th>Desarrollo</th>
      <th>Lote</th>
      <th>Inversionista</th>
      <th>Presio Venta</th>
      <th>Fecha</th>
      <th>Estatus</th>
    </tr>`,
        registros: datos,
        detalles: 'Fecha: ' +new Date().toLocaleDateString(),
      })
      .subscribe((res: any) => {
        var blob = new Blob([res]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.pdf';
        link.click();
      });

  }
  ImprimirReporteFiltrado(){
    let datos = '';
    for (let i = 0; i < this.filtrolotes.length; i++) {
   
      datos +=
        `<tr>
      <td>` +
        this.filtrolotes[i].Nombre +
        `</td>
      <td>` +
        this.filtrolotes[i].NombreInversionista +
        `</td>
      <td>` +
        this.filtrolotes[i].Precio_Final +
        `</td>
      <td> ` +
        this.filtrolotes[i].Fecha_Registro +
        ` </td>
        <td> ` +
        this.filtrolotes[i].Status +
        ` </td>
    </tr>`;
    }
    if(this.DesarrolloFiltro == 12){
      this.DesarrolloFiltro = 'COPROPIEDAD'
    }
    if(this.DesarrolloFiltro == 11){
      this.DesarrolloFiltro = 'KUNAL'
    }
    if(this.DesarrolloFiltro == 10){
      this.DesarrolloFiltro = 'VILLAMAR'
    }
    if(this.DesarrolloFiltro == 8){
      this.DesarrolloFiltro = 'MANTRA'
    }
    if(this.DesarrolloFiltro == 7){
      this.DesarrolloFiltro = 'HORIZONTES'
    }
    if(this.DesarrolloFiltro == 5){
      this.DesarrolloFiltro = 'VIA PALMAR'
    }
    if(this.DesarrolloFiltro == 4){
      this.DesarrolloFiltro = 'KOOMUNA'
    }
    if(this.DesarrolloFiltro == 3){
      this.DesarrolloFiltro = 'ZAZIL-HA'
    }
    if(this.DesarrolloFiltro == 1){
      this.DesarrolloFiltro = 'BONAREA'
    }
  
    this.reportes
      .enviarReporte({
        reporte: ' Filtrado'+' ' + this.DesarrolloFiltro,
        campos_tabla: ` <tr>
      <th>Lote</th>
      <th>Inversionista</th>
      <th>Precio Venta</th>
      <th>Fecha</th>
      <th>Estatus</th>
      
    </tr>`,
        registros: datos,
        detalles:'Fecha: ' +new Date().toLocaleDateString(),
      })
      .subscribe((res: any) => {
        var blob = new Blob([res]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.pdf';
        link.click();
      });

  }

  first(){
    try {
  const errorField = this.renderer.selectRootElement('.first-class');
    errorField.scrollIntoView();
} catch (err) {

}
}
  ImprimirVolumenHR() {
    let detall = this.consultafecha();
    let datos = '';
    for (let i = 0; i < this.Volumen.length; i++) {

      datos +=
        `<tr>
      <td>` +
        this.Volumen[i].Desarrollo +
        `</td>
      <td>` +
        this.Volumen[i].TotalHR +
        `</td>
      <td>` +
        this.Volumen[i].VolumenEnganches +
        `</td>
      <td > ` +
        this.Volumen[i].VolumenLotes +
        ` </td>
    </tr>`;
    }

    this.reportes
      .enviarReporte({
        reporte: this.titulo,
        campos_tabla: ` <tr>
      <th>Desarrollo</th>
      <th># de HRs</th>
      <th>Volumen Enganche</th>
      <th>Volumen Lotes</th>
    </tr>`,
        registros: datos,
        detalles: detall,
      })
      .subscribe((res: any) => {
        var blob = new Blob([res]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.pdf';
        link.click();
      });
  }

  consultardes() {
    for (let i = 0; i < this.des.length; i++) {
      if (this.Desarrollo == this.des[i].IdDesarrollo) {
        return this.des[i].Desarrollo;
      }
    }
    return 'Todos';
  }

  consultafecha() {
    if (
      this.desde != '' &&
      this.desde != null &&
      this.hasta != '' &&
      this.hasta != null
    ) {
      return 'Fecha: ' + new Date(this.desde).toLocaleDateString()  + ' - ' + new Date(this.hasta).toLocaleDateString();
    } else {
      if (
        this.desde == null &&
        this.desde == '' &&
        this.hasta == '' &&
        this.hasta == null
      ) {
        return 'Hasta la fecha';
      } else {
        if (this.desde != '' && this.desde != null) {
          return 'Desde: ' +  new Date(this.desde).toLocaleDateString();
        } else {
          if (this.hasta != '' && this.hasta != null) {
            return 'A: ' +  new Date(this.hasta).toLocaleDateString();
          }
        }
      }
    }
    return '';
  }
}
