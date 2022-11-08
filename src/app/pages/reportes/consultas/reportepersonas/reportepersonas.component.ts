import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-reportepersonas',
  templateUrl: './reportepersonas.component.html',
  styleUrls: ['./reportepersonas.component.scss']
})
export class ReportepersonasComponent implements OnInit {
  titulo: any;
  parques: any;
  id: any;

  constructor(public app: AppService,private activatedRouter: ActivatedRoute,public reportes: ReportesService) { }
  public reporte;
  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params: any) => {
      this.reporte = params.params.id;
    });
    this.reportes.obtenerparqueid( this.reporte).subscribe((res:any) => { 
      console.log(res[0].IdParque)
     this.id = res[0].IdParque
      this.parques = res
    })
  }
  Descarga() {

  }

}
