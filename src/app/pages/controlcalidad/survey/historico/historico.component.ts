import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';
import { SurveyComponent } from '../survey.component'


declare var bootstrap: any;

@Component({
  providers: [SurveyComponent],
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
})
export class HistoricoComponent implements OnInit {
  @Input() historico: any[] = [];
  public encuesta: any = { preguntas: [], respuestas: [] };

  constructor(public app: AppService,
    public controlcalidad: ControlcalidadService,
    public toast: ToastrService,
    public auth:AuthService,
    public survey: SurveyComponent) {}

  ngOnInit(): void {}
  seleccionar(encuesta) {
    let nombre;
    let respuesta = '';
    let fecha;
    encuesta.HRS = JSON.parse(encuesta.HR)
    encuesta.preguntas = JSON.parse(encuesta.Preguntas);
    encuesta.preguntas = JSON.parse(encuesta.preguntas[0].Estructura);
    encuesta.respuestas = JSON.parse(encuesta.Respuestas);
    console.log(encuesta.respuestas)
    this.encuesta = encuesta;
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  checkeado(y, opcion) {
    let respuestas = this.encuesta.respuestas[y].valor;
   for (var respuesta of respuestas) {
      if(respuesta.Otro){
        $('#otro'+y).val(respuesta.Otro)
      }
      if (respuesta.valor == opcion.valor) {
        return true;
      }
    }
    return false;
  }
  seleccionarHR(hr){
    this.encuesta.IdHR = hr;
  }

  mo() {
    if(!this.encuesta.IdHR){
      this.encuesta.IdHR = 0
      return
    }
    let nombre;
    let fecha;
    for (let i = 0; i < this.encuesta.preguntas.length; i++) {
      let respuesta = [];
      let pregunta = this.encuesta.preguntas[i];
      if(pregunta.tipo == '2'){
        if(this.encuesta.respuestas[i].valor != 'Otro')
        {
          delete this.encuesta.respuestas[i].Otro
        }
      }
      if (pregunta.tipo == '3') {
        nombre = 'pregunta' + i + '[]';
        $("input[name='" + nombre + "']:checked").each(function (index) {
          if($(this).val() == 'Otro'){
            let valorotro = $('#otro'+i).val();
            respuesta.push({valor: 'Otro', Otro:valorotro})
          }else{
            respuesta.push({valor: $(this).val()})
          }
        });
        this.encuesta.respuestas[i].valor = respuesta;
      }
    }
    Swal.fire({
      title: '¿Seguro que deseas cambiar las respuestas de esta encuesta?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
       this.guardar()
      } else if (result.isDenied) {

      }
    });
  }
  guardar(){
    Swal.fire({
      title: 'Guardando respuestas',
      icon: 'info',
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.encuesta.Respuesta = JSON.stringify(this.encuesta.respuestas)
    this.controlcalidad.guardarEncuesta(this.encuesta).subscribe((res:any)=>{
      if(res.Updated){
        this.survey.ngOnInit()
        setTimeout(() => {
        var myOffcanvas = document.getElementById('offcanvasRight')
        var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
        bsOffcanvas.hide()
        this.toast.success("Respuestas guardadas exitosamente")
        Swal.close()
      }, 1500);
      }
    })
  }
}
