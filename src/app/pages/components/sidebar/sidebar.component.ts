import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public renderMenus = [];
  constructor(
    public app: AppService,
    public router: Router,
    private auth: AuthService
  ) { }
  public usuario;
  ngOnInit(): void {
    this.usuario= this.auth.user;
    this.renderMenus = this.auth.menus;
  }


}
