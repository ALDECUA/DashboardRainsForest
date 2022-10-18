import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-listar-lotes',
  templateUrl: './listar-lotes.component.html',
  styleUrls: ['./listar-lotes.component.scss']
})
export class ListarLotesComponent implements OnInit {

  public lotes: any = [];

  private subscriptions: Subscription = new Subscription();

  public isLoading: boolean = false;

  public newEmpresa: string = "";

  constructor(
    public desarrollosServices: DesarrollosService,
    public app: AppService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.desarrollosServices.getLotes().subscribe((res: any) => {
        console.log(res);
        this.lotes = res.lotes;
      }, (err) => {
        console.log(err);
      })
    );
  }

}
