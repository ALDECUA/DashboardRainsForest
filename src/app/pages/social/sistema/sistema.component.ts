import { Component, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ZapierService } from 'src/app/services/zapier.service';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.scss']
})
export class SistemaComponent implements OnInit {

  public listmenusistem:any = [];


  constructor(public app: AppService, private sistema: ZapierService) {
    this.app.currentModule = 'SOCIAL';
    this.app.currentSection = '- Configuración';
  }

  ngOnInit(): void {

    this.sistema.datamenus().subscribe((res:any) => {
      console.log(res);
    })
  }

  addelement(menu,opcion){
    this.sistema.disparadorForm.emit({
      menu: menu,
      opcion: opcion
    })

  }

}
