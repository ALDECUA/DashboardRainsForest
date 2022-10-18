import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { DesarrollosService } from './../../../services/desarrollos.service';

@Component({
  selector: 'app-editar-etapa',
  templateUrl: './editar-etapa.component.html',
  styleUrls: ['./editar-etapa.component.scss']
})
export class EditarEtapaComponent implements OnInit {

  public etapa: any = {};

  constructor(
    public app:AppService,
    private desarrollos:DesarrollosService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }

  public updateEtapaActual(){
    console.log(this.etapa);
  }

}
