import { Component, ElementRef, OnInit } from '@angular/core';
import { data } from 'jquery';
import { AppService } from 'src/app/services/app.service';
import{AvisosService} from 'src/app/services/avisos.service';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']



})
export class NotificacionesComponent implements OnInit {
  saveUsername: boolean;
  nameimg: any;
 

  constructor(public app:AppService, public avisos:AvisosService ,private calendar: NgbCalendar) {

    
  }
  
  public  mensajes:any;
  public showconten: boolean ;
  public model: NgbDateStruct;
  public date: {year: number, month: number};
  public sinImputarValue;
   public closebutton: ElementRef;
   public Notificacion : any = {};
   public imageChangedEvent: any = '';
   public file: any= {};
   public img: any = 1 ;
   public imgs: any=[];
   public Ingresar: any ={};
   public enviarconimagen:any ={} ;
   public show: boolean ;
   public marked = false;
   public theCheckbox = false;
  public link:any ={};
  public x = 1;
  public showenviar:boolean = true;
  radioSelected
  horayminutos

 public selectToday() {
  if(this.horayminutos == undefined || this.horayminutos == null || this.horayminutos == ' ' ){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: 'Selecciona una hora'
    })
    return
  }
    this.horayminutos = this.horayminutos.split(':');
  let fecha = {
               year:  this.model.year,
              month:  this.model.month,
                day:  this.model.day,
               hora:  Number(this.horayminutos[0]),
            minutos:  Number(this.horayminutos[1])
             }
    let año       =JSON.stringify(fecha)
    let titulo    =  this.Notificacion.titulo;
    let texto     = this.Notificacion.texto;
    let cadena    = JSON.parse(localStorage.getItem("user_data"));
    let IdPersona = (cadena.Nombre +' '+ cadena.Apellidos);
    let imgg      = 1 ;
    let name      = localStorage.getItem("Imagen");
    let link      = this.Notificacion.link;
    let check     =  localStorage.getItem('check');
    if(check == 'true'){
      let whoiam = this.radioSelected
        if(this.horayminutos == undefined){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: 'Selecciona una hora'
          })
          return
        }
      if(año == null){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: 'Selecciona una fecha</a>'
        })
        return
      }
      if(whoiam == null){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: 'Selecciona un destinatario'
        })
        return
      }
      console.log(año)
      this.avisos.Agendanotifiacion({
        whoiam:whoiam,
          link:link,
           año:año,
          name:name,
        titulo:titulo,
         texto:texto, 
     IdPersona:IdPersona
    }).subscribe((res: any) => {
        console.log(res); 
        this.show = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been1 saved',
          showConfirmButton: false,
          timer: 2000
        })
        this.avisos.getnotificaciones({}).subscribe((result) => {
          this.mensajes = result[0]
          for(let i=0;i<this.mensajes.length;i++){
          let Fechan=  JSON .parse(this.mensajes[i].FechaAgenda)
          this.mensajes[i].FechaAgenda = Fechan.day+'-'+Fechan.month+'-'+Fechan.year
          this.mensajes[i].Hora = Fechan.hora+':'+Fechan.minutos 
          }
          console.log(this.mensajes)
          })
      });
    }else{
      let whoiam = this.radioSelected
      if(this.horayminutos == undefined){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: 'Selecciona una hora'
        })
        return
      }
      if(año == null){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: 'Selecciona una fecha</a>'
        })
        return
      }
      if(whoiam == null){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: 'Selecciona una destinatario'
        })
        return
      }
      this.avisos.Agendanotifiacion({
        whoiam:whoiam,
           año:año,
          name:name,
        titulo:titulo, 
         texto:texto,
     IdPersona:IdPersona
    }).subscribe((res: any) => {
        console.log(res);
        this.show = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been2 saved',
          showConfirmButton: false,
          timer: 2000
        })
        this.avisos.getnotificaciones({}).subscribe((result) => {
          this.mensajes = result[0]
          for(let i=0;i<this.mensajes.length;i++){
          let Fechan=  JSON .parse(this.mensajes[i].FechaAgenda)
          this.mensajes[i].FechaAgenda = Fechan.day+'-'+Fechan.month+'-'+Fechan.year
          this.mensajes[i].Hora = Fechan.hora+':'+Fechan.minutos 
          }
          console.log(this.mensajes)
          })
      });
    }
  
  }
 public showcontenn(){
    this.showconten=true;
    this.showenviar=false
    if(this.x==2){
      this.showconten=false;
      this.showenviar=true
      this.x=0
    }
    this.x++
  }

