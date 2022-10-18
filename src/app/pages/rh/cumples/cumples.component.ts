import { Component, Injectable, OnInit } from '@angular/core';
import { data } from 'jquery';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { RhService } from 'src/app/services/rh.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


const EXCEL_TYPE = 'application/vnd.openxmlformats- officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-cumples',
  templateUrl: './cumples.component.html',
  styleUrls: ['./cumples.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class CumplesComponent implements OnInit {
  public vista: number = 1;
  public subscription: Subscription;
  public personas: any[] = [];
  public backupPersonas: any[] = [];
  public searched: string = '';
  public mes: string = '0';
  public contador: number = 0;
  public loading: boolean = false;
  public personasExcel: any[] = [];

  constructor(
    public app: AppService,
    private rhService: RhService
  ) {
    this.app.currentModule = 'RH';
    this.app.currentSection = '- Cumpleaños';
    let curmonth = '' + (new Date().getMonth() + 1);
    this.mes = curmonth.length > 1 ? curmonth : '0' + curmonth;
  }

  ngOnInit(): void {
    this.loading = true;
    this.subscription = this.rhService.obtenerCumpleanios().subscribe((res: any) => {
      console.log(res);
      this.personas = res.personas;
      this.backupPersonas = res.personas;
      this.filtrarPersona();
      this.loading = false;
    });
  }

  public cambiarvista(x) {

    this.vista = x;
  }

  public filtrarPersona() {

    const word = this.searched.toLocaleLowerCase();
    this.personas = this.backupPersonas;
    const month = this.mes;
    let fecha = '';
    this.contador = 0;
    let str = '';
    this.personas = this.backupPersonas.filter((elem) => {
      str = '';
      fecha = '';
      ['Nombre_Completo', 'Email'].forEach((field) => {
        str += elem[field] + '';
      });
      ['Mes'].forEach((field) => {
        fecha += elem[field] + '';
      });
      if (str.toLocaleLowerCase().includes(word) && fecha.includes(month)) {
        this.contador++;
        return true;
      } else {
        return false;
      }
    })
    console.log(this.personas);
  }
  public filtros() {
    this.subscription = this.rhService.obtenerCumpleaniosFiltrados({ Mes: this.mes, Nombre: this.searched }).subscribe((res: any) => {
      return
    });
  }
  public exportAsExcelFile(): void {
    this.personasExcel= [];
    for(let i=0; i<this.personas.length; i++)
    {
      this.personasExcel.push({
      Nombre_Completo : this.personas[i].Nombre + ' ' +this.personas[i].Nombre_S + ' '+ this.personas[i].Apellido_P + ' ' + this.personas[i].Apellido_M,
      Email : this.personas[i].Email,
      Fch_Nacimiento : this.personas[i].Fch_Nacimiento
      });
    }
    
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.personasExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'Cumples': worksheet }, 
SheetNames: ['Cumples'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' 
});
    this.saveAsExcelFile(excelBuffer, this.mes); 
}
private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_Cumples' + 
EXCEL_EXTENSION);
  }
}
