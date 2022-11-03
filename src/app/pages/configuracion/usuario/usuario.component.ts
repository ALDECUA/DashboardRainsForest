import {
  DatePipe,
  getLocaleDateFormat,
  getLocaleTimeFormat,
} from '@angular/common';
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosCrmService } from 'src/app/services/usuarios-crm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  public tipo_personas: any[];
  public personas: any = [];
  public usuario = null;
  private subscriptions = new Subscription();
  public fecha = null;
  public fech = null;
  public newusuario = null;
  public newapellido = null;
  public newcorreo = null;
  public id_newperfil = null;
  public newtelefono = null;
  public configDataTable = {
    fields: [
      {
        text: 'Nombre colaborador',
        value: 'Nombre',
        hasImage: true,
        pipe: null,
      },
      {
        text: 'Perfil',
        value: 'Perfil',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Email',
        value: 'Correo',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Estatus',
        value: 'Status',
        hasImage: false,
        pipe: null,
      },
    ],
    editable: true,
    urlMedia: this.app.dominio+'api/storage/usuarios/perfiles/',
    idField: 'IdUsuario',
    urlEdit: '/crm/configuracion/editarusuario/',
    fotoField: 'Foto_Perfil',
    filtroA:{
      data: [
        {
          value: "Inactivo",
          texto: 'Inactivos'
        },
        {
          value: "Activo",
          texto: 'Activos'
        }
      ],
      fieldFilter: 'Status'
    }
  };

  public loading: boolean = true;

  constructor(
    public app: AppService,
    private auth: AuthService,
    private CRMService: UsuariosCrmService,
    private toast: ToastrService
  ) {
    this.app.currentModule = 'Configuracion';
    this.app.currentSection = '- Usuarios';
    this.usuario = this.auth.user.Nombre;
  }

  ngOnInit(): void {
    this.listarUsuarios();
    this.subscriptions.add(
      this.CRMService.ObtenerPerfiles({ Opcion: 0}).subscribe((res: any) => {
        
        this.tipo_personas = res.perfiles;
        console.log(this.tipo_personas);
        this.loading = false;
      })
    );
  }
  public actualizarfecha() {
    this.fecha = Date.now();
    this.fech = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  public CrearUsuario() {
    if (this.newusuario == null) {
      this.toast.warning('', 'El nombre es obligatorio');
      return;
    }
    if (this.newapellido == null) {
      this.toast.warning('', 'El apellido es obligatorio');
      return;
    }
    if (this.newcorreo == null) {
      this.toast.warning('', 'El correo electronico es obligatorio');
      return;
    }
    if (this.newtelefono == null) {
      this.toast.warning('', 'El numero de telefono es obligatorio');
      return;
    }

    this.subscriptions = this.CRMService.crearPerfiles({
      Nombre: this.newusuario,
      Apellido: this.newapellido,
      Correo: this.newcorreo,
      Telefono: this.newtelefono,
      TipoUsuario: this.id_newperfil,
      fecha: this.fech,
      usr_add: this.usuario,
    }).subscribe((res: any) => {
      console.log(res);
      if (res.insert == true) {
        this.personas.unshift(res.record);
        Swal.fire(
          '¡Usuario creado!',
          'Se ha enviado un mensaje al correo señalado con sus credenciales',
          'success'
        );
      } else {
        Swal.fire(
          '¡El usuario no fue creado!',
          'Por favor intente nuevamente.',
          'error'
        );
      }
    });
    
  }
  public listarUsuarios()
  {
    this.subscriptions.add(
      this.CRMService.listarPerfiles().subscribe((res: any) => {
        console.log(res);
        this.personas = res.usuarios;
        this.loading = false;
      })
    );
  }
  public change()
  {
    console.log(this.id_newperfil);
  }
}