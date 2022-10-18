import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-editar-empresas',
  templateUrl: './editar-empresas.component.html',
  styleUrls: ['./editar-empresas.component.scss']
})
export class EditarEmpresasComponent implements OnInit, OnDestroy {

  public subscriptions = new Subscription();

  public empresa: any = {};

  public isLoading: boolean = false;

  constructor(
    public app: AppService,
    private desarrollosService: DesarrollosService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscriptions.add(this.activatedRouter.paramMap.subscribe((params: any) => {
      
      this.subscriptions.add(
        this.desarrollosService.getEmpresa(params.params.id).subscribe((res: any) => {
          console.log(res);
          if (res.empresa) {
            this.empresa = res.empresa;
          }
          this.isLoading = false;
        }, (err) => {
          console.log(err);
          this.isLoading = false;
        })
      );
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public guardarCambios() {
    this.isLoading = true;
    this.subscriptions.add(
      this.desarrollosService.updateEmpresa({
        id: this.empresa.IdEmpresaDes,
        razonsocial: this.empresa.RazonSocial,
        usuario: 1
      }).subscribe((res:any) => {
        
        if(res.updated) {
          this.toast.success('','Cambios guardados!', {timeOut:2000});
          this.router.navigateByUrl('/desarrollos');
        }
        this.isLoading = false;
      }, (err) => {
        console.log(err);
        this.toast.error('','Error al guardar', {timeOut:2000});
        this.isLoading = false;
      })
    );
  }
}
