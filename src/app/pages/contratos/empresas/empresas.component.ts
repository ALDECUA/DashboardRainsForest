import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  public empresas: any[] = [];

  public saving: boolean = false;

  public isLoading: boolean = false;

  constructor(
    public app: AppService,
    private desarrollos: DesarrollosService,
    private auth: AuthService,
    private toast: ToastrService
  ) {
    this.app.currentModule = 'Contratos';
    this.app.currentSection = '- Empresas';
  }


  ngOnInit(): void {

    this.isLoading = true;

    this.desarrollos.getEmpresas().toPromise().then((res: any) => {
      if (res.unauthorized) {
        alert("Su sesión no es valida, posiblemente haya caducado");
        this.auth.logout();
      }
      console.log(res);
      if (!res.error) {
        this.empresas = res.empresas;
        this.isLoading = false;
      }

    })
  }

  public editarEmpresa(empresa) {
    this.saving = true;
    this.desarrollos.updateEmpresa(empresa).subscribe((res: any) => {
      if (res.updated) {
        this.toast.success('', 'Cambios guardados!', { timeOut: 2000 });
      }
      this.saving = false;
    });
  }

  public pushEmpresa(event) {
    this.empresas.push(event);
  }
}
