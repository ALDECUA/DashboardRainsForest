import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosCrmService } from 'src/app/services/usuarios-crm.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.scss']
})
export class ComisionesComponent implements OnInit {

  public perfiles: any[];
  public ArregloColumnas: any = [];
  public configDataTable = {}
  public comisiones;
  public idcomision;
  public Ecoins: any = [];
  public form: any = [];
  public columnas;
  public Venta;
  public aregloventa;
  public NivelNuevo;
  public nombrenivel;
  public Interes;
  public loading: boolean = true;
  Nombre: any;
  columnasitems: any;
  constructor(public app: AppService,
    private auth: AuthService,
    private CRMService: UsuariosCrmService) {
    this.app.currentModule = 'Configuracion';
    this.app.currentSection = ' - Comisiones';
  }

  ngOnInit(): void {
    this.cargardatos();
  }
  cargardatos(){
    this.CRMService.ObtenerNiveles().subscribe((res: any) => {
      this.comisiones = res[0];
      this.columnas = res[1];
      this.columnasitems = res[1];
      this.loading = false;
      console.log(this.comisiones)
    })
  }

  Enviarid(item) {
    this.Ecoins = [];
    this.idcomision = item;
    console.log(item)
  }
  CambiarComisiones(nombre, comizion, item) {
    comizion.nuevo = item
    let checadas = false;
    let columnas: any = comizion
    if (this.Ecoins.length == 0) {
      this.Ecoins.push(columnas)

    } else {
      
      for (var i = 0; i < this.Ecoins.length; i++) {
        if (this.Ecoins[i].key == columnas.key) {
          this.Ecoins.splice(i, 1);
          break;
        }
      }
      if (checadas == false) {

        this.Ecoins.push(columnas)
      }
    }
    console.log(this.Ecoins)
  }
  Guardarnuevacomision() {
    console.log(this.Ecoins)
    let iduser = JSON.parse(localStorage.getItem('user_data'));
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Estoy seguro',
      cancelButtonText: 'No, Salir',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        for (let i = 0; i < this.Ecoins.length; i++) {
          this.CRMService.InsertarComisiones({ Venta: this.Ecoins[i].nuevo, Fx: this.Ecoins[i].key, Id: this.idcomision.IdComision, Opcion: 1, iduser: iduser.IdUsuario }).subscribe((res: any) => {
            this.comisiones = res;
          })
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        let cerrar = document.getElementById('cerrar');
        cerrar.click();
      }
    })
  }
  CambiarStatus(item) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Estoy seguro',
      cancelButtonText: 'No, Salir',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(item)
        let iduser = JSON.parse(localStorage.getItem('user_data'));
        console.log(iduser.IdUsuario, 'si es el ')
        if (item.IdStatus == 0) {
          item.IdStatus = 1;
        } else if (item.IdStatus == 1) {
          item.IdStatus = 0;
        }
        console.log(item.IdStatus)
        this.CRMService.InsertarComisiones({ Id: item.IdComision, Opcion: 2, AcDe: item.IdStatus, iduser: iduser.IdUsuario }).subscribe((res: any) => {
          console.log(res);
          let cerrar = document.getElementById('cerrar');
          cerrar.click();
          this.comisiones = res;
        })
      }
    })
  }

  NuevoNivelfuncion() {
    let cerrar = document.getElementById('cerrardos');
    cerrar.click();
    let iduser = JSON.parse(localStorage.getItem('user_data'));
    this.CRMService.Insertarnuevonivel({ NivelNuevo: this.NivelNuevo, iduser: iduser.IdUsuario }).subscribe((res: any) => {
      console.log(res);
      this.comisiones = res;
    })

  }
  CambiarNombre(item) {
    this.nombrenivel = item.Nivel
    this.Nombre = item
  }
  EditarNombre() {
    let cerrar = document.getElementById('cerrartres');
    cerrar.click();
    let iduser = JSON.parse(localStorage.getItem('user_data'));
    console.log(this.nombrenivel)
    this.CRMService.InsertarComisiones({ Id: this.Nombre.IdComision, Opcion: 3, Nivel: this.nombrenivel, iduser: iduser.IdUsuario }).subscribe((res: any) => {
      this.comisiones = res;
    })
  }
  AgregarColumna() {
    Swal.fire({
      title: 'Introdusca nombre de la columna',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,

      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result,this.comisiones)
 
        this.CRMService.InsertarColumna(result.value).subscribe((res: any) => {
          if(res.error){
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
            
            Toast.fire({
              icon: 'error',
              title: 'Columna ya existe'
            })

            this.cargardatos();
          }else{
            this.comisiones = res[0];
            this.columnas = res[1];
          }
     
        })
      }
    })

  }
  EliminarColumna() {
    for (let i = 0; i < this.ArregloColumnas.length; i++) {
      this.CRMService.EliminarColumna(this.ArregloColumnas[i]).subscribe((res: any) => {
        this.comisiones = res[0];
        this.columnas = res[1];
      })
    }
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
    
    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    })
    let cerrar = document.getElementById('eliminarcolumna')
    cerrar.click();
  }
  GuardarCheck(item) {
    let checadas = []
    let columnas: any = document.getElementsByName('columnas[]');
    for (var i = 0; i < columnas.length; i++) {
      columnas[i].checked ? checadas.push(columnas[i].value) : ''
    }
    this.ArregloColumnas = checadas;
  }

}
