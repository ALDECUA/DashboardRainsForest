import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { RhService } from 'src/app/services/rh.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats- officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-reclutamiento',
  templateUrl: './reclutamiento.component.html',
  styleUrls: ['./reclutamiento.component.scss'],
})
export class ReclutamientoComponent implements OnInit {
  public personas: any = [];
  private subscriptions = new Subscription();
  public excel = {activos:[],baja:[],proceso:[]}

  public configDataTable = {
    fields: [
      {
        text: 'Nombre colaborador',
        value: 'Nombre_Colaborador',
        hasImage: true,
        pipe: null,
      },
      {
        text: 'Nivel',
        value: 'Nivel',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Fecha de solicitud',
        value: 'Fecha',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Estatus',
        value: 'Status',
        hasImage: false,
        pipe: null,
      },
    ],
    editable: true,
    urlEdit: '/crm/rh/editarusuario/',
    urlMedia: this.app.dominio+'newDesign/assets/images/imgPerfil/',
    idField: 'IdPersona',
    fotoField: 'Foto_Perfil',
    filtroA: {
      data: [
        {
          value: 'Activo',
          texto: 'Activo',
        },
        {
          value: 'Revisado',
          texto: 'Revisado',
        },
        {
          value: 'Proceso',
          texto: 'En Proceso',
        },
        {
          value: 'Desactivado',
          texto: 'Desactivado',
        },
        {
          value: 'Baja',
          texto: 'Dado de baja',
        },
      ],
      fieldFilter: 'Status',
    },
  };

  public loading: boolean = true;

  constructor(public app: AppService, private rhService: RhService) {
    this.app.currentModule = 'RH';
    this.app.currentSection = '- Reclutamiento';
  }
  public registros = { activos: '', baja: '', proceso: '',fecha:new Date().toLocaleDateString() };

  ngOnInit(): void {
    this.subscriptions.add(
      this.rhService.getPersonasReclutamiento().subscribe((res: any) => {
        this.loading = false;
        this.personas = res.personas;
     
      })
    );
  }
  
  cargar() {
    for (let i = 0; i < this.personas.length; i++) {
      if (+this.personas[i].EstatusGeneral == 1) {
        this.registros.activos +=
          `
        <tr>
            <td>` +
          this.personas[i].Nombre_Colaborador +
          `</td>
            <td>` +
          this.personas[i].Nivel +
          `</td>
            <td>` +
          this.personas[i].Fecha +
          `</td>
        </tr>`;
      }
      if (+this.personas[i].EstatusGeneral == 6) {
        this.registros.baja +=
          `
        <tr>
            <td>` +
          this.personas[i].Nombre_Colaborador +
          `</td>
            <td>` +
          this.personas[i].Nivel +
          `</td>
            <td>
          ${this.personas[i].Fecha}
          </td>
        </tr>`;
      }
      if (this.personas[i].EstatusGeneral == 2) {
        this.registros.proceso +=
          `
        <tr>
            <td>` +
          this.personas[i].Nombre_Colaborador +
          `</td>
            <td>` +
          this.personas[i].Nivel +
          `</td>
            <td>` +
          this.personas[i].Fecha +
          `</td>
        </tr>`;
      }
    }
  }
  imprimir()
  {
    this.cargar();
    this.rhService.ReporteGeneral(this.registros).subscribe((res: any) => {
      var blob=new Blob([res]);
      var link=document.createElement('a');
      link.href=window.URL.createObjectURL(blob);
     link.download="reporte.pdf";
      link.click(); 
    });
  }
  public exportAsExcelFile(): void {
    console.log("Generando excel");
    this.excel= {activos:[],baja:[],proceso:[]}
    for(let i=0; i<this.personas.length; i++)
    {
      if (+this.personas[i].EstatusGeneral == 1) {
        this.excel.activos.push({
          Nombre_Completo : this.personas[i].Nombre_Colaborador,
          Nivel : this.personas[i].Nivel,
          FechaIngreso : this.personas[i].Fecha
          });
      }
      if (+this.personas[i].EstatusGeneral == 6) {
        this.excel.baja.push({
          Nombre_Completo : this.personas[i].Nombre_Colaborador,
          Nivel : this.personas[i].Nivel,
          FechaIngreso : this.personas[i].Fecha
          });
      }
      if (this.personas[i].EstatusGeneral == 2) {
        this.excel.proceso.push({
          Nombre_Completo : this.personas[i].Nombre_Colaborador,
          Nivel : this.personas[i].Nivel,
          FechaIngreso : this.personas[i].Fecha
          });
      }
    }
    
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excel.activos);
     const baja: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excel.baja);
     const proceso: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excel.proceso);
    const workbook: XLSX.WorkBook = { Sheets: { 'Activos': worksheet,'Proceso':proceso,'Baja':baja }, 
SheetNames: ['Activos','Proceso','Baja'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' 
});
    this.saveAsExcelFile(excelBuffer); 
}
private saveAsExcelFile(buffer: any): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data,  'Reporte' + 
EXCEL_EXTENSION);
  }
}
