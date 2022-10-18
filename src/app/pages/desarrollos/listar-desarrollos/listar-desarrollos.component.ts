import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-listar-desarrollos',
  templateUrl: './listar-desarrollos.component.html',
  styleUrls: ['./listar-desarrollos.component.scss']
})
export class ListarDesarrollosComponent implements OnInit {

  public desarrollos: any = [];

  private subscriptions: Subscription = new Subscription();

  public isLoading: boolean = false;

  public newEmpresa: string = "";

  constructor(
    public desarrollosServices: DesarrollosService,
    public app: AppService
  ) { }

  ngOnInit(): void {
    this.desarrollosServices.getDesarrollos(1).subscribe((res: any) => {
      console.log(res);
      this.desarrollos = res.desarrollos;
    }, (err) => {
      console.log(err);
    });
  }

}
