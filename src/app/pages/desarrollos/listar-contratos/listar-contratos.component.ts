import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-listar-contratos',
  templateUrl: './listar-contratos.component.html',
  styleUrls: ['./listar-contratos.component.scss']
})
export class ListarContratosComponent implements OnInit {

  public contratos: any = [];

  private subscriptions: Subscription = new Subscription();

  public isLoading: boolean = false;

  public newEmpresa: string = "";

  constructor(
    public desarrollosServices: DesarrollosService,
    public app: AppService
  ) { }

  ngOnInit(): void {
    this.desarrollosServices.getContratos().subscribe((res: any) => {
      console.log(res);
      this.contratos = res.contratos;
    }, (err) => {
      console.log(err);
    });
  }

}
