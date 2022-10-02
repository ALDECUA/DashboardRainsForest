import { Component } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ranking';
  loading: boolean=true;
  top: any;
  public Titulos:any ={
    Asesores:'Asesores',
    InversionistaLider:'Promotores',
    SocioComercial:'Socio Comercial',
  };
  
  constructor(public app: AppService){
  }
  ngOnInit(): void {
    this.getdocumentos() 
  }
  getdocumentos() {

     this.loading = true;
    this.app.getDocuementos().subscribe((res: any) => {

      this.top = res.TopAsesores;
    });

  }
}
