import { AfterViewInit, OnDestroy } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { FxcoinsService } from 'src/app/services/fxcoins.service';
import { RhService } from 'src/app/services/rh.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

declare var Chart: any;
const EXCEL_TYPE =
  'application/vnd.openxmlformats- officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public productostop: any = [];
  public porestatus: any = [0, 0, 0, 0];
  public personas: any = [];
  public inversionistas: any = [];
  public backupinversionistas: any[] = [];
  private subscriptions = new Subscription();
  public excel: any = {};
  public reporte = {
    activos: '',
    inactivos: '',
    inversionistas: '',
    fecha: new Date().toLocaleDateString(),
  };

  public configDataTable = {
    fields: [
      {
        text: 'Nombre',
        value: 'Nombre',
        hasImage: true,
        pipe: null,
      },
      {
        text: 'FXCoins',
        value: 'FxCoins',
        pipe: null,
      },
      {
        text: 'ECoins',
        value: 'ECoins',
        pipe: null,
      },
    ],
    editable: false,
    urlMedia: this.app.dominio + 'newDesign/assets/images/imgPerfil/',
    idField: 'IdPersona',
    fotoField: 'Foto_Perfil',
    guardado: true,
  };

  @ViewChild('salesChartx') salesChart: ElementRef;
  @ViewChild('statusChartx') statusChart: ElementRef;

  public barChart: any;
  public doughnutChart: any;
  public lastProductos: any = [];
  public estadisticas: any = [];
  public loading: boolean = false;
  public searched = null;
  public backupPersonas: any[] = [];

  constructor(
    public app: AppService,
    private fxcoins: FxcoinsService,
    private rhService: RhService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.fxcoins.getVentasTop().subscribe((res: any) => {
      this.productostop = res.productos;
    });

    this.fxcoins.getPedidosStatus().subscribe((res: any) => {
      this.porestatus = [
        res.Aprobados,
        res.Pendiente,
        res.Rechazado,
        res.Totales,
      ];
      this.showPieChart();
    });

    this.fxcoins.getLastPedidos().subscribe((res: any) => {
      this.lastProductos = res.pedidos;
    });

    this.fxcoins.getEstadisticas().subscribe((res: any) => {});

    this.fxcoins.getPersonas().subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.personas = res.asesores;
      this.backupPersonas = this.personas;
      this.inversionistas = res.inversionistas;
      this.backupinversionistas = this.inversionistas;
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngAfterViewInit(): void {
    let pedidosStatus = {
      Aprobados: '6',
      Pendiente: '13',
      Rechazado: '4',
      Totales: '23',
    };

    let usuariosUltimos = {
      Abono1: '0',
      Abono2: '1',
      Abono3: '0',
      Tours1: '1',
      Tours2: '2',
      Tours3: '1',
      Gadget1: '2',
      Gadget2: '3',
      Gadget3: '0',
      Vehiculos1: '0',
      Vehiculos2: '3',
      Vehiculos3: '0',
      Certificados1: '1',
      Certificados2: '1',
      Certificados3: '1',
      Vacaciones1: '1',
      Vacaciones2: '2',
      Vacaciones3: '0',
      Educacion1: '1',
      Educacion2: '1',
      Educacion3: '2',
    };

    let usuarios = [];

    for (let i in usuariosUltimos) usuarios.push([i, usuariosUltimos[i]]);

    const getDataCategoria = (users, i) => {
      let newArray = [];
      for (let index = 0; index < 7; index++) {
        newArray[index] = parseInt(users[i][1]);
        i += 3;
      }
      return newArray;
    };

    let myChart = new Chart(this.salesChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Abono de inversión',
          'Tours',
          'Gadget',
          'Vehículos',
          'Certificados',
          'Vacaciones',
          'Educación',
        ],
        datasets: [
          {
            label: 'Aprobado',
            backgroundColor: '#05c9a7',
            data: getDataCategoria(usuarios, 0),
          },
          {
            label: 'Pendiente',
            backgroundColor: '#886cff',
            data: getDataCategoria(usuarios, 1),
          },
          {
            label: 'Rechazado',
            backgroundColor: '#f16664',
            data: getDataCategoria(usuarios, 2),
          },
        ],
      },
      options: {
        tooltips: {
          displayColors: true,
          callbacks: {
            mode: 'x',
          },
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
              type: 'linear',
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
        },
      },
    });
  }

  public showPieChart() {
    this.doughnutChart = new Chart(this.statusChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Aprobado', 'Pendiente', 'Rechazado'],
        datasets: [
          {
            label: 'Usuarios',
            backgroundColor: ['#05c9a7', '#886cff', '#f16664'],
            pointBackgroundColor: ['#05c9a7', '#886cff', '#f16664'],
            data: [this.porestatus[0], this.porestatus[1], this.porestatus[2]],
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        plugins: {
          legend: false,
          cutout: 80,
        },
        cutout: 80,
        maintainAspectRatio: false,
      },
    });
  }

  public ListarPersonas() {
    let tabla = '';
    this.fxcoins.getRankin().subscribe((res: any) => {
      console.log(res.Ranking[0]);
      let ranking = res.Ranking[0];
      for (let i = 0; i < ranking.length; i++) {
        if (ranking[i].FxCoins > 0 || ranking[i].ECoins > 0) {
          tabla +=
            `
              <tr>
                  <td>` +
            ranking[i].Nombre +
            `</td>
                  <td>` +
            ranking[i].FxCoins +
            `</td>
                  <td>` +
            ranking[i].ECoins +
            `</td>
              </tr>`;
        }
      }
      this.EnviarDatos(tabla);
    });
  }
  public ListarPersonasExcel() {
    let activos =[];
    this.fxcoins.getRankin().subscribe((res: any) => {
      console.log(res.Ranking[0]);
      let ranking = res.Ranking[0];
      for (let i = 0; i < ranking.length; i++) {
        if (ranking[i].FxCoins > 0 || ranking[i].ECoins > 0) {
          activos.push({
            Nombre_Completo: ranking[i].Nombre,
            FxCoins: ranking[i].FxCoins,
            ECoins: ranking[i].ECoins,
          });

        }
      }
      const proceso: XLSX.WorkSheet = XLSX.utils.json_to_sheet(activos);
      const workbook: XLSX.WorkBook = {
        Sheets: { Activos: proceso },
        SheetNames: ['Activos'],
      };
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer,'ReporteActivos');
    });
  }
  EnviarDatos(tabla) {
    this.fxcoins.enviarReporte({ fxcoins: tabla }).subscribe((res: any) => {
      var blob = new Blob([res]);
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.pdf';
      link.click();
    });
  }

  public PrepararReporteGeneral() {
    this.reporte.activos = '';
    this.reporte.inactivos = '';
    this.reporte.inversionistas = '';
    this.fxcoins.getInfoReporte().subscribe((res: any) => {
      console.log(res);
      let activos = res.activos;
      let inactivos = res.inactivos;
      let inversionistas = res.inversionistas;
      for (let i = 0; i < activos.length; i++) {
        this.reporte.activos +=
          `
          <tr>
              <td>` +
          activos[i].Nombre +
          `</td>
              <td>` +
          activos[i].FxCoins +
          `</td>
              <td>` +
          activos[i].ECoins +
          `</td>
          </tr>`;
      }
      for (let i = 0; i < inactivos.length; i++) {
        this.reporte.inactivos +=
          `
          <tr>
              <td>` +
          inactivos[i].Nombre +
          `</td>
              <td>` +
          inactivos[i].FxCoins +
          `</td>
              <td>` +
          inactivos[i].ECoins +
          `</td>
          </tr>`;
      }
      for (let i = 0; i < inversionistas.length; i++) {
        this.reporte.inversionistas +=
          `
          <tr>
              <td>` +
          inversionistas[i].Nombre +
          `</td>
              <td>` +
          inversionistas[i].FxCoins +
          `</td>
              <td>` +
          inversionistas[i].ECoins +
          `</td>
          </tr>`;
      }
      this.EnviarDatos_General();
    });
  }

  EnviarDatos_General() {
    this.fxcoins.getReporteGeneral(this.reporte).subscribe((res: any) => {
      var blob = new Blob([res]);
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.pdf';
      link.click();
    });
  }

  pdf() {
    Swal.fire({
      title: 'Elige un reporte en PDF',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#0E1D60',
      denyButtonColor: '#0E1D60',
      confirmButtonText: 'Reporte Activos',
      denyButtonText: `Reporte Global`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.ListarPersonas();
      } else if (result.isDenied) {
        this.PrepararReporteGeneral();
      }
    });
  }
  excell() {
    Swal.fire({
      title: 'Elige un reporte en Excel',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#1C6C40',
      denyButtonColor: '#1C6C40',
      confirmButtonText: 'Reporte Activos',
      denyButtonText: `Reporte Global`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.ListarPersonasExcel();
      } else if (result.isDenied) {
        this.exportAsExcelFile();
      }
    });
  }
  public exportAsExcelFile(): void {
    this.excel = { activos: [], inactivos: [], inversionistas: [] };
    this.fxcoins.getInfoReporte().subscribe((res: any) => {
      console.log(res);
      let activos = res.activos;
      let inactivos = res.inactivos;
      let inversionistas = res.inversionistas;
      for (let i = 0; i < activos.length; i++) {
        this.excel.activos.push({
          Nombre_Completo: activos[i].Nombre,
          FxCoins: activos[i].FxCoins,
          ECoins: activos[i].ECoins,
        });
      }
      for (let i = 0; i < inactivos.length; i++) {
        this.excel.inactivos.push({
          Nombre_Completo: inactivos[i].Nombre,
          FxCoins: inactivos[i].FxCoins,
          ECoins: inactivos[i].ECoins,
        });
      }
      for (let i = 0; i < inversionistas.length; i++) {
        this.excel.inversionistas.push({
          Nombre_Completo: inversionistas[i].Nombre,
          FxCoins: inversionistas[i].FxCoins,
          ECoins: inversionistas[i].ECoins,
        });
      }
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.excel.activos
      );
      const baja: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.excel.inactivos
      );
      const proceso: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.excel.inversionistas
      );
      const workbook: XLSX.WorkBook = {
        Sheets: { Activos: worksheet, Inactivos: baja, Inversionistas: proceso },
        SheetNames: ['Activos', 'Inactivos', 'Inversionistas'],
      };
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer,'ReporteGlobal');
    });
  }

  private saveAsExcelFile(buffer: any,nombre): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, nombre + EXCEL_EXTENSION);
  }
}
