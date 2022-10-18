import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { UsuariosCrmService } from 'src/app/services/usuarios-crm.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar-perfiles',
  templateUrl: './editar-perfiles.component.html',
  styleUrls: ['./editar-perfiles.component.scss'],
})
export class EditarPerfilesComponent implements OnInit {
  public persona: any = {};
  public id;
  private subscriptions = new Subscription();
  public label = 'El usuario permanecerá activo';
  public tipo_personas = null;
  public tipo_persona = null;
  public fech = null;
  public usuario = null;
  public menus: any[];
  public menusid: any[];
  public flag = false;
  public numero = 1;
  public x: any[];
  constructor(
    public app: AppService,
    private auth: AuthService,
    private CRMService: UsuariosCrmService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: any) => {
      const id = params.params.id;
      console.log(id);
      this.id = id;
      this.usuario = this.auth.user.Nombre;
      //este primero
      this.Desactivar();
      //este segundo
    });
  }
  public Desactivar() {
    this.subscriptions.add(
      this.CRMService.PerfilPorId({ Id: this.id }).subscribe((res: any) => {
        this.persona = res.usuario;
        if (this.persona.IdStatus == 0) {
          this.label = 'El usuario quedará inactivo';
        }
        this.listarmenusid();
      })
    );
    //Este es el primer paso
    //Este es el segundo paso
  }
  public listarmenusid() {
    this.subscriptions.add(
      this.CRMService.ListarMenusId({ Id: this.id }).subscribe((res: any) => {
        this.menusid = res.Menus;
        console.log(this.menusid);
        this.recorrer();
      })
    );
  }
  public recorrer() {
    this.subscriptions.add(
      this.CRMService.ListarMenus().subscribe((res: any) => {
        this.menus = res.Menus;
        console.log(this.menus);
        for (let x = 0; x < this.menus.length; x++) {
          this.menus[x].Leer = 0;
          this.menus[x].Editar = 0;
          this.menus[x].Eliminar = 0;
          let menu = this.menus[x];
          for (let y = 0; y < this.menusid.length; y++) {
            let menuid = this.menusid[y];
            if (menuid.IdMenu == menu.IdMenu) {
              this.menus[x].Leer = menuid.Leer;
              this.menus[x].Editar = menuid.Editar;
              this.menus[x].Eliminar = menuid.Eliminar;
              break;
            }
          }
        }
        console.log(this.menus);
      })
    );
  }
  public status() {
    if (this.persona.IdStatus == true) {
      this.persona.IdStatus = 1;
      this.label = 'El usuario permanecerá activo';
    } else if (this.persona.IdStatus == false) {
      this.label = 'El usuario quedará inactivo';
      this.persona.IdStatus = 0;
    }
  }
  public ActualizarUsuario() {
    this.subscriptions = this.CRMService.EditarPerfil({
      Id: this.id,
      Nombre: this.persona.Nombre,
      Fecha: this.actualizarfecha(),
      Usuario: this.usuario,
      IdStatus: this.persona.IdStatus,
    }).subscribe((res: any) => {
      console.log(res);
      if (res.Update == true) {
        Swal.fire(
          '¡Perfil actualizado!',
          'La informacion básica del perfil ha sido modificada.',
          'success'
        );
      } else {
        Swal.fire(
          '¡El perfil no fue actualizado!',
          'Por favor intente nuevamente.',
          'error'
        );
      }
    });
  }
  public actualizarfecha() {
    this.fech = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return this.fech;
  }
  public Editar(index) {
    if (this.menus[index].Editar == 1) {
      this.menus[index].Editar = 0;
    } else {
      if (this.menus[index].Leer == 0) {
        this.menus[index].Leer = 1;
      }
      this.menus[index].Editar = 1;
    }
    this.actualizarPermisos(index);
  }
  public Leer(index) {
    console.log(this.menus[index].Leer);
    if (this.menus[index].Leer == 1) {
      this.menus[index].Leer = 0;
      console.log(this.menus[index]);
      this.menus[index].Editar = 0;
      this.menus[index].Eliminar = 0;
    } else {
      this.menus[index].Leer = 1;
    }
    this.actualizarPermisos(index);
  }
  public Eliminar(index) {
    console.log(this.menus[index].Eliminar);
    if (this.menus[index].Eliminar == 1) {
      this.menus[index].Eliminar = 0;
      console.log(this.menus[index]);
    } else {
      if (this.menus[index].Leer == 0) {
        this.menus[index].Leer = 1;
      }
      this.menus[index].Eliminar = 1;
    }
    this.actualizarPermisos(index);
  }
  public actualizarPermisos(IdMenu) {
    console.log(this.menus[IdMenu]);
    console.log(this.id);
    this.subscriptions = this.CRMService.EditarPermisos({
      IdPerfil: this.id,
      IdMenu: this.menus[IdMenu].IdMenu,
      Leer: this.menus[IdMenu].Leer,
      Editar: this.menus[IdMenu].Editar,
      Eliminar: this.menus[IdMenu].Eliminar,
    }).subscribe((res: any) => {
      console.log(res);
    });
  }
}
