import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Console } from 'console';
import html2canvas from 'html2canvas';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AppService } from 'src/app/services/app.service';
import { ReportesService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare var Chart: any;

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss'],
})
export class ConsultasComponent implements OnInit {
  @Input()
  nombre = 'DesarrolloWeb.com';
  @ViewChild('capture', { static: true }) el!: ElementRef<HTMLImageElement>;
  @ViewChild('salesChart') salesChart: ElementRef;
  public barChartCiudad: any;
  public parques;
  public desde;
  public hasta;
  public tipo;
  public pagos: any = [];
  public lotes: any = [];
  public lotesb;
  public Volumen: any[];
  public CotizacionesPorDesarrollo: any[];
  Desarrollodos: {};

  constructor(public app: AppService, public reportes: ReportesService) {
    this.app.currentModule = 'Reportes';
    this.app.currentSection = ' - Consultas';
  }
  ngAfterViewInit() {
    this.initChartCiudades();
  }
  ngOnInit() {
    this.obtenerparques();
    /*  this.ObtenerPagos();
    this.ObtenerLotes();
    this.ObtenerVolumenHR();
    this.ObtenerCotizaciones(); */
  }
  obtenerparques() {
    this.reportes.parquesrainfores().subscribe((res: any) => {
      if (!res.error) {
        this.parques = res;
      }
    });
  }

  pdf() {
    Swal.fire({
      title: 'Elige un reporte en PDF',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#0E1D60',
      /* denyButtonColor: '#0E1D60', */
      confirmButtonText: 'Reporte Global',
      /*  denyButtonText: `Reporte Global`, */
    }).then((result) => {
      if (result.isConfirmed) {
        var options = {
          background: 'white',
          scale: 3,
          //padding:50
        };
        let pdfHeight = 90;
        let pdfWidth = 160;
        const pdf = new jsPDF();
        html2canvas(document.getElementById('ReporteCiudades'), options)
          .then((canvas) => {
            const imgData = canvas.toDataURL('imge/jpeg');
            const imagePros = (pdf as any).getImageProperties(imgData);
            pdf.setFillColor(104,116,84);
            pdf.rect(17, 12, 180, 1, 'F');

            pdf.setFont('Helvetica', 'normal', 600);
            pdf.setFontSize(19);
            pdf.text(`Reporte de General Parques`, 20, 20);

            pdf.setFillColor(104,116,84);
            pdf.rect(17, 22, 180, 1, 'F');
            pdf.addImage(
              imgData,
              'PNG',
              25,
              30,
              pdfWidth,
              pdfHeight,
              undefined,
              'FAST'
            );
            return pdf;
          })
          .then((pdf) => {
            autoTable(pdf, {
              head: [
                [
                  'Parque',
                  'Total venta',
                  'Vendidos',
                  'Apartados',
                  'Niños',
                
                ],
                
              ],
              startY: 130,
              theme: 'striped', 
              headStyles: {
                fillColor: [104,116,84],
                
            },
            
              body: [['asdas', 'dasds'],[1212, 'd122121'],[2222, '2222']],
            });

            // window.open(URL.createObjectURL(pdf.output("blob")));
            pdf.save(`Reporte_General_Parques_Rainfores_`+new Date().toLocaleDateString());
          });
      }
    });
  }
  excell() {
    Swal.fire({
      title: 'Elige un reporte en Excel',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#1C6C40',
      /* denyButtonColor: '#1C6C40', */
      confirmButtonText: 'Reporte Global',
      /* denyButtonText: `Reporte Global`, */
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('entro excel');
      }
    });
  }

  public initChartCiudades() {
    /* Chart de los estamos donde mas se compran */

    /* chart de lotes vendidos */
    const footer = (tooltipItems) => {
      let sum = 0;

      tooltipItems.forEach(function (tooltipItem) {
        sum += tooltipItem.parsed.y;
      });
      return 'Total: ' + sum;
    };

    let delayed;

    this.barChartCiudad = new Chart(this.salesChart.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'GRAN MANTRA',
            data: [7,0,0, 565, 45, 45, 645, 56],
            borderColor: 'rgba(203,138,2,.5)',
            backgroundColor: 'rgba(203,138,2,.5)',
          },
        ],
        labels: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
        ],
      },
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
}