public setFile(files: FileList) {
    this.file = files[0];
}
public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(event);
}

public  Notificacionsend(){
let titulo =  this.Notificacion.titulo;
let texto = this.Notificacion.texto;
let cadena = JSON.parse(localStorage.getItem("user_data"));
let IdPersona = (cadena.Nombre +' '+ cadena.Apellidos);
let imgg = 1 ;
let name = localStorage.getItem("Imagen");
let link = this.Notificacion.link;
let check =  localStorage.getItem('check');

if(check == 'true'){
  console.log(this.radioSelected)
  let whoiam = this.radioSelected
  if(whoiam == null){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: 'Selecciona una fecha</a>'
    })
    return
  }
let inversionista= 0;
  this.avisos.notificacionsend({
inversionista:inversionista,
       whoiam:whoiam,
         link:link,
         imgg:imgg,
         name:name,
       titulo:titulo,
        texto:texto,
    IdPersona:IdPersona
    }).subscribe((res: any) => {
    console.log(res);
    this.show = false;
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Seleccione a quien notificar',
      showConfirmButton: false,
      timer: 2000
    })
  });
}else{
  console.log(this.radioSelected)
  let whoiam = this.radioSelected
  if(whoiam == null){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: 'Seleccione a quien notificar</a>'
    })
    return
  }
  let inversionista = 0
  this.avisos.notificacionsend({
    inversionista:inversionista,
           whoiam:whoiam,
             imgg:imgg,
             name:name,
           titulo:titulo, 
            texto:texto, 
        IdPersona:IdPersona
      }).subscribe((res: any) => {
    console.log(res);
    this.show = false;
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been2 saved',
      showConfirmButton: false,
      timer: 2000
    })
  });
}
setTimeout(() => window.location.reload() , 2000);
}


public NombreImg(){
  let img = 0 ;
  let name = this.file.name
  this.avisos.notifiaccionimg({img:img, name:name}).subscribe((result) => {
 this.imgs= result;
  });
}
onItemChange(){
  console.log(this.radioSelected)
}
public openFile (data){
  Swal.fire({
    title: data.Imagen,
    imageUrl: this.app.dominio +'assets/img/Img-Notificaciones/'+data.Imagen,
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
  })
}
public EliminarMensaje(data){
console.log(data)
this.avisos.eliminarmensaje({data:data}).subscribe((result) => {
  console.log(result);
   });
    this.avisos.getnotificaciones({}).subscribe((result) => {
      this.mensajes = result[0]
      for(let i=0;i<this.mensajes.length;i++){
      let Fechan=  JSON .parse(this.mensajes[i].FechaAgenda)
      this.mensajes[i].FechaAgenda = Fechan.day+'-'+Fechan.month+'-'+Fechan.year
      this.mensajes[i].Hora = Fechan.hora+':'+Fechan.minutos 
      }
      return this.mensajes
      })
}

public selectimg(data){
 let name = data.Imagen
 this.nameimg = data.Image
 localStorage.setItem('Imagen',name);
 this.show = true;
}
public toggleVisibility(e){
  this.marked= e.target.checked;
  localStorage.setItem('check', e.target.checked)
}

public confirmar2(){
  let formdata = new FormData();
  formdata.append('documento', this.file);
  console.log(this.file);
  let name = this.file.name;
  let titulo = this.Ingresar.tituloarchivo
  let img = 1 ;
  this.avisos.upimg(formdata).subscribe((res: any) => {
    console.log(res);  
    console.log('seevio APi'); 
  });
  this.avisos.notifiaccionimg({
    titulo:titulo,
      name:name,
       img:img
      }).subscribe((result) => {
    console.log(result);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 2000
    })

  });
  
}
  ngOnInit(): void {
    console.log(this.Notificacion)
    this.avisos.getnotificaciones({}).subscribe((result) => {
      this.mensajes = result[0]
      for(let i=0;i<this.mensajes.length;i++){
      let Fechan=  JSON .parse(this.mensajes[i].FechaAgenda)
      this.mensajes[i].FechaAgenda = Fechan.day+'-'+Fechan.month+'-'+Fechan.year
      this.mensajes[i].Hora = Fechan.hora+':'+Fechan.minutos 
      }
      console.log(this.mensajes)
      })
  }
}