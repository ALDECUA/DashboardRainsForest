import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture } from '@angular/core/testing';
import { AppService } from 'src/app/services/app.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-desarrollos',
  templateUrl: './editar-desarrollos.component.html',
  styleUrls: ['./editar-desarrollos.component.scss']
})
export class EditarDesarrollosComponent implements OnInit {

  public desarrollo: any = {};

  public empresas: any[] = [];
  public machotes: any[] = [];

  constructor(
    public app: AppService,
    private desarrollos: DesarrollosService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: any) => {
      const id = params.params.id;
      this.desarrollos.getDesarrollo(id).subscribe((res: any) => {
        if (!res.error) {
          this.desarrollo = res.desarrollos[0];
          this.machotes = JSON.parse(this.desarrollo.Machotes);
          this.empresas = JSON.parse(this.desarrollo.Empresas);
          console.log(this.desarrollo);
        } else {
        }
      });
    })

  }

  public updateDesarrolloActual() {

    this.desarrollos.actualizarDesarrollo(this.desarrollo).subscribe((res: any) => {
      console.log(res);
      if (res.updated === true) {
        this.toast.success('', 'Desarrollo actualizado correctamente', { timeOut: 3000 });
      }
    });

  }

}
