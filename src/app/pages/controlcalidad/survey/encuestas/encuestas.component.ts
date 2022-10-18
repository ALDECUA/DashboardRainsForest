import { Component, OnInit } from '@angular/core';
import { createPublicKey } from 'crypto';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';
import { ModalComponent } from '../../../fxcoins/pedidos/modal/modal.component';
declare var bootstrap : any;

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.scss'],
})
export class EncuestasComponent implements OnInit {
  constructor(
    private controlcalidad: ControlcalidadService,
    private toast: ToastrService,
    private auth: AuthService
  ) {}
  public encuesta: any = { preguntas: [{ tipo: '0', IdStatus: '1' }] };
  public encuestas = [];
  public empty: boolean = false;
  public usuario;
  public nopcion: any = {};
  ngOnInit(): void {
    this.controlcalidad.obtenerEncuestas().subscribe((res: any) => {
      if (res.error) {
        this.toast.error(
          'Ocurrio un error interno, intenta nuevamente, si el problema persiste contacta a desarrollo'
        );
      } else {
        if (res.empty) {
          this.empty = true;
        } else {
          this.encuestas = res.encuestas;
        }
      }
    });
    this.usuario = this.auth.user;
  }
  tipopregunta(pregunta) {
    if (pregunta.tipo > 1) {
      pregunta.opciones = [];
    } else {
      delete pregunta.opciones;
    }
  }
  opcionnueva(pregunta) {
    pregunta.opciones.push( {valor:pregunta.nopcion});
    pregunta.nopcion = '';
    console.log(pregunta, 'termino')
  }
  preguntanueva() {
    this.encuesta.preguntas.push({ tipo: '0', IdStatus: '1' });
  }
  borrar(status) {
    this.encuesta.IdStatus = status;
    this.guardarencuesta();
  }
  escribir(event, pregunta) {
    console.log(pregunta)
    if (event.key == 'Enter') {
      this.opcionnueva(pregunta);
    }
  }
  eliminar(pregunta, i, tipo) {
    if (tipo == 1) {
      let encuesta = this.encuesta.preguntas;
      let nencuesta = [];
      encuesta.forEach(function (currentValue, index, arr) {
        if (index != i) {
          nencuesta.push(encuesta[index]);
        }
      });
      this.encuesta.preguntas = nencuesta;
    } else {
      let opciones = pregunta.opciones;
      let nopciones = [];
      opciones.forEach(function (currentValue, index, arr) {
        if (index != i) {
          nopciones.push(opciones[index]);
        }
      });
      pregunta.opciones = nopciones;
    }
  }
  public guardarencuesta() {
    let preguntas = JSON.stringify(this.encuesta.preguntas);
    this.encuesta.Estructura = preguntas;
    this.encuesta.usr = this.usuario.Nombre + ' ' + this.usuario.Apellidos;
    this.controlcalidad
      .modificarencuesta(this.encuesta)
      .subscribe((res: any) => {
        if (!res.error) {
          this.toast.success(res.Mensaje);
          this.encuestas = res.Encuestas
        } else {
          this.toast.error('Ocurrio un error interno')
        }
      });
  }
  seleccionar(encuesta: any) {
    if (encuesta == 0) {
      this.encuesta = { preguntas: [{ tipo: '0', IdStatus: '1' }] };
    } else {
      encuesta.preguntas = JSON.parse(encuesta.Estructura);
      this.encuesta = encuesta;
    }
  }

  cerrar(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "No se guardaran estos cambios",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        const truck_modal = document.querySelector('#exampleModal');
        const modal = bootstrap.Modal.getInstance(truck_modal);
        modal.hide();
      }
    })
  }
  eliminarP(pregunta,i,a){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Este cambio afectará a las respuestas guardadas",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#808080',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar pregunta',
      allowOutsideClick: () => {
        const popup = Swal.getPopup()
        popup.classList.remove('swal2-show')
        return false
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(pregunta,i,a)
      }
    })
  }
}
