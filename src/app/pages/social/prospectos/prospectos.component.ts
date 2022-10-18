import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { ZapierService } from 'src/app/services/zapier.service';

@Component({
  selector: 'app-prospectos',
  templateUrl: './prospectos.component.html',
  styleUrls: ['./prospectos.component.scss']
})
export class ProspectosComponent implements OnInit {

  private subscriptions = new Subscription();
  public listarprospectos: any = [];
  public Prospectos: any = [];
  public Origen:any;
  public plataforma: string;
  public contador: number = 1;
  public formn:any;

  constructor(
    public app: AppService,
    public zap: ZapierService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.zap.listarProspectos().subscribe((res:any) => {
        this.listarprospectos = res;
       
        this.Prospectos = JSON.parse(this.listarprospectos[0].ZAP);
       // console.log(this.Prospectos);
      })
    );
  }

  seguimiento(item){
    this.zap.disparadorFormModal.emit({
      data:item
    })
    

  }


}
