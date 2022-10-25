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
  public modalA = null;
  public loading: boolean = false;
  public pwd: any = { uno: '', dos:''};
  public pedidos: any = [];
  constructor(
    private auth: AuthService,
    public app: AppService,
    private ngZone: NgZone,
    private toast: ToastrService,
   
    ) { 
      this.app.currentSection = 'Perfil';
    }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.modalA = new bootstrap.Modal(
      document.getElementById('cropperModal'),
      {}
    );
  }

  ngOnInit(): void {
    this.userData = this.auth.user;
  
    
  }

  public subirImagen(event) {

    fetch(event)
      .then((res) => res.blob())
      .then((file) => {
        let formData = new FormData();
        formData.append('foto', file, 'imagen.png');
        formData.append('IdPersona', this.auth.user.IdPersona);
        this.subscriptions.add(
          this.auth.cambiarFoto(formData).subscribe((res: any) => {
            this.userData.Foto_Perfil = res.Foto + '?' + new Date().getTime();
            console.log(res);
            this.auth.user.Foto_Perfil = res.Foto + '?' + new Date().getTime();
            this.modalA.hide();
            this.ngZone.run(() => {});
            this.userData.Foto_Perfil = res;


            this.auth.actualizar({IdPersona: this.auth.user.IdPersona, Foto: res}).subscribe((res:any)=>{
              if(!res.error ){
                this.toast.success("Se ha guardado la foto de perfil")
              }
            })

          })
        );
      });
  }
  CambiarPwd()
  {
      if(this.pwd.uno.length < 8)
      {
        this.toast.error('', 'La contraseña debe tener al menos 8 caracteres');
        return;
      }
      if(this.pwd.uno != this.pwd.dos)
      {
        this.toast.error('', 'Las contraseñas no coinciden');
        return;
      }
      this.loading = true;
      this.auth.PwdInversionista({IdUsuario: this.userData.IdPersona, Pwd: this.pwd.uno}).subscribe((res:any)=>
      {
        if(res.updated)
        {
          this.toast.success('', 'Contraseña actualizada con éxito');
          this.pwd.uno= '';
          this.pwd.dos= '';
          this.loading = false;
        }
      })
  }
  public subirPortada(files) {
    const file = files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    formdata.append("user", this.userData.IdPersona);

    this.auth.subirPortadaServidor(formdata).subscribe((res: any) => {
      if (res.result === true) {
        this.userData.Foto_Portada = res.nameimg;
        this.auth.updatePortada({
          IdPersona: this.userData.IdPersona,
          Foto: res.nameimg
        }).subscribe((resp: any) => {
        });
      }
    });
  }
}
