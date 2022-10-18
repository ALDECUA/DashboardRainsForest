import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { DatePipe } from '@angular/common';
import { ContabilidadService } from 'src/app/services/contabilidad.service';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.scss'],
})
export class ComisionesComponent implements OnInit {
  constructor(
    public app: AppService,
    public datepipe: DatePipe,
    public contabilidad: ContabilidadService
  ) {}
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  public hrs=[];
  public personas = [];
  public fechas: any = {  };
  public buscar = '';
  public busqueda =0;
  public loading = false;
  public backupPersonas=[];

  ngOnInit(): void {
    this.contabilidad
      .getComisiones(this.fechas)
      .subscribe((res: any) => {
        this.personas = res.personas;
      });
  }
  dateRangeChange() {
    this.buscar="";
    this.busqueda++;
    if (this.dateRange.value.end && this.dateRange.value.start) {
      this.loading = true;
      this.fechas.FechaInicio = this.datepipe.transform(
        this.dateRange.value.start,
        'yyyy-MM-dd'
      );
      this.fechas.FechaFin = this.datepipe.transform(
        this.dateRange.value.end,
        'yyyy-MM-dd'
      );
      this.contabilidad.getComisiones(this.fechas).subscribe((res: any) => {
       
        if(!res.error)
        {

                  this.backupPersonas = res.personas;
                  this.filtrarPersona();
                  this.loading = false;
        }

      });
    }
  }
  detalles(persona) {
  
    if(persona.ver)
    {
      persona.ver=false;
      setTimeout(() => {
        this.hrs=[];
      }, 1000);
      
      return
    }
    for(let i=0; i<this.personas.length; i++)
    {
      this.personas[i].ver = false;
    }
    this.fechas.IdPersona = persona.IdPersona;
    
     this.contabilidad.Comisiones(this.fechas).subscribe((res: any) => {
      if(!res.error)
      {
        this.hrs = res.hrs;
        persona.ver=true;
      }
    }); 
  }
  public filtrarPersona() {

    const word = this.buscar.toLocaleLowerCase();
    this.personas = this.backupPersonas;
    let str;
    this.personas = this.backupPersonas.filter((elem) => {
      str = '';
      ['Nombre_Colaborador'].forEach((field) => {
        str += elem[field] + '';
      });
      if (str.toLocaleLowerCase().includes(word)) {
        return true;
      } else {
        return false;
      }
    })
  }
}
