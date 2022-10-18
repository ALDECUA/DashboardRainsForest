import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public   Data:any = {};

  constructor(
    public app: AppService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userData = this.auth.user;
  }

  public cerrarSesion() {
    this.auth.logout();
    location.href = '/angularcrm/login';
  }
}
