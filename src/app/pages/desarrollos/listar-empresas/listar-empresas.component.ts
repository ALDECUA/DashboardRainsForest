import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.scss']
})
export class ListarEmpresasComponent implements OnInit {

  public empresas: any = [];

  private subscriptions: Subscription = new Subscription();

  public isLoading: boolean = false;

  public newEmpresa: string = "";

  constructor(
    public desarrollosServices: DesarrollosService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.desarrollosServices.getEmpresas().subscribe((res: any) => {
      this.empresas = res.empresas;
    }, (err) => {
      console.log(err);
    });
  }

  public guardar() {
    this.isLoading = true;
    this.subscriptions.add(
      this.desarrollosServices.createEmpresa({
        razonsocial: this.newEmpresa,
        usuario: 1
      }).subscribe((res: any) => {
        console.log(res);
        if (res.created) {
          this.empresas.unshift(res.data);
          this.toast.success('', 'Se guardo la empresa!', { timeOut: 2000 });
        }
        this.isLoading = false;
      }, (err) => {
        console.log(err);
        this.toast.error('', 'Error al guardar', { timeOut: 2000 });
        this.isLoading = false;
      })
    );
  }
}
