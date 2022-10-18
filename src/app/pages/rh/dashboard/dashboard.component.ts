import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { RhService } from 'src/app/services/rh.service';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
//import * as chart from 'chart.js';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChartElem: ElementRef;
  @ViewChild('customersChart') customersChart: ElementRef;
  @ViewChild('revenueChart') revenueChart: ElementRef;
  @ViewChild('chartlastuser') chartlastuser: ElementRef;

  public barChart: any;
  public lineChart: any;
  donutCHart: any;
  contadorPersonas: any = {
    sc: 0,
    il: 0,
    is: 0,
    ij: 0,
    total: 0,
    ac: 0,
    rv: 0,
    dc: 0,
  };
  /* botones para la primera grafica de lotes vendidos */
  public reclutas: any = [];
  data = [
    { name: 'ABC', Value: '100' },
    { name: 'XYZ', Value: '25' },
    { name: 'QWE', Value: '75' },
  ];

  /*  */
  public userRegistrados: any = [];
  totalesActivos = [];
  meses = [];
  anio = [];
  public dataChart;
  public socios: any = [];
  /*  */

  TotalVendidosGeneral: any = {};
  public loading: boolean = false;

  ultimosRegistros: any[] = [];
  public InfoVentaLoteXDes: any;
  private subscriptions = new Subscription();

  constructor(
    public app: AppService,
    private rhService: RhService,
    private el: ElementRef
  ) {
    this.app.currentModule = 'RH';
    this.app.currentSection = '- Dashboard';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    /* loaders */
    this.loading = true;
    this.rhService
      .dashboardTotalPersonas()
      .then((res) => res.json())
      .then((data) => {
        this.contadorPersonas = {
          sc: data.data.SociosComerciales,
          il: data.data.InversionistasLider,
          is: data.data.InversionistasSenior,
          ij: data.data.InversionistasJunior,
          total: data.data.PersonasTotal,
          ac: data.data.ActivosTotal,
          rv: data.data.RevisadosTotal,
          dc: data.data.DesactivadorTotal,
        };

        setTimeout(() => {
          this.initCharts();
        }, 1000);
        this.loading = false;
      });

    this.rhService
      .dashboardUltimasPersonas()
      .then((res) => res.json())
      .then((data) => {
        this.ultimosRegistros = data.data;
      });

    this.rhService.GetObtenerReclutas().subscribe((res: any) => {
      console.log(res);
      this.userRegistrados = res.data;
      this.socios = res.socios;
      /* this.userRegistrados.forEach(element => {
        
        var currentTime = new Date();
        var year = currentTime.getFullYear()

        if (element.Anio === year) {
          this.meses.push(this.convertMes(element.Mes));
          this.totalesActivos.push(element.CantidadActivos);
        }

        this.totalesActivos.push(element.CantidadActivos);
        this.anio.push(element.Anio);

      }); */

      this.userRegistrados.forEach((element) => {
        var currentTime = new Date();
        var year = currentTime.getFullYear();

        if (element.Anio == year) {
          console.log(element);
          this.meses.push(this.convertMes(element.Mes));
          this.totalesActivos.push(element.CantidadActivos);
          this.anio.push(element.Anio);
        }
      });

      const labels = this.meses;
      this.dataChart = {
        labels: labels,
        datasets: [
          {
            label: 'Activos',
            data: this.totalesActivos,
            borderColor: ['#05c9a7'],
            backgroundColor: ['#05c9a7'],
          },
        ],
      };
      console.log(this.dataChart);
    });

    console.log('Buscar socios comerciales');
  }

  ngAfterViewInit(): void {
    //this.initCharts();
  }

  public veranio(event) {
    console.log(event.target.value);

    if (!!document.getElementsByClassName('is-active') == true) {
      console.log('activo');
    } else {
      console.log('desactivado');
    }

    let btnanio = document.getElementById(event.target.value);
    btnanio.classList.add('is-active');

    /*  btnanio.classList.add('active'); */

    this.meses = [];
    this.totalesActivos = [];
    this.anio = [];

    this.userRegistrados.forEach((element) => {
      if (element.Anio == event.target.value) {
        console.log(element);
        this.meses.push(this.convertMes(element.Mes));
        this.totalesActivos.push(element.CantidadActivos);
        this.anio.push(element.Anio);
      }
    });

    const labels = this.meses;
    this.dataChart = {
      labels: labels,
      datasets: [
        {
          label: 'Activos',
          data: this.totalesActivos,
          borderColor: ['#05c9a7'],
          backgroundColor: ['#05c9a7'],
        },
      ],
    };

    this.lineChart.destroy();

    this.initChartUserRegister();
  }

  private initCharts() {
    const convertNivel = (niv) => {
      if (niv == '1') {
        return 'Socio Comercial';
      }
      if (niv == '2') {
        return 'Inversionista Lider';
      }
      if (niv == '3') {
        return 'Inversionista Senior';
      }
      if (niv == '4') {
        return 'Inversionista Junior';
      } else {
        return '';
      }
    };

    this.donutCHart = new Chart(this.customersChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'No activos'],
        datasets: [
          {
            label: 'Usuarios',
            backgroundColor: ['#05c9a7', '#f16664'],
            pointBackgroundColor: ['#05c9a7', '#f16664'],
            data: [this.contadorPersonas.ac, this.contadorPersonas.dc],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        cutout: 80,
        maintainAspectRatio: false,
        plugins: {
          legend: false,
          cutout: 80,
        },
      },
    });

    /* chart  */
    this.lineChart = new Chart(this.chartlastuser.nativeElement, {
      type: 'line',
      data: this.dataChart,
      options: {
        interaction: {
          intersect: false,
          mode: 'index',
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Usuarios Registrados',
          },
        },
      },
    });
  }

  private initChartUserRegister() {
    /* chart  */
    this.lineChart = new Chart(this.chartlastuser.nativeElement, {
      type: 'line',
      data: this.dataChart,
      options: {
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          title: {
            display: true,
            text: 'Usuarios Registrados',
          },
        },
      },
    });
  }

  private convertMes(mes) {
    if (mes == '01') {
      return 'Enero';
    }
    if (mes == '02') {
      return 'Febrero';
    }
    if (mes == '03') {
      return 'Marzo';
    }
    if (mes == '04') {
      return 'Abril';
    }
    if (mes == '05') {
      return 'Mayo';
    }
    if (mes == '06') {
      return 'Junio';
    }
    if (mes == '07') {
      return 'Julio';
    }
    if (mes == '08') {
      return 'Agosto';
    }
    if (mes == '09') {
      return 'Septiembre';
    }
    if (mes == '10') {
      return 'Octubre';
    }
    if (mes == '11') {
      return 'Noviembre';
    }
    if (mes == '12') {
      return 'Diciembre';
    }

    return false;
  }

  ReporteCompleto() {
    const workBook = new Workbook();
    this.socios.forEach((socio) => {
      socio.Personas = [];
      if (socio.Equipo) {
        socio.Personas = JSON.parse(socio.Equipo);
      }
      const workSheet = workBook.addWorksheet(socio.Nombre);
      let headers = workSheet.addRow([
        'NOMBRE',
        'RANGO',
        'ESTATUS',
        'EMAIL',
        'TELEFONO',
        'CELULAR',
      ]);
      for (let i = 1; i < 8; i++) {
        let columna = headers.getCell(i);
        columna.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF00085E' },
        };
        columna.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        columna.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true,
          size: 13,
        };
      }
      socio.Personas.forEach((item) => {
        const row = workSheet.addRow([
          item.Nombre,
          item.Rango,
          item.Estatus,
          item.Email,
          item.Num_Tel,
          item.Num_Cel,
        ]);
        workSheet.columns.forEach(function (column, i) {
          var maxLength = 0;
          column['eachCell']({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          });
          column.width = maxLength < 10 ? 10 : maxLength;
        });
        console.log(workBook)
      });
    });
    setTimeout(() => {
      workBook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'ReporteSC.xlsx');
    }); 
    }, 7000);
  }
  exportExcel(socio) {
    console.log(socio);
    this.rhService.ReporteSC(socio.IdPersona).subscribe((res: any) => {
      if (res.personas) {
        console.log(res);
        let personas = res.personas;
        const workBook = new Workbook();
        const workSheet = workBook.addWorksheet('test');
        let headers = workSheet.addRow([
          'NOMBRE',
          'RANGO',
          'ESTATUS',
          'INVERSIONISTA LÍDER',
        ]);
        for (let i = 1; i < 5; i++) {
          let columna = headers.getCell(i);
          columna.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00085E' },
          };
          columna.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          columna.font = {
            color: { argb: 'FFFFFFFF' },
            bold: true,
            size: 13,
          };
        }
        personas.forEach((item) => {
          const row = workSheet.addRow([
            item.Nombre,
            item.Rango,
            item.Estatus,
            item.Lider,
          ]);
          for (let i = 1; i < 5; i++) {
            const col = row.getCell(i);
            col.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: +item.IdNivel == 3 ? 'FF004385' : '' },
            };
            col.font = {
              color: { argb: +item.IdNivel == 3 ? 'FFFFFFFF' : 'FF000000' },
            };
            col.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          }
        });
        workSheet.columns.forEach(function (column, i) {
          var maxLength = 0;
          column['eachCell']({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          });
          column.width = maxLength < 10 ? 10 : maxLength;
        });
        workBook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          saveAs(blob, 'test.xlsx');
        });
      }
    });
    return;
    const workBook = new Workbook();
    const workSheet = workBook.addWorksheet('test');
    const excelData = [];
    const headerNames = Object.keys(this.data[0]);
    workSheet.addRow([headerNames[0], headerNames[1]]);
    this.data.forEach((item) => {
      const row = workSheet.addRow([item.name, item.Value]);
      for (let i = 1; i < 3; i++) {
        const col = row.getCell(i);
        col.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: +item.Value < 50 ? 'FFC000' : '70AD47' },
        };
      }
    });
    workBook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'test.xlsx');
    });
  }
}
