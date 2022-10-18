import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosCrmService } from 'src/app/services/usuarios-crm.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public perfiles: any[];
  public configDataTable = {
    fields: [
      {
        text: 'Nombre Perfil',
        value: 'Nombre',
        hasImage: false,
        pipe: null
      },
      {
        text: 'Estatus',
        value: 'Status',
        hasImage: false,
        pipe: null
      }
    ],
    editable: true,
    urlEdit: '/crm/configuracion/editarperfil/',
    idField: 'IdPerfil',
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
  public usuario;
  public newperfil;
  public fech;

  
  constructor(public app: AppService,
    private auth:AuthService,
    private CRMService: UsuariosCrmService) { }
    private subscriptions = new Subscription();
      
  ngOnInit(): void {
    this.app.currentModule = 'Configuracion';
    this.app.currentSection = '- Perfiles';
    this.usuario =this.auth.user.Nombre;
    this.subscriptions.add(
      this.CRMService.ObtenerPerfiles({ Opcion: 1}).subscribe((res: any) => {
        this.loading=false;
        this.perfiles= res.perfiles;        
        console.log(res);
      })
    );
  }
  public actualizarfecha()
  {
    this.fech=new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  public CrearPerfil()
  {
    this.subscriptions = this.CRMService.CrearPerfil({Perfil: this.newperfil,  fecha:this.fech, Usuario: this.usuario}).subscribe((res: any) => {
     console.log(res);
     this.perfiles.unshift(res.record);
      if(res.insert==true)
      {
        Swal.fire(
          'Perfil creado!',
          'Recuerda asignarle permisos desde el panel de perfiles',
          'success'
        )
      }
      else
      {
        Swal.fire(
          '¡El perfil no fue creado!',
          'Por favor intente nuevamente.',
          'error'
        )
      }
    });
  }
}