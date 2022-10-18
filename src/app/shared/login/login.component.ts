import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginData = {
    Correo: null,
    Pwd: null
  };

  public subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private router: Router, 
    private toast:ToastrService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  public login() {
    console.log(this.loginData);

    if (this.loginData.Correo === null) {
      return;
    }

    if (this.loginData.Pwd === null) {
      return;
    }

    this.subscription.add(
      this.auth.login(this.loginData).subscribe((res: any) => {

        console.log(res);
        if (res.token) { 
          this.auth.user = res.persona;
          this.auth.logged = true;
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('user_data', JSON.stringify(res.persona));
          /* this.auth.permisos = JSON.parse(res.persona.permisos);
          this.auth.generateMenus(); */
          this.router.navigateByUrl('/');
        } else {
          this.toast.error('Verifica tus datos','Acceso denegado', { timeOut: 3000});
        }

      }, (err) => {
        console.log(err);
      })
    );
  }
}
