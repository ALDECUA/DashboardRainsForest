import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit, OnDestroy, AfterViewInit {
  public userData: any = {};

  public subscriptions = new Subscription();

  public loading: boolean = false;

  public modalA = null;
  public pwd;
  public npwd;
  public npwd1;

  constructor(
    public app: AppService,
    private auth: AuthService,
    private ngZone: NgZone,
    private toast: ToastrService
  ) {
    this.app.currentModule = 'Usuario';
    this.app.currentSection = '- Perfil';
  }

  ngOnInit(): void {
    this.userData = this.auth.user;
    console.log(this.userData);
  }

  ngAfterViewInit(): void {
    this.modalA = new bootstrap.Modal(
      document.getElementById('cropperModal'),
      {}
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public subirImagen(event) {
    console.log(event);
    this.loading = true;
    fetch(event)
      .then((res) => res.blob())
      .then((file) => {
        let formData = new FormData();
        formData.append('foto', file, 'imagen.png');
        formData.append('IdUsuario', this.auth.user.IdUsuario);
        console.log(this.auth.user.IdUsuario);
        this.subscriptions.add(
          this.auth.cambiarFoto(formData).subscribe((res: any) => {
            this.userData.Foto_Perfil = res.Foto + '?' + new Date().getTime();
            console.log(this.userData);
            this.auth.user.Foto_Perfil = res.Foto + '?' + new Date().getTime();
            this.loading = false;
            this.modalA.hide();
            this.ngZone.run(() => {});
          })
        );
      });
  }

  public cambiarpwd() {
    if (this.pwd == null) {
      this.toast.warning('', 'La contraseña actual es obligatoria');
      return;
    }
    if (this.npwd == null) {
      this.toast.warning('', 'La nueva contraseña es obligatoria');
      return;
    }
    if (this.npwd != this.npwd1) {
      this.toast.warning('', 'Las contraseñas no coinciden');
      return;
    }
    if (this.npwd.length < 8) {
      this.toast.warning('', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.subscriptions.add(
      this.auth
        .CambiarPwd({
          IdUsuario: this.auth.user.IdUsuario,
          Pwd: this.pwd,
          NPwd: this.npwd,
        })
        .subscribe((res: any) => {
          if (res.updated == true) {
            Swal.fire(
              '¡Contraseña actualizada!',
              'Recuerde este cambio cuando inicie sesión',
              'success'
            );
            this.pwd = null;
            this.npwd = null;
            this.npwd1 = null;
          } else {
            Swal.fire(
              '¡La contraseña no fue actualizada!',
              'Por favor intente nuevamente.',
              'error'
            );
          }
        })
    );
  }
}
