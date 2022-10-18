import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-editar-contratos',
  templateUrl: './editar-contratos.component.html',
  styleUrls: ['./editar-contratos.component.scss']
})
export class EditarContratosComponent implements OnInit {

  constructor(
    public app:AppService
  ) { }

  ngOnInit(): void {
  }

}
