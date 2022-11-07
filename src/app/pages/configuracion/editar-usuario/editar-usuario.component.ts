import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { UsuariosCrmService } from 'src/app/services/usuarios-crm.service';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
})
export class EditarUsuarioComponent implements OnInit {
  public persona: any = {};
  public id;
  private subscriptions = new Subscription();
  public label = 'El usuario permanecerá activo';
  public tipo_personas = null;
  public tipo_persona = null;
  public fech=null;
  public usuario=null;
  public tipousuarion=null;

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
      this.usuario =this.auth.user.Nombre;
    });
    this.subscriptions.add(
      this.CRMService.UsuarioPorId({ Id: this.id }).subscribe((res: any) => {
        this.persona = res.usuario[0];
        console.log(this.persona);
        this.tipousuarion=this.persona.IdPerfil;
        if (this.persona.IdStatus == 0) {
          this.label = 'El usuario quedará inactivo';
        }
      })
    );
    this.subscriptions.add(
      this.CRMService.ObtenerPerfiles({ Opcion: 0}).subscribe((res: any) => {
        this.tipo_personas = res.perfiles;
        console.log(res);
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
    this.subscriptions = this.CRMService.EditarUsuario({
      Id: this.id,
      Nombre: this.persona.Nombre,
      Apellido: this.persona.Apellidos,
      Correo: this.persona.Correo,
      Telefono: this.persona.Telefono,
      TipoUsuario: this.tipousuarion,
      fecha: this.actualizarfecha(),
      usr_add: this.usuario,
      Status: this.persona.IdStatus
    }).subscribe((res: any) => {
      if (res.Update == true) {
        Swal.fire(
          '¡Usuario actualizado!',
          'Los datos del usuario se han modificado con éxito',
          'success'
        );
      } else {
        Swal.fire(
          '¡El usuario no fue actualizado!',
          'Por favor intente nuevamente.',
          'error'
        );
      }
    });
  }
  public actualizarfecha()
  {
    this.fech=new Date().toISOString().slice(0, 19).replace('T', ' ');
    return this.fech;
  }
 
}
