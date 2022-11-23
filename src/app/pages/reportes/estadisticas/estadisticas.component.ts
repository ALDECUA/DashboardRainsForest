import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { ReportesService } from 'src/app/services/reportes.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { style } from '@angular/animations';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { Workbook } from 'exceljs';
import { CommaListExpression } from 'typescript';

import { WSA_E_CANCELLED } from 'constants';

import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConsultasComponent } from '../consultas/consultas.component';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

declare var Chart: any;

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent implements OnInit, AfterViewInit, OnDestroy {
  /* Referencia el canvas con su #ID */
  @ViewChild('copropiedad') Copropiedad: ElementRef;
  @ViewChild('kunal') Kunal: ElementRef;
  @ViewChild('villamar') Villamar: ElementRef;
  @ViewChild('mantra') Mantra: ElementRef;
  @ViewChild('horizontes') Horizontes: ElementRef;
  @ViewChild('viapalmar') ViaPalmar: ElementRef;
  @ViewChild('koomuna') Koomuna: ElementRef;
  @ViewChild('zazilha') Zazilha: ElementRef;
  @ViewChild('bonarea') Bonarea: ElementRef;
  @ViewChild('salesStep') salesStep: ElementRef;
  @ViewChild('salesChart') salesChart: ElementRef;
  @ViewChild('InvChart') InvChart: ElementRef;
  @ViewChild('VscChart') VscChart: ElementRef;
  @ViewChild('HrsChart') HrsChart: ElementRef;
  @ViewChild('ReporteEstados') ReporteEstados: ElementRef;
  @ViewChild('ReporteCiudades') ReporteCiudades: ElementRef;
  @ViewChild('ReporteEdades') ReporteEdades: ElementRef;
  @ViewChild('ReporteHrs') ReporteHrs: ElementRef;
  @ViewChild('ReporteContratos') ReporteContratos: ElementRef;
  @ViewChild('AsesoresGenero') AsesoresGenero: ElementRef;
  @ViewChild('InvGenero') InvGenero: ElementRef;
  @ViewChild('LlamadasInv') LlamadasInv: ElementRef;
  @ViewChild('ReportesCotizaciones') ReportesCotizaciones: ElementRef;
  @ViewChild('ReportesCotizacionesPorMes')
  ReportesCotizacionesPorMes: ElementRef;
  /* Variables que se crean al inicalizar el chart */
  public barChart: any;
  public pieChart: any;
  public barChartbar: any;
  public donutCHart: any;
  public donutCHartI: any;
  public barChartSC: any;
  public HrsChartSC: any;
  public barChartEstado: any;
  public barChartCotizacionPorMes: any;
  public barChartCiudad: any;
  public barChartEdad: any;
  public pieChartHrs: any;
  public pieChartContratos: any;
  public donutChartAsesGen: any;
  public donutChartInvGen: any;
  public donutCharllamadas: any;
  public donutCharCotizacion: any;
  menuChart: boolean = false;

  /* Variables que se igualan a la respuesta */

  public ulregper: any = {};
  public ultimosreg = null;
  public infoEstadisticas: any = {};
  public des: any = [];
  public listInversionistas: any;
  public dataInfoInv: any;
  public reporte;
  public desde = '';
  public hasta = '';
  public InfoVentaLoteXDes: any;
  public InfoVentaLotexAses: any;
  public dataInfoLlamada: any;
  public dataInfoCotizacion: any;
  public dataLlamadaClick: any;
  public btnoption = 0;
  public Inversionista: any = [];
  public Reportehr: any = [];
  public FechaInicio: any;
  public FechaFinal: any;
  public Cotizacion: any;
  public socioscomerciales: any = [];
  public VIDEOGAMES: any[] = [];
  public configDataTable: any = {
    fields: [
      {
        text: 'Nombre',
        value: 'NombreCompleto',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Desarrollo',
        value: 'Desarrollo',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Etapa',
        value: 'Fase',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Lote',
        value: 'Lote',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Metodo de Pago',
        value: 'MetodoPago',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Tipo de Pago',
        value: 'TipoPago',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Precio Final',
        value: 'Precio_Final',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Mensualidades',
        value: 'Mensualidades',
        hasImage: false,
        pipe: null,
      },
    ],
    editable: false,
    show: false,
    fotoField: 'Foto_Perfil',
    filtroA: false,
  };

  public configTableHr: any = {
    fields: [
      {
        text: 'Nombre',
        value: 'Inversionista',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Desarrollo',
        value: 'Desarrollo',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Lote',
        value: 'Lote',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Precio Final',
        value: 'Precio_Final',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Enganche',
        value: 'Enganche',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Vendedor',
        value: 'Vendedor',
        hasImage: false,
        pipe: null,
      },
    ],
    editable: false,
    show: false,
    fotoField: 'Foto_Perfil',
    filtroA: false,
  };

  /* loader de las graficas */
  public loaderDatosInv: boolean = false;
  public loaderLotesVendidos: boolean = false;
  public loaderAsesRegis: boolean = false;
  public loaderInvRegis: boolean = false;
  public loaderAsesGen: boolean = false;
  public loaderInvGen: boolean = false;
  public loaderLotesXhr: boolean = false;
  public loaderHrsXSc: boolean = false;
  public loaderVXSc: boolean = false;
  public loaderMasAflu: boolean = false;
  public loaderEstadosMasAflu: boolean = false;
  public loaderCotizacionespormes: boolean = false;
  public loaderCiudadMasAflu: boolean = false;
  public loaderEdadesBuyMas: boolean = false;
  public loaderHrs: boolean = false;
  public loaderCotizaciones: boolean = false;
  public loaderContract: boolean = false;
  public loadinginv: boolean = false;

  /* Imprimir grafica excel */
  public GraficaInversionista: any;

  /* guarda el arreglo de la respuesta para imprimir en pantalla */
  private dataInfo: any = [];
  private dataVsc: any = [];
  private dataHrsc: any = [];
  private dataEstado: any = [];
  private dataCiudad: any = [];
  private dataEdad: any = [];
  private dataHrs: any = [];
  private dataContratos: any = [];
  private dataCotizacionPorMes: any = [];
  private dataAseGen: any = [];
  private dataInvGen: any = [];
  public dataLlamadas: any = [];

  /* ve4ntas */
  public ventasregistradas: any = [];
  private ventascondetalles: any = [];
  meses: any = [];
  anio: any = [];
  datosDesarrollos: any = {};
  public copropiedad: any = [];
  public kunal: any = [];
  public villamar: any = [];
  public mantra: any = [];
  public horizontes: any = [];
  public viapalmar: any = [];
  public koomuna: any = [];
  public zazilha: any = [];
  public bonarea: any = [];
  public granmantra: any = [];

  /*  */

  /* arreglo que contiene las cantidades del chart donuth */
  contadorPersonas: any = {};
  /* arreglo que contiene la info de los lotes vendidos */
  TotalVendidosGeneral: any = [];
  /* arreglo que contiene las cantidades vendidas por mes y anio para el chart de barras */
  TotalesDesarrollosVendidos: any = {
    granmantra: 0,
    copropiedad: 0,
    kunal: 0,
    villamar: 0,
    mantra: 0,
    horizontes: 0,
    viapalmar: 0,
    koomuna: 0,
    zazilha: 0,
    bonarea: 0,
    total: 0,
  };
  /* arreglo que contiene las cantidades de las ventas por socios comerciales */
  TotalVentaSC: any = {};
  TotalName: any;
  TotalColor: any;
  /* arreglo para las cantidades de los estado */
  estados: any;
  /* arreglo para las cantidades de las ciudades */
  ciudades: any;
  /* arrelo paara las edades */
  edades: any;
  edadestop: any;
  /* promedios Edades */
  promediosEdades: any = {};
  /* arreglo para las cantidades de los hrs */
  totalHrs: any = {};
  totalContratos: any = {};
  totalAseGen: any = {};
  totalInvGen: any = {};
  /* botones para la primera grafica de lotes vendidos */
  btngroup: any = [];
  /* arreglo de colores para la primera grafica de lotes vendiodos */
  btngroupLotesVendidos: any = [];
  /* arreglo para las llamadas */
  infoDataLLamadasInv: any = {};
  infoDataCotizacion: any = {};
  apartado: any = [];
  disponible: any = [];
  fase: any = [];
  totales: any = [];
  listabotonesprint: any = {};
  public evenitem: any = {};
  //ESTA VARIABLE APILA TODAS LAS SUBSCRIPCIONES EN MEMORIA PARA AL FINAL HACER LA DESTRUCCION DEL OBJETO Y LIBERAR MEMORIA
  private subscriptions = new Subscription();
  data: any;

  botton: number;

  constructor(
    public app: AppService,
    private el: ElementRef,
    private estadisticas: ReportesService,
    public reportes: ReportesService,
    public datepipe: DatePipe
  ) {
    this.app.currentModule = '';
    this.app.currentSection = '  Dashboard';
    /* this.downloadPDF(); */
  }

  ngAfterViewInit(): void {
    /* this.initCharts(); */
    document.querySelector('.btndisplay').classList.add('displaynone');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /* Tabla de Reporte hr -- Inicio */
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  public hrss = [];
  public hrs = [];
  public personas = [];
  public buscar = '';
  public busqueda = 0;
  public loading = false;
  public fechas: any = {};
  public backupPersonas = [];
  public datos = [];

  dateRangeChange() {
    this.buscar = '';
    this.busqueda++;
    if (!this.fechas.Elegir) {
      this.fechas.Elegir = 1;
    }
    if (!this.fechas.Seleccion) {
      this.fechas.Seleccion = 3;
    }
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
      console.log(this.fechas);
    }
  }

  Borrar() {
    this.botton = 1;
    this.dateRange.reset();
    this.personas.length = 0;
    this.busqueda = 0;
    this.fechas.Elegir = 1;
    this.fechas.Seleccion = 3;
    this.fechas.FechaFin = undefined;
  }

  Borrar2() {
    this.botton = 2;
    this.dateRange.reset();
    this.personas.length = 0;
    this.busqueda = 0;
    this.fechas.Elegir = 2;
    this.fechas.Seleccion = 4;
    this.fechas.FechaFin = undefined;
  }

  Borrar3() {
    this.botton = 3;
    this.dateRange.reset();
    this.personas.length = 0;
    this.busqueda = 0;
    this.fechas.Elegir = 3;
    this.fechas.Seleccion = 5;
    this.fechas.FechaFin = undefined;
  }

  detalles(persona) {
    console.log(persona, 'lider');
    if (persona.ver) {
      persona.ver = false;
      setTimeout(() => {
        this.hrs = [];
      }, 1000);

      return;
    }
    for (let i = 0; i < this.personas.length; i++) {
      this.personas[i].ver = false;
    }
    this.fechas.IdPersona = persona.IdAsociado;
    this.fechas.Seleccion = 1;
    console.log(this.fechas);
  }

  detalles2(item) {
    console.log(item, 'asesores');
    if (item.ver) {
      item.ver = false;
      setTimeout(() => {
        this.hrss = [];
      }, 1000);

      return;
    }
    for (let i = 0; i < this.hrs.length; i++) {
      this.hrs[i].ver = false;
    }
    this.fechas.IdPersona = item.IdTeamLider;
    this.fechas.Seleccion = 2;
    console.log(this.fechas);
  }

  public imprimirexelSC() {
    if (!this.fechas.FechaFin) {
      return;
    }
    this.fechas.Seleccion = 3;
    console.log(this.fechas);
    console.log(this.fechas.FechaInicio);
  }

  public imprimirexelIL() {
    if (!this.fechas.FechaFin) {
      return;
    }
    this.fechas.Seleccion = 4;
    console.log(this.fechas);
  }

  public imprimirexelA() {
    if (!this.fechas.FechaFin) {
      return;
    }
    this.fechas.Seleccion = 5;
    console.log(this.fechas);
  }

  public imprimirexelSC_Individual(persona) {
    persona.ver = true;
    this.fechas.IdPersona = persona.IdAsociado;
    this.fechas.Seleccion = 6;
    console.log(this.fechas);
  }

  public imprimirexelIL_Individual(persona) {
    persona.ver = true;
    this.fechas.IdPersona = persona.IdTeamLider;
    this.fechas.Seleccion = 7;
    console.log(this.fechas);
  }

  public imprimirexelA_Individual() {
    this.fechas.Seleccion = 8;
    console.log(this.fechas);
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
    });
  }

  ngOnInit(): void {
    /* loaders */
    this.loaderLotesVendidos = true;
    this.loaderAsesRegis = true;
    this.loaderInvRegis = true;
    this.loaderAsesGen = true;
    this.loaderInvGen = true;
    this.loaderLotesXhr = true;
    this.loaderHrsXSc = true;
    this.loaderVXSc = true;
    this.loaderEstadosMasAflu = true;
    this.loaderCotizacionespormes = true;
    this.loaderCiudadMasAflu = true;
    this.loaderEdadesBuyMas = true;
    this.loaderHrs = true;
    this.loaderCotizaciones = true;
    this.loaderContract = true;

    this.botton = 1;

    /* setear fecha de la semana */
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(last)).toUTCString();

    this.FechaInicio = new Date(firstday).toISOString().slice(0, 10);
    this.FechaFinal = new Date(lastday).toISOString().slice(0, 10);


    /* trae info de cantidades de usuarios */
    this.subscriptions.add(
      this.estadisticas.getUrlInfoestadistica().subscribe((res: any) => {
        this.infoEstadisticas = res;
        /* inversionistas registrados */
        console.log('inv reg ');
        console.log(res);
        this.contadorPersonas = {
          sc: this.infoEstadisticas.data.SociosComerciales,
          il: this.infoEstadisticas.data.InversionistasLider,
          is: this.infoEstadisticas.data.InversionistasSenior,
          ij: this.infoEstadisticas.data.InversionistasJunior,
          total: this.infoEstadisticas.data.PersonasTotal,
          ac: this.infoEstadisticas.data.ActivosTotal,
          rv: this.infoEstadisticas.data.RevisadosTotal,
          dc: this.infoEstadisticas.data.DesactivadorTotal,
          totalInv: this.infoEstadisticas.data.TotalInv,
          ia: this.infoEstadisticas.data.InvActivos,
          ir: this.infoEstadisticas.data.InvRevisados,
          id: this.infoEstadisticas.data.InvDesactivados,
        };
        this.initChartUsers();
        this.loaderAsesRegis = false;
        this.loaderInvRegis = false;
      })
    );

    /* trae la info de asesores e inversionistas por generos  -asesores por genero-*/
    this.subscriptions.add();

 
  }
  public veranio(event) {
    console.log(event.target.value.IdDesarrollo);
    console.log('xxxx');
    console.log(this.InfoVentaLoteXDes);

    $('.InfoHRs').empty();

    this.copropiedad = [];
    this.kunal = [];
    this.villamar = [];
    this.mantra = [];
    this.viapalmar = [];
    this.horizontes = [];
    this.koomuna = [];
    this.zazilha = [];
    this.bonarea = [];
    this.meses = [];

    if (parseInt(event.target.value) === 2021) {
      document.getElementById(event.target.value).classList.add('active');
      document.getElementById('2022').classList.remove('active');
      this.meses.push('Octubre');
      this.meses.push('Noviembre');
      this.meses.push('Diciembre');
    } else {
      document.getElementById(event.target.value).classList.add('active');
      document.getElementById('2021').classList.remove('active');
      var currentTime = new Date();
      var year = currentTime.getFullYear();
      var mess = currentTime.getMonth() + 1;

      for (let index = 1; index <= mess; index++) {
        this.meses.push(this.convertMes(index));
      }
    }

    this.TotalesDesarrollosVendidos.total = 0;
    this.TotalesDesarrollosVendidos.copropiedad = 0;
    this.TotalesDesarrollosVendidos.kunal = 0;
    this.TotalesDesarrollosVendidos.villamar = 0;
    this.TotalesDesarrollosVendidos.mantra = 0;
    this.TotalesDesarrollosVendidos.horizontes = 0;
    this.TotalesDesarrollosVendidos.viapalmar = 0;
    this.TotalesDesarrollosVendidos.koomuna = 0;
    this.TotalesDesarrollosVendidos.zazilha = 0;
    this.TotalesDesarrollosVendidos.bonarea = 0;

    this.ventasregistradas.forEach((element) => {
      //entramos en el elemento por año, y ejecutamos en primera instancia el año en curso
      if (element.anio === parseInt(event.target.value)) {
        /* suma todos el total de todos */
        this.TotalesDesarrollosVendidos.total += element.Cantidad;

        if (element.IdDesarrollo === 12) {
          this.TotalesDesarrollosVendidos.copropiedad += element.Cantidad;
        }
        if (element.IdDesarrollo === 11) {
          this.TotalesDesarrollosVendidos.kunal += element.Cantidad;
        }
        if (element.IdDesarrollo === 10) {
          this.TotalesDesarrollosVendidos.villamar += element.Cantidad;
        }
        if (element.IdDesarrollo === 8) {
          this.TotalesDesarrollosVendidos.mantra += element.Cantidad;
        }
        if (element.IdDesarrollo === 7) {
          this.TotalesDesarrollosVendidos.horizontes += element.Cantidad;
        }
        if (element.IdDesarrollo === 5) {
          this.TotalesDesarrollosVendidos.viapalmar += element.Cantidad;
        }
        if (element.IdDesarrollo === 4) {
          this.TotalesDesarrollosVendidos.koomuna += element.Cantidad;
        }
        if (element.IdDesarrollo === 3) {
          this.TotalesDesarrollosVendidos.zazilha += element.Cantidad;
        }
        if (element.IdDesarrollo === 1) {
          this.TotalesDesarrollosVendidos.bonarea += element.Cantidad;
        }

        //entramos en el elemento por mes convertDes(des)
        switch (element.mes) {
          case 1:
            this.saveinfo(element);

            break;
          case 2:
            this.saveinfo(element);

            break;

          case 3:
            this.saveinfo(element);

            break;

          case 4:
            this.saveinfo(element);

            break;

          case 5:
            this.saveinfo(element);

            break;

          case 6:
            this.saveinfo(element);

            break;

          case 7:
            this.saveinfo(element);

            break;

          case 8:
            this.saveinfo(element);

            break;

          case 9:
            this.saveinfo(element);

            break;

          case 10:
            this.saveinfo(element);

            break;

          case 11:
            this.saveinfo(element);

            break;

          case 12:
            /* console.log(element); */
            this.saveinfo(element);

            break;

          default:
            break;
        }
      }
    });

    //Vaciamos el contenido del texto que sera remplazado por el nuevo texto en cada boton
    $('.titleti').empty();
    //inicializamos la la variable donde ira el texto nuevo
    let outtitle = this.el.nativeElement.querySelector('.titleti');
    outtitle.insertAdjacentHTML(
      'beforeend',
      'TOTAL DE INVERSIONES ' + this.TotalesDesarrollosVendidos.total
    );
    //vaciamos el contenido del boton
    $('.btnGrafica').empty();
    //remplazamos el texto del boton
    let resetarbuton = document.getElementById('btnGrafica');
    resetarbuton.innerText = 'Imprimir Grafica ';
    /* let resetarbuton = this.el.nativeElement.querySelector('.btnGrafica');
    resetarbuton. */
    /*

    let printdatalotes = this.el.nativeElement.querySelector('.InfoHRs');
    printdatalotes.insertAdjacentHTML('beforeend', row);
 */
    /* let outtitle = this.el.nativeElement.querySelector('.titleti');
    let resetarbuton = this.el.nativeElement.querySelector('.btnprintgrafica');
    let titlein = this.el.nativeElement.querySelector('.titleTotalInv');
    outtitle.remove();
    resetarbuton.remove();
    titlein.insertAdjacentHTML('beforeend', '<p class="text-start fs-6 titleti mt-5" style="text-transform:uppercase">Total de inversiones: ' + this.TotalesDesarrollosVendidos.total + '<strong></strong></p>');
    titlein.insertAdjacentHTML('beforeend', '<button class="btn btn-outline-info me-5 btnprintgrafica" (click)="ImprimirGrafica(1,1)">Imprimir Grafica</button>');
    */

    const labels = this.meses;
    console.log(labels);

    //arreglo donde se guarda toda la info del chart
    this.dataInfo = {
      labels: labels,
      datasets: [
        {
          label: 'GRAN MANTRA',
          data: this.copropiedad,
          borderColor: this.btngroup[0].Color,
          backgroundColor: this.btngroup[0].Color,
        },
        {
          label: 'COPROPIEDAD',
          data: this.copropiedad,
          borderColor: this.btngroup[1].Color,
          backgroundColor: this.btngroup[1].Color,
        },
        {
          label: 'KUNAL',
          data: this.kunal,
          borderColor: this.btngroup[2].Color,
          backgroundColor: this.btngroup[2].Color,
        },
        {
          label: 'VILLAMAR',
          data: this.villamar,
          borderColor: this.btngroup[3].Color,
          backgroundColor: this.btngroup[3].Color,
        },
        {
          label: 'MANTRA',
          data: this.mantra,
          borderColor: this.btngroup[4].Color,
          backgroundColor: this.btngroup[4].Color,
        },
        {
          label: 'HORIZONTES',
          data: this.horizontes,
          borderColor: this.btngroup[5].Color,
          backgroundColor: this.btngroup[5].Color,
        },
        {
          label: 'VIA PALMAR',
          data: this.viapalmar,
          borderColor: this.btngroup[6].Color,
          backgroundColor: this.btngroup[6].Color,
        },
        {
          label: 'KOOMUNA',
          data: this.koomuna,
          borderColor: this.btngroup[7].Color,
          backgroundColor: this.btngroup[7].Color,
        },
        {
          label: 'ZAZIL-HA',
          data: this.zazilha,
          borderColor: this.btngroup[8].Color,
          backgroundColor: this.btngroup[8].Color,
        },
        {
          label: 'BONAREA',
          data: this.bonarea,
          borderColor: this.btngroup[9].Color,
          backgroundColor: this.btngroup[9].Color,
        },
      ],
    };

    this.barChart.destroy();
    this.initChartsLotesVendidosxmes();
  }

  /***************************************************************************************************************************************************************************************************************************
   ************************************************************************  TERMINA CONSULTAS PARA OBTENER DATOS -> EMPIEZA LLAMADO A LOS CHART *****************************************************************************
   **************************************************************************************************************************************************************************************************************************/

  private initChartUsers() {
    /* chart actividad de los usuarios */
    this.donutCHart = new Chart(this.salesStep.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Activo', 'Desactivado'],
        datasets: [
          {
            label: 'Usuarios',
            backgroundColor: ['#05c9a7', '#886cff'],
            pointBackgroundColor: ['#05c9a7', '#886cff'],
            data: [this.contadorPersonas.ac, this.contadorPersonas.dc],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: true,
        },
        cutout: 80,
        maintainAspectRatio: false,
        plugins: {
          legend: true,
          cutout: 80,
        },
      },
    });

    this.donutCHartI = new Chart(this.InvChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Activo', 'Revisado', 'Desactivado'],
        datasets: [
          {
            label: 'Usuarios',
            backgroundColor: ['#BB8FCE', '#7FB3D5', '#E59866'],
            pointBackgroundColor: ['#BB8FCE', '#7FB3D5', '#E59866'],
            data: [
              this.contadorPersonas.ia,
              this.contadorPersonas.ir,
              this.contadorPersonas.id,
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: true,
        },
        cutout: 80,
        maintainAspectRatio: false,
        plugins: {
          legend: true,
          cutout: 80,
        },
      },
    });
  }

  private initChartsLotesVendidos() {
    /************************************ chart totales lotes vendidos ******************************************/
    /* -----chart Copropiedad-----*/
    this.pieChart = new Chart(this.Copropiedad.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Copropiedad',
            data: [
              this.TotalVendidosGeneral.ldC,
              this.TotalVendidosGeneral.laC,
              this.TotalVendidosGeneral.lvC,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });
    /* -----chart kunal-----*/
    this.pieChart = new Chart(this.Kunal.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Kunal',
            data: [
              this.TotalVendidosGeneral.ldK,
              this.TotalVendidosGeneral.laK,
              this.TotalVendidosGeneral.lvK,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });

    /*  -----chart Villamar----- */
    this.pieChart = new Chart(this.Villamar.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Villamar',
            data: [
              this.TotalVendidosGeneral.ldV,
              this.TotalVendidosGeneral.laV,
              this.TotalVendidosGeneral.lvV,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });

    /*  -----chart Mantra----- */
    this.pieChart = new Chart(this.Mantra.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Mantra',
            data: [
              this.TotalVendidosGeneral.ldM,
              this.TotalVendidosGeneral.laM,
              this.TotalVendidosGeneral.lvM,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });

    /*  -----chart Horizontes----- */
    this.pieChart = new Chart(this.Horizontes.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Horizontes',
            data: [
              this.TotalVendidosGeneral.ldH,
              this.TotalVendidosGeneral.laH,
              this.TotalVendidosGeneral.lvH,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });

    /*  -----chart Via palmar----- */
    this.pieChart = new Chart(this.ViaPalmar.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Horizontes',
            data: [
              this.TotalVendidosGeneral.ldVP,
              this.TotalVendidosGeneral.laVP,
              this.TotalVendidosGeneral.lvVP,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });

    /*  -----chart Koomuna----- */
    this.pieChart = new Chart(this.Koomuna.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Horizontes',
            data: [
              this.TotalVendidosGeneral.ldKO,
              this.TotalVendidosGeneral.laKO,
              this.TotalVendidosGeneral.lvKO,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });

    /*  -----chart ZAZILHA----- */
    this.pieChart = new Chart(this.Zazilha.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Horizontes',
            data: [
              this.TotalVendidosGeneral.ldZ,
              this.TotalVendidosGeneral.laZ,
              this.TotalVendidosGeneral.lvZ,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });

    /*  -----chart Bonarea----- */
    this.pieChart = new Chart(this.Bonarea.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Lotes Disponibles', 'Lotes Apartados', 'Lotes Vendidos'],
        datasets: [
          {
            label: 'Horizontes',
            data: [
              this.TotalVendidosGeneral.ldB,
              this.TotalVendidosGeneral.laB,
              this.TotalVendidosGeneral.lvB,
            ],
            backgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            pointBackgroundColor: ['#0d6efd', '#fd7e14', '#0dcaf0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: false,
          title: {
            display: false,
            text: 'Movimiento de lotes',
          },
        },
      },
    });
  }

  private initChartsLotesVendidosxmes() {
    /* chart de lotes vendidos */
    const footer = (tooltipItems) => {
      let sum = 0;

      tooltipItems.forEach(function (tooltipItem) {
        sum += tooltipItem.parsed.y;
      });
      return 'Total: ' + sum;
    };

    let delayed;

    this.barChart = new Chart(this.salesChart.nativeElement, {
      type: 'line',
      data: this.dataInfo,
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === 'data' &&
              context.mode === 'default' &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
          maintainAspectRatio: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              footer: footer,
            },
          },
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js Line Chart',
          },
        },
      },
    });
  }

  private initChartVendidoSC() {
    /* chart de las ventas en hrs de los socios comerciales */
    this.HrsChartSC = new Chart(this.HrsChart.nativeElement, {
      type: 'bar',
      data: this.dataHrsc,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'hrs socio comercial',
          },
        },
      },
    });

    /* chart de las ventas totales de los socios comerciales */
    this.barChartSC = new Chart(this.VscChart.nativeElement, {
      type: 'bar',
      data: this.dataVsc,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'chart de las ventas totales del socio comercial',
          },
        },
      },
    });
  }

  private initChartsEstados() {
    /* chart de los estados donde mas se compran */
    this.barChartEstado = new Chart(this.ReporteEstados.nativeElement, {
      type: 'bar',
      data: this.dataEstado,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'left',
          },
          title: {
            display: false,
            text: 'Chart.js Horizontal Bar Chart',
          },
        },
      },
    });
  }

  private initChartsCotizacionpormes() {
    /* chart de los estados donde mas se compran */
    this.barChartCotizacionPorMes = new Chart(
      this.ReportesCotizacionesPorMes.nativeElement,
      {
        type: 'bar',
        data: this.dataCotizacionPorMes,
        options: {
          plugins: {
            title: {
              display: true,
              text: '',
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        },
      }
    );
  }

  private initChartCiudades() {
    /* Chart de los estamos donde mas se compran */
    this.barChartCiudad = new Chart(this.ReporteCiudades.nativeElement, {
      type: 'bar',
      data: this.dataCiudad,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'left',
          },
          title: {
            display: false,
            text: 'Chart.js Bar Chart',
          },
        },
      },
    });
  }

  public initChartEdades() {
    this.barChartEdad = new Chart(this.ReporteEdades.nativeElement, {
      type: 'bar',
      data: this.dataEdad,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js Bar Chart',
          },
        },
      },
    });
  }

  public initChartHrs() {
    this.pieChartHrs = new Chart(this.ReporteHrs.nativeElement, {
      type: 'doughnut',
      data: this.dataHrs,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Hrs rechazados y aprobados',
          },
        },
      },
    });
  }

  public initChartContrato() {
    this.pieChartContratos = new Chart(this.ReporteContratos.nativeElement, {
      type: 'doughnut',
      data: this.dataContratos,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Contratos',
          },
        },
      },
    });
  }

  public initChartAsesGenero() {
    this.donutChartAsesGen = new Chart(this.AsesoresGenero.nativeElement, {
      type: 'doughnut',
      data: this.dataAseGen,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Contratos',
          },
        },
      },
    });
  }

  public initChartInvGenero() {
    this.donutChartInvGen = new Chart(this.InvGenero.nativeElement, {
      type: 'doughnut',
      data: this.dataInvGen,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Contratos',
          },
        },
      },
    });
  }

  public initChartLlmadas() {
    this.donutCharllamadas = new Chart(this.LlamadasInv.nativeElement, {
      type: 'doughnut',
      data: this.dataInfoLlamada,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js Doughnut Chart',
          },
        },
      },
    });
  }

  public initChartCotizacion() {
    this.donutCharCotizacion = new Chart(
      this.ReportesCotizaciones.nativeElement,
      {
        type: 'doughnut',
        data: this.dataInfoCotizacion,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false,
              text: 'Cotizaciones',
            },
          },
        },
      }
    );
  }

  /******************************************************************************************************************************************************************************************************/
  /********************************************************************************* funciones no Charts ************************************************************************************************/
  /******************************************************************************************************************************************************************************************************/
  public generarNumero(numero) {
    return (Math.random() * numero).toFixed(0);
  }

  public generarLetra() {
    var letras = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ];
    var numero = (Math.random() * 15).toFixed(0);
    return letras[numero];
  }

  public colorHEX() {
    var coolor = '';
    for (var i = 0; i < 6; i++) {
      coolor = coolor + this.generarLetra();
    }
    return '#' + coolor;
  }

  public colorRGB() {
    var coolor =
      '(' +
      this.generarNumero(255) +
      ',' +
      this.generarNumero(255) +
      ',' +
      this.generarNumero(255) +
      ',' +
      '.5)';
    return 'rgba' + coolor;
  }
  public dataShow(item) {
    this.dataInfoInv = JSON.parse(item.Referido);
  }

  public searchInversionista(inv) {
    let input, filter, ul, txtValue;
    input = this.el.nativeElement.querySelector('.search');
    filter = input.value.toLowerCase();
    ul = $('#mylist').parent().find('.list-group-item');

    for (let index = 0; index < ul.length; index++) {
      const element = ul[index];
      txtValue =
        element.textContent.toLowerCase() || element.innerText.toLowerCase();

      if (txtValue.indexOf(filter) > -1) {
        ul[index].style.display = 'block';
      } else {
        ul[index].style.display = 'none';
      }
    }
  }
  /**
   * imprimirpdf
   */

  public async imprimirpdf(info, reporte) {
    /* variables */
    let datosCabecera;
    let items: any = [];
    let datosRegistros;
    let fecha = new Date().toLocaleDateString();
    let titulo = '';
    let nota = '';
    let depto = '';
    let finalidad = '';
    let templateUrl = '';
    let tituloreporte = '';
    let doc = new jsPDF();

    switch (reporte) {
      case 1: //Reporte de los datos de inversionistas. nommbre, corrreo, telefono, y total de referidos
        let datos = '';
        let reportes = this.listInversionistas;

        for (let i = 0; i < this.listInversionistas.length; i++) {
          datos +=
            `
          <tr style="background-color: #cadcf9;">
        <td ><strong> ` +
            this.listInversionistas[i].NombreInversionista +
            `</strong></td>
        <td ><strong>` +
            this.listInversionistas[i].Email +
            `</strong></td>
        <td ><strong>` +
            this.listInversionistas[i].Num_Cel +
            `</strong></td>
        <td ><strong> ` +
            'Referidos:' +
            this.listInversionistas[i].CantidadReferidos +
            `</strong> </td>
      </tr>
      `;
          let Referidospdf = JSON.parse(this.listInversionistas[i].Referido);
          console.log(Referidospdf);
          for (let a = 0; a < Referidospdf.length; a++) {
            if (Referidospdf[a].IdStatusReferido == 1) {
              Referidospdf[a].IdStatusReferido = 'El referido no ha invertido';
            }
            if (Referidospdf[a].IdStatusReferido == 2) {
              Referidospdf[a].IdStatusReferido = 'El referido ha invertido';
            }
            datos +=
              `
        <tr style="background-color: #ffff;">
      <td ><strong> ` +
              Referidospdf[a].Nombre_Completo +
              `</strong></td>
      <td ><strong>` +
              Referidospdf[a].Email +
              `</strong></td>
      <td ><strong>` +
              Referidospdf[a].Contacto +
              `</strong></td>
      <td ><strong> ` +
              Referidospdf[a].IdStatusReferido +
              `</strong> </td>
    </tr>
    `;
          }
        }

        datos += `<tbody>`;

        break;

      case 2: ///Reporte de los referidos de los inversionstas
        if (info[0].Inversionista != '') {
          titulo = 'INVERSIONISTA ' + info[0].Inversionista;
          tituloreporte = 'REPORTE DE REFERIDOS';
        } else {
          titulo = 'Lista de los referidos de inversionistas';
          tituloreporte = 'REPORTE';
        }

        datosCabecera = '';
        datosRegistros = '';
        fecha = new Date().toLocaleDateString();

        nota = 'Los datos impresos y los datos de produccion podrian variar';
        depto = 'General';
        finalidad = 'Informativo';
        templateUrl = 'reporteaestadisticasList.html';

        for (let index = 0; index < info.length; index++) {
          const element = info[index];
          datosRegistros += `
            <tr>
                <td  style="width:40%;"><strong style="font-size:12px;">Nombre:</strong> <small style="font-size:13px;">${element.Nombre_Completo}</small></td>
                <td style="width:35%"><strong style="font-size:12px;">Contacto:</strong> <small style="font-size:13px;">${element.Contacto}</small></td>
            </tr>
            <tr style="border-bottom:1px solid #000">
                  <td style="width:40%"><strong style="font-size:12px;">Email:</strong> <small style="font-size:13px;">${element.Email}</small></td>
                  <td style="width:35%"><strong style="font-size:12px;">Status:</strong> <small style="font-size:13px;">${element.StatusFolio}</small></td>
                  <td style="width:25% border-bottom:1px;text-align:left;"><strong style="font-size:12px;">Fecha:</strong> <small style="font-size:13px;">${element.FechaRegistro}</small></td>
            </tr>
            `;
        }



        break;

      case 3: //Reporte de los datos de las llamas que se hicieron y que faltan por hacerce
        fecha = new Date().toLocaleDateString();
        tituloreporte = 'REPORTE';
        titulo = 'Lista de los detalles de las llamadas';
        nota = 'Los datos impresos y los datos de produccion podrian variar';
        depto = 'Inversionistas';
        finalidad = 'Informativo';
        templateUrl = 'reporteaestadisticas.html';
        datosCabecera = ['NOMBRE', 'CEL', 'WHATSAPP', 'FECHA', 'ESTADO'];

        for (let index = 0; index < info.length; index++) {
          const element = info[index];

          let status = '';

          if (element.IdStatus === 1) {
            status = 'Realizado';
          } else if (element.IdStatus === 2) {
            status = 'No Realizado';
          } else {
            status = 'Pendiente';
          }

          let y: any;
          y = [
            element.Nombre_Completo,
            element.Num_Cel,
            element.Num_Tel,
            element.Fch_Cita,
            status,
          ];
          items.push(y);
        }
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        doc.setFontSize(18);
        doc.text(tituloreporte, 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.link;

        autoTable(doc, {
          head: [
            [
              datosCabecera[0],
              datosCabecera[1],
              datosCabecera[2],
              datosCabecera[3],
              datosCabecera[4],
            ],
          ],
          body: items,
        });

        setTimeout(() => {
          window.open(URL.createObjectURL(doc.output('blob')));
        }, 1800);
        datosCabecera = [];
        items = [];
        /*
        this.subscriptions.add(
          this.estadisticas.sendReport({
            tituloreporte: tituloreporte,
            titulo: titulo,
            nota: nota,
            depto: depto,
            finalidad: finalidad,
            fecha: fecha,
            cabeceras: datosCabecera,
            registros: datosRegistros,
            urllink: templateUrl
          }).subscribe((res: any) => {
            var blob = new Blob([res]);
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'ListaInvercionistas.pdf';
            link.click();
          })
        );
*/
        break;

      case 4: //Reporte de edades que compran mas
        fecha = new Date().toLocaleDateString();
        tituloreporte = 'REPORTE';
        titulo = 'Lista de las edades que mas compran';
        nota = 'Los datos impresos y los datos de produccion podrian variar';
        depto = 'Inversionistas';
        finalidad = 'Informativo';
        templateUrl = 'reporteaestadisticas.html';

        datosCabecera = ['CANTIDAD', 'EDAD'];

        for (let index = 0; index < info.length; index++) {
          const element = info[index];
          let x: any;
          let y: any;
          y = [element.cantidad, element.edad];
          items.push(y);
        }

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        doc.setFontSize(18);
        doc.text(tituloreporte, 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.link;

        autoTable(doc, {
          head: [[datosCabecera[0], datosCabecera[1]]],
          body: items,
        });
        setTimeout(() => {
          window.open(URL.createObjectURL(doc.output('blob')));
        }, 1800);

        datosCabecera = [];
        items = [];

        /*
        this.estadisticas.sendReport({
          tituloreporte: tituloreporte,
          titulo: titulo,
          nota: nota,
          depto: depto,
          finalidad: finalidad,
          fecha: fecha,
          cabeceras: datosCabecera,
          registros: datosRegistros,
          urllink: templateUrl
        }).subscribe((res: any) => {
          var blob = new Blob([res]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'ListaInvercionistas.pdf';
          link.click();
        });*/

        break;

      case 5: //reporte de los estados con mas afluencia
        fecha = new Date().toLocaleDateString();
        tituloreporte = 'REPORTE';
        titulo = 'Lista de los estados con mas afluencia';
        nota = 'Los datos impresos y los datos de produccion podrian variar';
        depto = 'Inversionistas';
        finalidad = 'Informativo';
        templateUrl = 'reporteaestadisticas.html';
        datosCabecera = ['CANTIDAD', 'ESTADO'];

        for (let index = 0; index < info.length; index++) {
          const element = info[index];
          let y: any;
          y = [element.cantidad, element.estado];
          items.push(y);
        }
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        doc.setFontSize(15);
        doc.setFillColor(41, 116, 178);
        doc.rect(13, 4, 182, 22, 'F');
        doc.setTextColor(255, 250, 250);
        doc.text(tituloreporte, 15, 10);
        doc.setFontSize(12);
        doc.text(titulo, 15, 20);
        doc.setFontSize(12);
        doc.text('FIBRAX', 150, 10);
        doc.setFontSize(12);
        doc.text(fecha, 150, 20);

        autoTable(doc, {
          theme: 'striped',
          margin: { top: 30 },
          styles: { valign: 'middle', halign: 'center' },
          head: [[datosCabecera[0], datosCabecera[1]]],
          body: items,
        });

        setTimeout(() => {
          window.open(URL.createObjectURL(doc.output('blob')));
        }, 1800);
        datosCabecera = [];
        items = [];

        /*
            for (let index = 0; index < info.length; index++) {
              const element = info[index];
              datosRegistros += `
                    <tr>

                    <td class="text-center">${element.cantidad}</td>
                        <td class="text-center">${element.estado}</td>
                    </tr>
                  `;
            }
*/
        /*
        this.estadisticas.sendReport({
          tituloreporte: tituloreporte,
          titulo: titulo,
          nota: nota,
          depto: depto,
          finalidad: finalidad,
          fecha: fecha,
          cabeceras: datosCabecera,
          registros: datosRegistros,
          urllink: templateUrl
        }).subscribe((res: any) => {
          var blob = new Blob([res]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'ListaInvercionistas.pdf';
          link.click();
        });
*/
        break;

      case 6: //Reporte de las ciudades donde se compran mas
        fecha = new Date().toLocaleDateString();
        tituloreporte = 'REPORTE';
        titulo = 'Lista de las ciudades donde se compran mas';
        nota = 'Los datos impresos y los datos de produccion podrian variar';
        depto = 'Inversionistas';
        finalidad = 'Informativo';
        templateUrl = 'reporteaestadisticas.html';

        datosCabecera = ['CANTIDAD', 'CIUDAD'];

        for (let index = 0; index < info.length; index++) {
          const element = info[index];
          let y: any;
          y = [element.cantidad, element.ciudad];
          items.push(y);
        }

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        doc.setFontSize(18);
        doc.text(tituloreporte, 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.link;

        autoTable(doc, {
          head: [[datosCabecera[0], datosCabecera[1]]],
          body: items,
        });

        setTimeout(() => {
          window.open(URL.createObjectURL(doc.output('blob')));
        }, 1800);
        datosCabecera = [];
        items = [];
        /*
        this.estadisticas.sendReport({
          tituloreporte: tituloreporte,
          titulo: titulo,
          nota: nota,
          depto: depto,
          finalidad: finalidad,
          fecha: fecha,
          cabeceras: datosCabecera,
          registros: datosRegistros,
          urllink: templateUrl
        }).subscribe((res: any) => {
          var blob = new Blob([res]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'ListaInvercionistas.pdf';
          link.click();
        });
*/
        break;

      case 7: // reporte general de la lista de los inversionistas
        let personas = this.listInversionistas;
        /* Contadores Grafico Excel Inicio*/
        let inv = 2;
        let ref = 0;
        /* Contadores Grafico Excel Fin */
        let workBook = new Workbook();
        let workSheet = workBook.addWorksheet('Referidos');
        let headers = workSheet.addRow([
          'NOMBRE',
          'CORREO',
          'TELEFONO',
          'DETALLES',
        ]);
        for (let i = 1; i <= 4; i++) {
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

        /* Datos Inversionistas */
        personas.forEach((item) => {
          if (item.CantidadReferidos) {
            item.CantidadReferidos2 =
              'Total de Referidos: ' + item.CantidadReferidos;
          } else {
          }
          const row = workSheet.addRow([
            item.NombreInversionista,
            item.Email,
            item.Num_Cel,
            item.CantidadReferidos2,
          ]);
          for (let i = 1; i <= 4; i++) {
            const col = row.getCell(i);
            col.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF00085E' },
            };
            col.font = {
              color: { argb: 'FFFFFFFF' },
            };
            col.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            col.alignment = {
              vertical: 'middle',
              horizontal: 'left',
              shrinkToFit: true,
            };
            workSheet.getCell('C' + inv).alignment = { horizontal: 'center' };
            workSheet.getCell('D' + inv).alignment = { horizontal: 'center' };
          }

          /* Datos Referidos */
          JSON.parse(item.Referido).forEach((item) => {
            inv++;
            ref = inv;
            if (item.IdStatusReferido === 1) {
              item.IdStatusReferido = 'El referido no ha invertido';
            } else if (item.IdStatusReferido === 2) {
              item.IdStatusReferido = 'El referido ha invertido';
            }
            const row = workSheet.addRow([
              item.Nombre_Completo,
              item.Email,
              item.Contacto,
              item.IdStatusReferido,
            ]);

            for (let i = 1; i <= 4; i++) {
              const col = row.getCell(i);
              col.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              };
              col.alignment = {
                vertical: 'middle',
                horizontal: 'left',
                shrinkToFit: true,
              };
              workSheet.getCell('C' + ref).alignment = { horizontal: 'center' };
            }
          });
          inv++;
        });
        workSheet.columns.forEach(function (column, i) {
          var maxLength = 0;
          column['eachCell']({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 20;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          });
          column.width = maxLength < 20 ? 20 : maxLength;
        });
        workBook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          saveAs(blob, 'Referidos.xlsx');
        });

        break;

      case 8: //Reporte de inversionistas datatable
        fecha = new Date().toLocaleDateString();
        tituloreporte = 'REPORTE INVERSIONISTAS';
        titulo = 'Lista de los hr con sc';
        nota = 'Los datos impresos y los datos de produccion podrian variar';
        depto = 'Inversionistas';
        finalidad = 'Informativo';
        templateUrl = 'reporteaestadisticas.html';
        datosCabecera = [
          'NOMBRE',
          'DES',
          'ETAPA',
          'LOTE',
          'METODO',
          'TIPO PAGO',
          'PRECIO FIANL',
          'MENS',
        ];

        for (let index = 0; index < info.length; index++) {
          const element = info[index];

          let y: any;
          y = [
            element.NombreCompleto,
            element.Desarrollo,
            element.Fase,
            element.Lote,
            element.MetodoPago,
            element.TipoPago,
            element.Precio_Final,
            element.Mensualidades,
          ];
          items.push(y);
        }
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        doc.setFontSize(18);
        doc.text(tituloreporte, 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.link;

        autoTable(doc, {
          head: [
            [
              datosCabecera[0],
              datosCabecera[1],
              datosCabecera[2],
              datosCabecera[3],
              datosCabecera[4],
              datosCabecera[5],
              datosCabecera[6],
              datosCabecera[7],
              datosCabecera[8],
              datosCabecera[9],
            ],
          ],
          body: items,
        });

        setTimeout(() => {
          window.open(URL.createObjectURL(doc.output('blob')));
        }, 1800);
        datosCabecera = [];
        items = [];
        /*
        this.estadisticas.sendReport({
          tituloreporte: tituloreporte,
          titulo: titulo,
          nota: nota,
          depto: depto,
          finalidad: finalidad,
          fecha: fecha,
          cabeceras: datosCabecera,
          registros: datosRegistros,
          urllink: templateUrl
        }).subscribe((res: any) => {
          var blob = new Blob([res]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'ListaInvercionistas.pdf';
          link.click();
        });

*/
        break;

      case 9: //Reporte de reporte hr datatable
        let idscc = this.el.nativeElement.querySelector('.socioscomerciales');
        titulo = 'Lista de inversionistas';
        for (let index = 0; index < this.socioscomerciales.length; index++) {
          const element = this.socioscomerciales[index];
          if (element.IdPersona == idscc.value) {
            titulo = 'Inversionistas de ' + element.Nombre_completo;
          }
        }

        fecha = new Date().toLocaleDateString();
        tituloreporte = 'REPORTE HR';
        nota = 'Los datos impresos y los datos de produccion podrian variar';
        depto = 'Inversionistas';
        finalidad = 'Informativo';
        templateUrl = 'reporteaestadisticas.html';

        datosCabecera = [
          'NOMBRE',
          'DES',
          'LOTE',
          'PRECIO',
          'ENGANCHE',
          'VENDEDOR FIANL',
        ];

        for (let index = 0; index < info.length; index++) {
          const element = info[index];

          let y: any;
          y = [
            element.Inversionista,
            element.Desarrollo,
            element.Lote,
            element.Precio_Final,
            element.Enganche,
            element.Vendedor,
          ];
          items.push(y);
        }
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        doc.setFontSize(18);
        doc.text(tituloreporte, 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.link;

        autoTable(doc, {
          head: [
            [
              datosCabecera[0],
              datosCabecera[1],
              datosCabecera[2],
              datosCabecera[3],
              datosCabecera[4],
              datosCabecera[5],
              datosCabecera[6],
            ],
          ],
          body: items,
        });

        setTimeout(() => {
          window.open(URL.createObjectURL(doc.output('blob')));
        }, 1800);
        datosCabecera = [];
        items = [];
        /*
        this.estadisticas.sendReport({
          tituloreporte: tituloreporte,
          titulo: titulo,
          nota: nota,
          depto: depto,
          finalidad: finalidad,
          fecha: fecha,
          cabeceras: datosCabecera,
          registros: datosRegistros,
          urllink: templateUrl
        }).subscribe((res: any) => {
          var blob = new Blob([res]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'ListaInvercionistas.pdf';
          link.click();
        });
*/
        break;

      case 10: //Reporte que sea no importa que valores traiga, se tiene que reccorerar los titulos y respuestas para su envio, pasamos dos parametros, los valores en un arreglo y el no del formato del reporte
        break;

      default:
        break;
    }
  }

  public xxx(id) {
    let promise = new Promise((resolve, reject) => {});
    return promise;
  }

  public seeDes(event) {
    console.log(event);
    //this.listabotonesprint = event.IdDesarrollo;
    this.listabotonesprint.btnprintuno = 2;
    console.log(this.listabotonesprint.btnprintuno);
    this.evenitem.btnprintuno = event;

    let item = {};
    let label = [];
    let dataDato = [];
    let cantidad = [];
    let fases: any = [];
    let disponibles: any = [];
    let apartados: any = [];
    let total: any = [];

    this.fase = [];
    this.disponible = [];
    this.apartado = [];
    this.totales = [];
    let row = '';

    this.TotalVendidosGeneral = [];
    for (var index = 0; index < this.InfoVentaLoteXDes.length; index++) {
      const element = this.InfoVentaLoteXDes[index];
      if (element.IdDesarrollo === event.IdDesarrollo) {
        //Asigno la informacion de disponibilidad de lotes
        fases.push(element.Fase);
        disponibles.push(element.Disponible);
        apartados.push(element.Apartados);
        total.push(element.Total);

        label.push(`Etapa ${element.Fase}`);
        cantidad.push(element.Apartados);
        item = {
          label: `Etapa ${element.Fase}`,
          data: [element.Apartados],
          backgroundColor: this.colorRGB(),
        };
        dataDato.push(item);
      }
    }

    for (let index = 0; index < fases.length; index++) {
      const element = fases[index];
      const dis = disponibles[index];
      const apar = disponibles[index];
      const tot = disponibles[index];

      row += `<tr class="listarow">
                    <td><strong>Fase:</strong> ${element}</td>
                    <td><strong>Apartados:</strong> ${apar}</td>
                    <td><strong>Disponibles:</strong> ${dis}</td>
                    <td><strong>Total:</strong> ${tot}</td>
                  </tr>`;
    }

    this.dataInfo = {
      labels: ['Etapas'],
      datasets: dataDato,
    };

    //Vaciamos el contenido de la tabla antes de ingresar algun dato
    $('.InfoHRs').empty();
    //Vaciamos el contenido del texto que sera remplazado por el nuevo texto en cada boton
    $('.titleti').empty();
    //inicializamos la la variable donde ira el texto nuevo
    let outtitle = this.el.nativeElement.querySelector('.titleti');
    outtitle.insertAdjacentHTML('beforeend', 'Desarrollo ' + event.Desarrollo);
    //vaciamos el contenido del boton
    $('.btnGrafica').empty();
    //remplazamos el texto del boton
    let resetarbuton = document.getElementById('btnGrafica');
    resetarbuton.innerText = 'Imprimir Grafica ' + event.Desarrollo;
    /* let resetarbuton = this.el.nativeElement.querySelector('.btnGrafica');
    resetarbuton. */
    let printdatalotes = this.el.nativeElement.querySelector('.InfoHRs');
    printdatalotes.insertAdjacentHTML('beforeend', row);

    /* limpiar canvas */
    this.barChart.destroy();
    /* crear la nueva grafica */
    this.initChartLotesVentasxDes();
    /* agregar el nuevo boton para imprimir la grafica */
    //resetarbuton.remove();
    //let titlebtn = document.getElementById('titleTotalInv');
    //titlebtn.innerHTML = '<button class="btn btn-outline-info me-5 btnprintgrafica" (click)="ImprimirGrafica(1,'+ event.IdDesarrollo +')">Imprimir Grafica ' + event.Desarrollo + '</button>';
    //titlein.insertAdjacentHTML('beforeend', '<button class="btn btn-outline-info me-5 btnprintgrafica" (click)="ImprimirGrafica(1,'+ event.IdDesarrollo +')">Imprimir Grafica ' + event.Desarrollo + '</button>');
  }

  /* graficas desde una acción */

  public initChartLotesVentasxDes() {
    this.barChart = new Chart(this.salesChart.nativeElement, {
      type: 'bar',
      data: this.dataInfo,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js line Chart',
          },
        },
      },
    });
  }

  public initChartLotesVentasXdesDate() {
    /* chart de las ventas en hrs de los socios comerciales */
    this.HrsChartSC = new Chart(this.HrsChart.nativeElement, {
      type: 'bar',
      data: this.dataHrsc,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'hrs socio comercial',
          },
        },
      },
    });

    /* chart de las ventas totales de los socios comerciales */
    this.barChartSC = new Chart(this.VscChart.nativeElement, {
      type: 'bar',
      data: this.dataVsc,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            postion: 'top',
          },
          title: {
            display: false,
            text: 'chart de las ventas totales del socio comercial',
          },
        },
      },
    });
  }

  public seemore(evento, grafica) {
    /* variables */
    let item = '';
    let title: any;
    let tituloGrafica = '';

    if (!!document.querySelector('.table-info') === true) {
      let removetable = this.el.nativeElement.querySelector('.table-info');
      removetable.remove();
    } else {
    }

    if (!!document.querySelector('.btnprint') === true) {
      let removebutton = this.el.nativeElement.querySelector('.btnprint');
      removebutton.remove();
      let removeclose = this.el.nativeElement.querySelector('.btnclose');
      removeclose.remove();
    }

    switch (grafica) {
      case 1 /* formato para imprimir esto */:
        tituloGrafica = 'Estados con más afluencia';
        title = `
            <tr>
                <th class="text-center">Cantidad</th>
                <th class="text-center">Estado</th>
            </tr>`;

        for (let index = 0; index < evento.length; index++) {
          const element = evento[index];
          item += `<tr>
                          <td class="text-center">${element.cantidad}</td>
                          <td class="text-center">${element.estado}</td>
                    </tr>`;
        }
        this.btnoption = 1;

        break;

      case 2:
        tituloGrafica = 'Ciudades donde compran mas';
        title = `<tr>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Ciudad</th>
                  </tr>`;

        for (let index = 0; index < evento.length; index++) {
          const element = evento[index];
          item += `<tr>
                        <td class="text-center">${element.cantidad}</td>
                        <td class="text-center">${element.ciudad}</td>
                    </tr>`;
        }

        this.btnoption = 2;

        break;

      case 3:
        tituloGrafica = 'Edades que mas compran';
        title = `
            <tr>
                <th class="text-center">Cantidad</th>
                <th class="text-center">Edad</th>
            </tr>`;

        for (let index = 0; index < evento.length; index++) {
          const element = evento[index];
          item += `<tr>
                        <td class="text-center">${element.cantidad}</td>
                        <td class="text-center">${element.edad}</td>
                    </tr>`;
        }

        this.btnoption = 3;

        break;

      case 4:
        tituloGrafica = 'Informacion de las llamadas';
        title = `
          <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Cel</th>
              <th class="text-center">WhatsApp</th>
              <th class="text-center">Fecha</th>
              <th class="text-center">Estado</th>
          </tr>`;

        for (let index = 0; index < evento.length; index++) {
          const element = evento[index];
          let status = '';

          if (element.IdStatus === 1) {
            status = 'Realizado';
          } else if (element.IdStatus === 2) {
            status = 'No Realizado';
          } else {
            status = 'Pendiente';
          }

          item += `<tr>
              <td class="text-center">${element.Nombre_Completo}</td>
              <td class="text-center">${element.Num_Cel}</td>
              <td class="text-center">${element.Num_Tel}</td>
              <td class="text-center">${element.Fch_Cita}</td>
              <td class="text-center">${status}</td>
          </tr>`;
        }

        this.btnoption = 4;
        break;

      default:
        break;
    }

    let tabla = `
    <table class="table table align-middle table-info">
        <thead>
           ${title}
        </thead>
        <tbody>
           ${item}
        </tbody>
    </table>`;

    let titulomodal = this.el.nativeElement.querySelector('.modal-title');
    titulomodal.innerText = tituloGrafica;

    let itemtable = this.el.nativeElement.querySelector('.result-table');
    itemtable.insertAdjacentHTML('beforeend', tabla);
  }

  public moreinfo() {
    /* Asignando titulos */

    let titulomodal = this.el.nativeElement.querySelector('.modal-title');
    titulomodal.innerText = 'Reportes con filtro';

    let itemtable = this.el.nativeElement.querySelector('.result-table');
    itemtable.insertAdjacentHTML('beforeend', 'tabla');
  }
  /* **********************************************************    FILTROS DE LOS REPORTES    *********************************************************************************************************** */
  public loadInv() {
    /* recolectando los datos */
    this.loadinginv = true;
    let desarrollo =
      this.el.nativeElement.querySelector('.desarrollosInv').value;
    let metodo = this.el.nativeElement.querySelector('.MetodopagoInv').value;
    let tipopago = this.el.nativeElement.querySelector('.tipopagoInv').value;
    let datasearch;
    let IdDesarrollo, IdMetodoPago, IdTipoPago;

    if (desarrollo != '') {
      IdDesarrollo = desarrollo;
    }
    if (metodo != '') {
      IdMetodoPago = metodo;
    }
    if (tipopago != '') {
      IdTipoPago = tipopago;
    }

    datasearch = {
      IdDesarrollo,
      IdMetodoPago,
      IdTipoPago,
    };
  }

  public loadhr() {
    /* Recolectando datos para mostrar */
    let fechaInicio =
      this.el.nativeElement.querySelector('.fechaInicialhr').value;
    let fechaFinal = this.el.nativeElement.querySelector('.fechaFinalhr').value;
    let socioscomerciales =
      this.el.nativeElement.querySelector('.socioscomerciales').value;
    let inicio, final, id;

    if (fechaInicio === '') {
      /* inicio = this.FechaInicio; */
      inicio = null;
    } else {
      inicio = fechaInicio;
    }
    if (fechaFinal === '') {
      /* final = this.FechaFinal; */
      final = null;
    } else {
      final = fechaFinal;
    }
    if (socioscomerciales === '') {
      id = null;
    } else {
      id = socioscomerciales;
    }
  }

  public downloadPDF() {
    // Extraemos la tabla
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
    };
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      });
  }

  /* ************************************************************************ FUNCION ************************************************************************************************************************************ */

  public ImprimirGrafica(tipo, grafica) {
    console.log('tipo de graficsa' + tipo);
    console.log('numero ' + grafica);
    console.log('caqntodades');
    console.log(this.ventascondetalles);

    /* DECLARACION DE LAS VARIABLES QUE SE USARAN PARA LOS TEXTOS E INFORMACIÓN DEL CHART () */
    let TitleReport = ''; //titulo del reporte en grandote
    let TitleChart = ''; //titulo de la grafica
    let titulodelagrafica = ''; //titulo secundario que llevara cada grafica
    let subtitulografica = ''; //subtitulo que llevara el titlechart
    let fecha = new Date().toLocaleDateString();
    let dataInfoChart: any = {};
    let dataColorChart: any = {};
    let dataColorChartSeteado: any = {};
    /* Variables de los chart */
    let pdfWidth = 300; //valor por predeterminado de la anchura
    let pdfHeight = 300; //valor predeterminado de la altura
    const dataPagaHeigth = 0;
    const dataPageWidth = 0;
    let tipoprintgrafica = 0;

    /* VARIABLES DEL CHART */
    let DATA: any;
    const doc = new jsPDF();
    var options = {
      background: 'white',
      scale: 3,
      //padding:50
    };

    switch (grafica) {
      case 1: //grafica numero uno
        /* setear las variables del char conforme al numero de la grafica y conforme a su valores  */

        DATA = document.getElementById('sales-chart');
        pdfHeight = 80;
        pdfWidth = 160;
        TitleChart = 'Lotes Vendidos';

        var ventasgenerales: any = [];
        let row = [];

        //datos
        this.ventascondetalles.forEach((element) => {
          console.log(element);
          row = [
            element.Desarrollo,
            element.Fase,
            element.Vendido,
            element.Apartados,
            element.Secreto,
            element.Disponible,
            element.Total,
          ];
          ventasgenerales.push(row);
        });

        console.log(ventasgenerales);

        /* autoTable(doc,{
          //styles: {fillColor: [255, 0, 0]},
          head: [['Desarrollo','Fase','Vendidos','Apartados','Secreto','Disponibles','Total']],
          body: ventasgenerales
        }) */
        //window.open(URL.createObjectURL(doc.output("blob")));

        break;

      case 2: //Grafica dos, es la grafica que imprime los lotes vendidos por desarrollo con su respectiva tabla
        console.log(this.evenitem.btnprintuno);
        DATA = document.getElementById('sales-chart');
        pdfHeight = 80;
        pdfWidth = 160;

        titulodelagrafica =
          'DEL DESARROLLO ' + this.evenitem.btnprintuno.Desarrollo;
        subtitulografica = 'por etapa';

        break;

      default:
        break;
    }

    switch (tipo) {
      case 1: //Tipo de Grafico que imprime una grafica mas una tabla formateada hacia la izquierda
        //Este tipo de grafico sirve para mostrar como va la grafica y abajo con sus respectivos datos, la tabla es para que tenga
        //un poco de formato el texto y no este todo desajustado
        //se hace todo el chow del tipo de reporte
        TitleReport = `REPORTE ${titulodelagrafica}`;
        TitleChart = 'Lotes vendidos ' + subtitulografica;
        html2canvas(DATA, options)
          .then((canvas) => {
            const img = canvas.toDataURL('image/PNG');
            // Add image Canvas to PDF
            const imgProps = (doc as any).getImageProperties(img);
            //Asignamos la asignacion de los espacios que llevara esta madre
            const bufferX = 50;
            const bufferY = 20;
            //Agregamos titulos generales y seteamos los tipos de letra
            doc.setFillColor(51, 180, 255);
            doc.rect(17, 12, 180, 1, 'F');

            doc.setFont('Helvetica', 'normal', 600);
            doc.setFontSize(19);
            doc.text(`${TitleReport}`, 20, 20);

            doc.setFillColor(51, 180, 255);
            doc.rect(17, 22, 180, 1, 'F');

            //Agregamos titulos y seatemos los tipos de letras
            doc.setFont('Helvetica', 'normal', 300);
            doc.setFontSize(15);
            doc.text(`${TitleChart}`, 20, 45);

            doc.setFillColor(122, 208, 84);
            doc.rect(20, 47, 60, 1, 'F');
            //Agregamos imagen
            doc.addImage(
              img,
              'PNG',
              25,
              60,
              pdfWidth,
              pdfHeight,
              undefined,
              'FAST'
            );
            //Agregamos informacion adicional de la tabla
            return doc;
          })
          .then((doc) => {
            autoTable(doc, {
              head: [
                [
                  'Desarrollo',
                  'Fase',
                  'Vendidos',
                  'Apartados',
                  'Secreto',
                  'Disponibles',
                  'Total',
                ],
              ],
              startY: 150,
              body: ventasgenerales,
            });
            window.open(URL.createObjectURL(doc.output('blob')));
            //doc.save(`${new Date().toISOString()}grafica_jspdf_chart.pdf`);
          });

        break;

      default:
        break;
    }
  }

  //funcion que trae las fechas de los hrs por socios comerciales
  public hrxsc() {
    let fechaInicio =
      this.el.nativeElement.querySelector('.fechainicialhr').value;
    let fechaFinal = this.el.nativeElement.querySelector('.fechafinalhr').value;
    let inicio;
    let final;

    if (fechaInicio === '') {
      inicio = this.FechaInicio;
    } else {
      inicio = fechaInicio;
    }
    if (fechaFinal === '') {
      final = this.FechaFinal;
    } else {
      final = fechaFinal;
    }

    console.log(inicio);
    console.log(final);

    
  }
  //funcion que trae las fechas de ventas por socios comerciales
  public vxsc() {
    let fechaInicio =
      this.el.nativeElement.querySelector('.fechainicialvxsc').value;
    let fechaFinal =
      this.el.nativeElement.querySelector('.fechafinalvxsc').value;
    let inicio;
    let final;

    if (fechaInicio === '') {
      inicio = this.FechaInicio;
    } else {
      inicio = fechaInicio;
    }
    if (fechaFinal === '') {
      final = this.FechaFinal;
    } else {
      final = fechaFinal;
    }

    console.log(inicio);
    console.log(final);

   
  }
  //
  

  private convertMes(mes) {
    if (mes === 1) {
      return 'Enero';
    }
    if (mes == '2') {
      return 'Febrero';
    }
    if (mes == '3') {
      return 'Marzo';
    }
    if (mes == '4') {
      return 'Abril';
    }
    if (mes == '5') {
      return 'Mayo';
    }
    if (mes == '6') {
      return 'Junio';
    }
    if (mes == '7') {
      return 'Julio';
    }
    if (mes == '8') {
      return 'Agosto';
    }
    if (mes == '9') {
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

  private convertDes(des) {
    if (des === '1') {
      return 'BONAREA';
    }
    if (des === '2') {
      return 'VIVE';
    }
    if (des === '3') {
      return 'ZAZIL-HA';
    }
    if (des === '4') {
      return 'KOOMUNA';
    }
    if (des === '5') {
      return 'VIA PALMAR';
    }
    if (des === '7') {
      return 'HORIZONTES';
    }
    if (des === '8') {
      return 'MANTRA';
    }
    if (des === '10') {
      return 'VILLAMAR';
    }
    if (des === '11') {
      return 'KUNAL';
    }
    if (des === '12') {
      return 'COPROPIEDAD';
    }
    return false;
  }

  private saveinfoprint(element: any) {
    let arrayData: any = {};

    if (element.IdDesarrollo === 12) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 11) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 10) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 8) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 7) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 5) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 4) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 3) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 2) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    if (element.IdDesarrollo === 1) {
      arrayData.Desarrollo = element.Desarrollo;
      arrayData.Fase = element.Fase;
      arrayData.Apartados = element.Apartados;
      arrayData.Disponible = element.Disponible;
      arrayData.Total = element.Total;
      arrayData.Vendido = element.Vendido;
      arrayData.Secreto = element.Secreto;
      return arrayData;
    }
    return arrayData;
  }

  private saveinfo(element: any) {
    let arrayData: any = {};

    if (element.IdDesarrollo === 13) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.granmantra.push(element.Cantidad);
      return arrayData;
    }

    if (element.IdDesarrollo === 12) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.copropiedad.push(element.Cantidad);

      return arrayData;
    }
    if (element.IdDesarrollo === 11) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.kunal.push(element.Cantidad);
      return arrayData;
    }
    if (element.IdDesarrollo === 10) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.villamar.push(element.Cantidad);
      return arrayData;
    }
    if (element.IdDesarrollo === 8) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.mantra.push(element.Cantidad);
      return arrayData;
    }
    if (element.IdDesarrollo === 7) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.horizontes.push(element.Cantidad);
      return arrayData;
    }
    if (element.IdDesarrollo === 5) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.viapalmar.push(element.Cantidad);
      return arrayData;
    }
    if (element.IdDesarrollo === 4) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.koomuna.push(element.Cantidad);
      return arrayData;
    }
    if (element.IdDesarrollo === 3) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.zazilha.push(element.Cantidad);
      return arrayData;
    }
    if (element.IdDesarrollo === 1) {
      arrayData.Cantidad = element.Cantidad;
      arrayData.Desarrollo = element.Desarrollo;
      this.bonarea.push(element.Cantidad);
      return arrayData;
    }

    return false;
  }
  numeroGlobal: any = 0;
  menu(numero) {
    if (this.numeroGlobal == 0) {
      this.numeroGlobal = numero;
      document.querySelector('#menu' + numero).classList.add('active');
    } else {
      document
        .querySelector('#menu' + this.numeroGlobal)
        .classList.remove('active');
      this.numeroGlobal = numero;
      document.querySelector('#menu' + numero).classList.add('active');
    }
  }
}
