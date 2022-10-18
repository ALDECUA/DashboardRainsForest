import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visualizar-cuenta',
  templateUrl: './visualizar-cuenta.component.html',
  styleUrls: ['./visualizar-cuenta.component.scss']
})
export class VisualizarCuentaComponent implements OnInit {

  public cuenta: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
