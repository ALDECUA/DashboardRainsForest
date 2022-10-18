import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { ContabilidadService } from 'src/app/services/contabilidad.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
declare var bootstrap: any;
const EXCEL_TYPE =
  'application/vnd.openxmlformats- officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss'],
})
export class LotesComponent implements OnInit {
  constructor(
    public app: AppService,
    private route: ActivatedRoute,
    public contabilidad: ContabilidadService,
    private router: Router,
    public controlcalidad: ControlcalidadService,
    public toast: ToastrService,
    public datepipe: DatePipe
  ) {}
  public subiendo: boolean = false;
  public info: any = {};
  public id;
  public loading: any = {};
  public lote: any = { LPagos: [] };
  public pago: any = {};
  public canvas;
  public modal;
  archivo;
  excel: any = [];

  // Checkbox
  public cb: any;
  public id_leads;
  public cb_asign: boolean = false;
  public c: number = 0;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getLotes();
    this.canvas = new bootstrap.Offcanvas(
      document.getElementById('LoteCanvas')
    );
    this.modal = new bootstrap.Modal(document.getElementById('PagoModal'), {
      keyboard: false,
    });
  }

  test(pago) {
    console.log(pago)
  }

  checkAll(ev) {
    if ($('#allcb').is(":checked") == true) {
      this.lote.LPagos.forEach(element => element.seleccionado = true );
    } else {
      this.lote.LPagos.forEach(element => element.seleccionado = false );
    }

    // let t = document.querySelector('#allcb') as HTMLInputElement
    // this.cb = Array.from(document.querySelectorAll('#cb'));
    // // console.log(ev);
    // console.log(t.checked);

    // if (t.checked == true) {
    //   this.c = this.cb.length;
    //   console.log(this.c);
    // } else {
    //   this.c = 0;
    //   console.log(this.c);
    // }
    // $('tbody tr td input[type="checkbox"]').prop('checked', $('#allcb').prop('checked'));
  }

  getLotes() {
    this.contabilidad.lotes(this.id).subscribe((res: any) => {
      if (!res.error) {
        this.info = res;
        console.log(this.info);
      }
    });
  }
  seleccionar(Inversion) {
    if (!Inversion.Pagos) {
      Inversion.Pagos = '[]';
    }
    Inversion.LPagos = JSON.parse(Inversion.Pagos);
    this.lote = Inversion;
    console.log(this.lote);
  }
  humanizeNumber(n) {
    n = n.toString();
    while (true) {
      var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');
      if (n == n2) break;
      n = n2;
    }
    return n;
  }
  verComp(imagen) {
    Swal.fire({
      imageUrl:
        'https://fibraxinversiones.mx/asesores/Content/img/archivos_usuarios/COMP_PAGO/' +
        imagen,
      imageWidth: 400,
      imageAlt: 'El archivo no es una imagen',
      html:
        '<a href="' +
        this.app.dominio +
        '/asesores/Content/img/archivos_usuarios/COMP_PAGO/' +
        imagen +
        '" target="_blank">Ver en otra pestaña</a>',
    });
  }
  SeleccionarPago(pago) {
    this.pago = pago;
    this.canvas.hide();
    this.modal.show();
    console.log(pago);
  }
  Actualizar() {
    this.controlcalidad.registrarPago(this.pago).subscribe((res: any) => {
      if (res.record.Inserted) {
        this.toast.success('Información del pago guardada');
      }
      if (res.record.Updated) {
        this.toast.success('Información del pago actualizada');
      }
      this.modal.hide();
      this.canvas.show();
      return res.record;
    });
  }
  eliminar() {
    this.pago.IdStatus = 0;
    let a = this.Actualizar();
  }
  onFileChange(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    let extension: any = target.files[0].name;
    extension = extension.split('.');
    extension = extension[extension.length - 1];
    if (extension != 'xlsx' && extension != 'xls' && extension != 'csv') {
      this.toast.error('Solo se admiten archivos excel para esta operación');
      this.archivo = null;
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excel = XLSX.utils.sheet_to_json(ws, {
        raw: false,
        header: ws ? 0 : 1,
        dateNF: 'dd/mm/yyyy',
      }); // to get 2d array pass 2nd parameter as object {header: 1}
      console.log(this.excel);
      this.excel.forEach((movimiento) => {
        movimiento.IdHR = this.lote.IdHR;
        movimiento.IdStatus = 1;
        movimiento.FechaPago = this.datepipe.transform(
          movimiento.FechaPago,
          'yyyy-MM-dd'
        );
        movimiento.Importe = Number(
          movimiento.Importe.replace(/[^0-9.-]+/g, '')
        );
        switch (movimiento.Tipo_pago) {
          case 'Internet':
            movimiento.IdTipoPago = 1;
            break;
          case 'Transferencia':
            movimiento.IdTipoPago = 2;
            break;
          case 'Cheque':
            movimiento.IdTipoPago = 3;
            break;
          case 'Efectivo':
            movimiento.IdTipoPago = 4;
            break;
        }
        switch (movimiento.Concepto) {
          case 'Concepto':
            movimiento.IdConcepto = 1;
            break;
          case 'Enganche':
            movimiento.IdConcepto = 2;
            break;
          case 'Gasto Administrativo':
            movimiento.IdConcepto = 3;
            break;
          case 'Mensualidad':
            movimiento.IdConcepto = 4;
            break;
          case 'Pago Genérico':
            movimiento.IdConcepto = 5;
            break;
          case 'Intereses':
            movimiento.IdConcepto = 6;
            break;
          case 'Pago de contado':
            movimiento.IdConcepto = 7;
            break;
        }
      });
      this.archivo = null;
      this.subiendo = true;
      setTimeout(() => {
        this.contabilidad
          .InsertarExcelPagos(this.excel)
          .subscribe((res: any) => {
            console.log(res);
            if (!res.error) {
              this.toast.success('Pagos registrados con éxito');
            } else {
              this.toast.error('Ocurrió un error, intenta nuevamente');
            }
            this.subiendo = false;
          });
      }, 1500);
    };
  }
}
