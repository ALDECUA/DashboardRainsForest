import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
declare var bootstrap:any;

@Component({
  selector: 'app-llamadas',
  templateUrl: './llamadas.component.html',
  styleUrls: ['./llamadas.component.scss'],
})
export class LlamadasComponent implements OnInit, AfterViewInit {
  constructor(
    public app: AppService,
    public controlcalidad: ControlcalidadService,
    private auth: AuthService
  ) {}

  public Llamadas: any[] = [];
  public LlamadasB: any[] = [];
  public fecha;
  public cita = {IdCita: 1, Nombre_Completo: 'uwu'};
  public modal: any;
  public status = null;
  public nota = null; 

  ngAfterViewInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('llamada'), {
      keyboard: false
    });
  }

  ngOnInit(): void {
    this.getLlamadas();
  }
  public getLlamadas()
  {
    this.controlcalidad.getLlamadas().subscribe((Llamadas: any) => {
      this.Llamadas = Llamadas;
      this.LlamadasB = Llamadas;
      console.log(this.LlamadasB);
    });
  }
  public filtroFecha() {
    this.Llamadas = this.LlamadasB;
    if (this.fecha === '') {
      return;
    }
    this.Llamadas = this.LlamadasB.filter((elem) => {
      let fech;
      ['fecha'].forEach((field) => {
        fech = elem[field];
      });
      if (fech === this.fecha) {
        return true;
      } else {
        return false;
      }
    });
  }
  public Registro(cita) {
    this.cita = cita;
    this.status = null;
    this.nota = null;
  
  }
  public CambiarStatus()
  {
    const User = this.auth.user.Nombre + ' ' + this.auth.user.Apellidos;

    this.controlcalidad.actualizarCita({
      IdCita: this.cita.IdCita,
      IdStatus: this.status,
      Nota: this.nota,
      User: User
    }).subscribe((response: any) => {
      console.log(response);
      this.getLlamadas();
      if(response.updated == 1 ) 
      {
        Swal.fire(
          'Cita actualizada','',
          'success'
        )
      }
      else
      {
        Swal.fire(
          'La cita no fue actualizada','Por favor intente nuevamente.',
          'error'
        )
      }
    });
  }
  public desfiltrar()
  {
    this.fecha = '';
    this.Llamadas = this.LlamadasB;
  }
}
