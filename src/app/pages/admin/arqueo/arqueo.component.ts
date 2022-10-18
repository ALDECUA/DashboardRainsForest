import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-arqueo',
  templateUrl: './arqueo.component.html',
  styleUrls: ['./arqueo.component.scss'],
})
export class ArqueoComponent implements OnInit {
  constructor(public app: AppService) {}
  public arqueo: any = {
    FondoInicial: 0,
    SaldoActual: 15000,
    Desgloce: {
      D1000: 0,
      D500: 0,
      D200: 0,
      D100: 0,
      D50: 0,
      D201: 0,
      D20: 0,
      D10: 0,
      D5: 0,
      D2: 0,
      D1: 0,
      centavos: 0,
    },
  };
  public denominaciones = [1000, 500, 200, 100, 50, 20, 20, 10, 5, 2, 1, 0.5];
  ngOnInit(): void {
    let hoy = new Date().toISOString().substring(0, 10);
    console.log(hoy);
    this.calcular();
  }
  public humanizeNumber(n) {
    n = n.toString();
    while (true) {
      var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');
      if (n == n2) break;
      n = n2;
    }
    return n;
  }
  public calcular() {
    let i = 0;
    let total = 0;
    for (var key in this.arqueo.Desgloce) {
      total += this.arqueo.Desgloce[key] * this.denominaciones[i];
      i++;
    }
    return total;
  }
}
