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
  public Volumen;
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
                  'Regristros',
    
                ],
              ],
              startY: 130,
              theme: 'striped', 
              headStyles: {
                fillColor: [104,116,84],
                
            },
            
              body: [
                ['St Maarten', ' $ 110,407 USD','1,139' ],
                ['Braulio Carrillo Costa Rica', ' $ 11,788.8 USD','222' ],
                ['Jaco Beach Costa Rica', ' $ 5,613.63 USD','95' ],
                ['Jamaica', ' $ 33,482.35 USD','804'  ],
                ['St Lucia', ' $ 15,591.6 USD','278' ],
              ],
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
  


    const footer = (tooltipItems) => {
      let sum = 0;

      tooltipItems.forEach(function (tooltipItem) {
        sum += tooltipItem.parsed.y;
      });
      return 'Total: ' + sum;
    };
    let parque = [];
    let delayed;
    let coloresrgba = [];
    
    for(let i = 0; i< 5; i++){
      coloresrgba[i] = this.colorRGB();
    }
 

    this.barChartCiudad = new Chart(this.salesChart.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'St Maarten',
            data: [18714.2,64552.55,27140.25],
            borderColor: coloresrgba[0],
            backgroundColor: coloresrgba[0],
          },
          {
            label: 'Braulio Carrillo Costa Rica',
            data: [2406.56,7366.74,2015.5],
            borderColor: coloresrgba[1],
            backgroundColor: coloresrgba[1],
          },
          {
            label: 'Jaco Beach Costa Rica',
            data: [1154.83,2779.4,1679.4],
            borderColor: coloresrgba[2],
            backgroundColor: coloresrgba[2],
          },
          {
            label: 'Jamaica',
            data: [11679.55,28113.1,20901.4],
            borderColor: coloresrgba[3],
            backgroundColor: coloresrgba[3],
          },
          {
            label: 'St Lucia',
            data: [2266,6487.1,6838.5],
            borderColor: coloresrgba[4],
            backgroundColor: coloresrgba[4],
          },
          
        ],
        labels: [
          '2021 Octubre',
          '2021 agosto',
          '2022 agosto'
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
  public generarNumero(numero) {
    return (Math.random() * numero).toFixed(0);
  }
  
  public colorRGB() {
    var coolor = "(" + this.generarNumero(255) + "," + this.generarNumero(255) + "," + this.generarNumero(255) + "," + ".5)";
    return "rgba" + coolor;
  }
}
