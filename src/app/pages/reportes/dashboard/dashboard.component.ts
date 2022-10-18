import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public app: AppService) { 
    this.app.currentModule = 'Reportes';
    this.app.currentSection = ' -Dashboard ';
  }

  ngOnInit(): void {
    let boton = document.getElementById('Cerrar');
    boton.click(); 
    let botondos = document.getElementById('Cerrardos');
    botondos.click(); 
    console.log('entro')
  }
}
