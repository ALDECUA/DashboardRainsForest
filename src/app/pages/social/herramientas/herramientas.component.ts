import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-herramientas',
  templateUrl: './herramientas.component.html',
  styleUrls: ['./herramientas.component.scss']
})
export class HerramientasComponent implements OnInit {

  id: number;
  campania: string = '';

  constructor(public app: AppService,) { }

  ngOnInit(): void {
  }

  editar(id: number, campania: string) {
    this.id = id;
    this.campania = campania;
  }
}
