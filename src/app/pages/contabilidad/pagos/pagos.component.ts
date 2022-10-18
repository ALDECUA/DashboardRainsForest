import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import { ToastrService } from 'ngx-toastr';
import { ContabilidadService } from 'src/app/services/contabilidad.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
})
export class PagosComponent implements OnInit {
  constructor(
    public app: AppService,
    public controlcalidad: ControlcalidadService,
    public contabilidad: ContabilidadService,
    private toast: ToastrService,
    private auth: AuthService,
    public controldecalidad: ControlcalidadService,
  ) {

    this.app.currentModule = 'Contabilidad';
    this.app.currentSection = ' - Control de pagos';
  }
 
  public registro = {
    Nombre: null,
    Nombre_S: '',
    Apellido_Pat: null,
    Apellido_Mat: '',
    Email: null,
    Num_Cel: null,
    Whats: null,
    asesor: null,
    Nacimiento: new Date(),
    Fecha: new Date(),
    SocioCom: null,
    IdLider: null,
  };
  public loading: boolean = true;
  public registros = { aceptados: [], pendientes: [] };
  public configDataTable: any = {
    fields: [
      {
        text: 'Nombre inversionista',
        value: 'Nombre',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Email',
        value: 'Email',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Telefono',
        value: 'Telefono',
        hasImage: false,
        pipe: null,
      }
    ],
    editable: false,
    show: true,
    urlEdit: '/crm/contabilidad/inversionistas/',
    urlShow: '/crm/contabilidad/inversionistas/',
    idField: 'IdPersona',
    fotoField: 'Foto_Perfil',
    filtroA: false,
  };

  ngOnInit(): void {
    this.GetInfo();
  }
  GetInfo() {
    this.controldecalidad.getRegistrosInversionistasPAGOS().subscribe((res: any) => {

          this.registros.aceptados = res
          this.loading = false;
    });
  }
}
