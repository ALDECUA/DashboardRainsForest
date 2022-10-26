import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public userData:any ={};

  constructor(
    public app: AppService,
    private auth: AuthService
  ) {
    this.app.currentModule = 'Inicio';
    this.app.currentSection = '';
   }

  ngOnInit(): void {
    this.userData = this.auth.user;
  }

}
