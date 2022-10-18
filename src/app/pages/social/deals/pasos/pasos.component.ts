import { Component, ElementRef, OnInit } from '@angular/core';
import { info } from 'console';
import { ZapierService } from 'src/app/services/zapier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pasos',
  templateUrl: './pasos.component.html',
  styleUrls: ['./pasos.component.scss']
})
export class PasosComponent implements OnInit {

  public ListaProspectos: any = [];
  public listarZonas: any = [];
  public spinner: boolean = true;
  public item: any = {};
  public itemLead: any = {};
  public tiempo: number;
  public SociosComerciales: any = [];
  public sociocid: any = {
    id: ''
  };
  constructor(private zap: ZapierService, private el:ElementRef) { }

  ngOnInit(): void {

    console.log('ngOnInit');
    
    this.zap.listarProspectos().subscribe((data: any) => {
      this.ListaProspectos = JSON.parse(data[0].ZAP);
      //console.log(this.ListaProspectos);
    })

    this.zap.ListarSociosComerciales().subscribe((res: any) => {
      //console.log(res);
      this.SociosComerciales = res;
    })

    // Zonas (Temperaturas)
    this.zap.ObtenerSistema('zonas').subscribe((res: any) => {
      this.listarZonas = res;
      // console.log('Zonas: ');
      // console.log(this.listarZonas);
    })

    this.zap.disparadorProcesos.subscribe((res: any) => {
      this.spinner = true;
      this.item = res.data;
      console.log(this.item);
      console.log("_-------");
      console.log(res);


      this.zap.ObtenerLeadId(this.item.IdReferencia).subscribe((data: any) => {

        console.log(this.spinner);

        this.itemLead = data[0];
        
        console.log(this.itemLead);
        console.log('TEST');
        
        let fechaInicio: any = new Date(this.item.Fecha);
        let fechaFina: any = new Date();
        console.log(fechaInicio);
        
        let days_as_mili = 86400000;
        let diff_in_mili = fechaFina - fechaInicio;
        let tiempoDias = diff_in_mili / days_as_mili;
        let str = tiempoDias.toString();
        let dias = str.split('.');
        this.tiempo = parseInt(dias[0]);

        this.spinner = false;
        console.log(this.spinner);
      })

    })

  }


  reasignar(){

    let nuevoSC = this.el.nativeElement.querySelector('#asignar').value;

    let DataSend:any = {};
    let Historial:any = {};
    let historialArray:any = [];
    
    DataSend.scnuevo = nuevoSC;
    DataSend.IdLead = this.itemLead.Idlead;
    DataSend.IdAsignadoSC = nuevoSC;
    //Fecha no se pasa, lo hace el store procedure
    DataSend.IdAsignadoIDLider = null;
    DataSend.IdAsingadoAsesor = null;
    DataSend.IdAsesor1 = nuevoSC;
    DataSend.IdAsesor2 = nuevoSC;
    DataSend.IdReferencia = this.itemLead.Idlead;
      
    //Historial
    Historial.Idsc = nuevoSC;
    Historial.IdASesor1 = this.item.IdAsesor2;
    Historial.IdAsesor2 = this.item.IdAsesor2;
    Historial.IdAsignadoAsesor = this.itemLead.IdAsignadoAsesor;
    Historial.IdAsignadoIdLIder = this.itemLead.IdAsignadoIdLIder;
    Historial.Fecha = new Date();

    // Obtenemos la Fecha de Asignación original
    Historial.FechaAsignado = new Date();
    Historial.FechaAsignado.setDate(Historial.FechaAsignado.getDate() - this.tiempo);

    console.log('----Funcion Reasignar----');
    console.log('DataSend');
    console.log(DataSend);
    
    console.log('Historial');
    console.log(Historial);
    
    console.log('this.itemLead');
    console.log(this.itemLead);
    
    console.log('this.item');
    console.log(this.item);

    console.log('Fecha Asignado');
    console.log('Tiempo desde la asignación: ' + this.tiempo);
    console.log(Historial.Fecha); // .toLocaleString()
    console.log(Historial.FechaAsignado); // .toLocaleString()   

    // Toast
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    // Condición en caso de que se quiera reasignar el SC que ya está asignado
    if (Historial.Idsc == this.itemLead.IdAsignadoSC) {
      Toast.fire({
        icon: 'error',
        title: 'No se puede reasignar al SC asignado'
      })
    } else { // Caso contrario asignamos el SC elegido
      this.spinner = true;

      // Asignación
      if (JSON.parse(this.itemLead.HistorialLead) == null) {
        console.log("no trae nada");
        DataSend.Historial = JSON.stringify(Historial);
      } else{
  
        if (JSON.parse(this.itemLead.HistorialLead).length > 1) {
          
          JSON.parse(this.itemLead.HistorialLead).forEach(element => {
            console.log(element);
            historialArray.push(element);
          });
          historialArray.push(Historial);
          DataSend.Historial = JSON.stringify(historialArray);
  
        } else {
          historialArray.push( JSON.parse(this.itemLead.HistorialLead));
          historialArray.push(Historial);
          DataSend.Historial = JSON.stringify(historialArray);
        }
  
      }
  
      this.zap.ReasignarLead(DataSend).subscribe((res:any) => {
        console.log(res);

        Toast.fire({
          icon: 'success',
          title: 'Se ha reasignado correctamente'
        })
        
        this.spinner = false;
      })
      
      

      // // Actualizamos la variable tiempo
      const d = new Date();
      this.tiempo = d.getDate() - Historial.Fecha.getDate()
      console.log('Tiempo desde la asignación: ' + this.tiempo);
  
      // Actualizamos la Fecha de Asignación
      const Fecha = new Date()
      this.item.Fecha = Fecha.getUTCFullYear() + '-' + (Fecha.getUTCMonth() + 1) + '-' + Fecha.getUTCDate();

      // Actualizamos el Asesor
      this.item.Asesor = $("#asignar>option:selected").html();
    }
  }

  recordar(item){
    console.log(item, 'ITEM PROSPECTO');
    let date = item.FechaOrigen;
    let result;
    result = new Date(date).toLocaleDateString();
    let holiboli:any = {
      titulo : 'Aviso de Asignación',
      texto : `Este mensaje es un aviso para que actues sobre tu lead con nombre ${item.Fullname} ya que lleva ${this.tiempo} Días sin movimientos`,
      Fecha : result,
      inversionista: item.IdAsesor2,
      whoiam: 2,
      name:'Fibrax.jpg',
      recordatorio: true
    }
  this.zap.recordatorio(holiboli).subscribe((res: any) => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Se ha enviado el recordatorio',
    showConfirmButton: false,
    timer: 1500
  })
  });  
  }
}
