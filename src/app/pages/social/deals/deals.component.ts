import { style } from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ZapierService } from '../../../services/zapier.service';
import { Observable } from 'rxjs';
import { data } from 'jquery';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent implements OnInit {
  archivo;
  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

/*   drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  } */

  data: Observable<any>;
  public listaProcesos: any = [];
  excel: any = [];
  datepipe: any;
  event: any;

  constructor(
    public app: AppService,
    private el: ElementRef,
    private zap: ZapierService,
    public toast: ToastrService,
    private router: Router
  ) { 
    this.app.currentModule = 'SOCIAL';
    this.app.currentSection = '- Leads';
  }

  ngOnInit(): void {

    const fechaInicio = this.obtenerFechaInicioDeMes(1);
      const fechaFin = this.obtenerFechaFinDeMes(1);
      const fechaInicioFormateada = this.formatearFecha(fechaInicio,1);
      const fechaFinFormateada = this.formatearFecha(fechaFin,1);
      console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
      this.ObtenerProcesos(fechaInicioFormateada,fechaFinFormateada);
    
  }

  onFileChange(event: any) {
    let excel = document.getElementById("excel");
    let progresp = document.getElementById("progresos");
    progresp.classList.remove("progreso-lead");
    excel.classList.add("progreso-lead");
    this.event = event;
    
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    let extension: any = target.files[0].name;
    extension = extension.split('.');
    extension = extension[extension.length - 1];
    if (extension != 'xlsx' && extension != 'xls' && extension != 'csv') {
      this.toast.error('Solo se admiten archivos excel para esta operación');
      this.archivo = null;
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excel = XLSX.utils.sheet_to_json(ws, {
        raw: false,
        header: ws ? 0 : 1,
        dateNF: 'dd/mm/yyyy',
      });
      console.log(this.excel)
      let btnActive = document.getElementById('progreso');
      
      setTimeout(function(){
        btnActive.style.width=""+5+"%";
      },1000);
      
        setTimeout(function(){
          btnActive.style.width=""+10+"%";
        },4000);
      

    this.zap.InsertarExcel(this.excel).subscribe((res: any) => {
      console.log(res)
      for(let i = 0 ; i< 91; i++){
        setTimeout(function(){
          btnActive.style.width=""+i+"%";
          setTimeout(function(){
            
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha cargado correctamente',
            showConfirmButton: true
            
          }).then(()=>{
            window.location.href = 'crm/social/dashboard';
          })
        
          progresp.classList.add("progreso-lead");
          excel.classList.remove("progreso-lead");

        },4000);

      },4000);

      }
      

      /* Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      }) */
      
      this.excel = [];
    });
  }
}
  public actualizarLeads(){
    document.getElementById('text-title-leads').innerHTML= this.event.target.files[0].name;
    let filePath = this.event.target.files[0].name;
    var allowedExtensions = /(\.csv|\.xlsx)$/i;

    if (!allowedExtensions.exec(filePath)) {
      document.getElementById('text-title-leads').innerHTML = 'ARRASTE O SELECCIONE UN  ARCHIVO ALGUN ARCHIVO CVS O DE EXCEL';

      Swal.fire(
        'Oops',
        'Archivo no soportado',
        'warning'
      ); 
    }

    if (this.event.target.files.length > 0) {
      console.log("x");
      let btnActive = document.getElementById('send');
      btnActive.classList.remove('disabled');
    }
  }

  public ObtenerProcesos(fechaInicial,FechaFinal){
    
    this.zap.ObtenerAsigandos({
      fechaInicial:fechaInicial,
      fechaFinal: FechaFinal,
      Origen: 'crm'
    }).subscribe((response:any) => {
      this.listaProcesos = response;
      console.log('OBTENER ASIGNADOS');
      
      console.log(this.listaProcesos);
    });

  }

  verDatos(item,opcion){
    console.log(item);
    this.zap.disparadorProcesos.emit({
      data:item,
      opcion: opcion
    })
  }

  public mesanterior(){

    const fechaInicio = this.obtenerFechaInicioDeMes(0);
      const fechaFin = this.obtenerFechaFinDeMes(0);
      const fechaInicioFormateada = this.formatearFecha(fechaInicio,0);
      const fechaFinFormateada = this.formatearFecha(fechaFin,0);
      console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
      this.ObtenerProcesos(fechaInicioFormateada,fechaFinFormateada);

  }

  public mesActual(){

    const fechaInicio = this.obtenerFechaInicioDeMes(1);
    const fechaFin = this.obtenerFechaFinDeMes(1);
    const fechaInicioFormateada = this.formatearFecha(fechaInicio,1);
    const fechaFinFormateada = this.formatearFecha(fechaFin,1);
    console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
    this.ObtenerProcesos(fechaInicioFormateada,fechaFinFormateada);

  }

  obtenerFechaInicioDeMes(opcion) {

    const fechaInicio = new Date();
    // Iniciar en este año, este mes, en el día 1
    return new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
  };

  obtenerFechaFinDeMes(opcion) {

    const fechaFin = new Date();
    // Iniciar en este año, el siguiente mes, en el día 0 (así que así nos regresamos un día)
    return new Date(fechaFin.getFullYear(), fechaFin.getMonth() +1, 0);
  };

  formatearFecha(fecha,opcion){
    let mes:any;
    let dia:any;

    if (opcion === 1) {
      mes = fecha.getMonth() +1;
      dia = fecha.getDate();
    }else{
      mes = fecha.getMonth();
      dia = fecha.getDate();
    }
    return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat(mes)}-${(dia < 10 ? '0' : '').concat(dia)}`;
  };

}
