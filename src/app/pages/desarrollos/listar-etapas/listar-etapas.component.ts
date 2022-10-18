import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-listar-etapas',
  templateUrl: './listar-etapas.component.html',
  styleUrls: ['./listar-etapas.component.scss']
})
export class ListarEtapasComponent implements OnInit {

  public etapas: any = [];

  private subscriptions: Subscription = new Subscription();

  public isLoading: boolean = false;

  public newEmpresa: string = "";

  constructor(
    public desarrollosServices: DesarrollosService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.desarrollosServices.getEtapas().subscribe((res: any) => {
      console.log(res);
      this.etapas = res.fases;
    }, (err) => {
      console.log(err);
    });
  }

}
