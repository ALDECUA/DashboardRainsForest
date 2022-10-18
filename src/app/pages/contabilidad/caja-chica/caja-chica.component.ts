import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContabilidadService } from 'src/app/services/contabilidad.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
declare var bootstrap: any;
const EXCEL_TYPE =
  'application/vnd.openxmlformats- officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-caja-chica',
  templateUrl: './caja-chica.component.html',
  styleUrls: ['./caja-chica.component.scss'],
})
export class CajaChicaComponent implements OnInit {
  constructor(
    public app: AppService,
    public auth: AuthService,
    public contabilidad: ContabilidadService,
    public datepipe: DatePipe,
    public toast: ToastrService
  ) {
    this.app.currentModule = 'Administracion';
    this.app.currentSection = ' - Caja chica';
  }
  archivo;
  excel: any = [];
  movimiento: any = {};
  public contador = 0;
  usuario;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  info: any = {};
  public fechas: any = {};
  loading: boolean = false;
  public loadingcarga: boolean = false;
  infoi = { movimientos: '', fecha: new Date().toLocaleDateString() };
  moneda = 'MXN';
  subiendo: boolean = false;
  mensaje = '';
  public myModal;
  ngOnInit(): void {
    this.usuario = this.auth.user;
    this.ObtenerMovimientos();
    this.myModal = new bootstrap.Modal(document.getElementById('ExcelModal'), {
      keyboard: false,
    });
  }
  nuevomovimiento(tipo) {
    this.movimiento = {
      TipoMovimiento: tipo,
      Fecha: this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
    };
  }
  seleccionarmovimiento(movimiento) {
    this.loadingcarga = false;
    this.movimiento = movimiento;
  }
  guardarMovimiento() {
    Swal.fire({
      title: '¿Deseas guardar este movimiento?',
      text: ' Esta acción no se puede deshacer',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loadingcarga = true;
        this.movimiento.IdUsuario = this.usuario.IdUsuario;
        this.movimiento.Divisa = this.moneda;
        this.contabilidad
          .GuardarMovimiento(this.movimiento)
          .subscribe((res: any) => {
            if (res.Exito) {
              this.loadingcarga = false;
              this.toast.success('Movimiento guardado');
              let cerrar = document.getElementById('cerrar');
              cerrar.click();
              this.info = {};
              this.ObtenerMovimientos();
            } else {
              this.toast.error(
                'Ocurrió un error interno',
                'Intente nuevamente, si el problema persiste contacte a soporte'
              );
            }
          });
      }
    });
  }
  dateRangeChange() {
    if (this.dateRange.value.end && this.dateRange.value.start) {
      this.fechas.FechaInicio = this.datepipe.transform(
        this.dateRange.value.start,
        'yyyy-MM-dd'
      );
      this.fechas.FechaFin = this.datepipe.transform(
        this.dateRange.value.end,
        'yyyy-MM-dd'
      );
      this.info = {};
      this.ObtenerMovimientos();
    }
  }
  ObtenerMovimientos() {
    this.mensaje = 'Actualizando información';
    this.contabilidad.GetMovimientos(this.fechas).subscribe((res: any) => {
      this.info = res;
      this.subiendo = false;
    });
  }
  public subirImagen(event) {
    this.loading = true;
    let formData = new FormData();
    formData.append('file', event[0]);
    this.contabilidad.SubirCompC(formData).subscribe((res: any) => {
      if (res.error) {
        this.toast.warning(
          '',
          'Ocurrio un error al cargar la imagen, intenta nuevamente'
        );
      } else {
        this.loading = false;
        this.movimiento.Img_Comprobante = res.imagen;
        this.movimiento.archivo = event[0].name;
        this.toast.success('Imagen guardada en el servidor');
      }
    });
  }
  public verRecibo(recibo) {
    Swal.fire({
      imageUrl:
        this.app.dominio + 'api/storage/comprobantes_cajachica/' + recibo,
      imageWidth: 400,
      imageAlt: 'El archivo no es una imagen',
      html:
        '<a href="' +
        this.app.dominio +
        'api/storage/comprobantes_cajachica/' +
        recibo +
        '" target="_blank">Ver en otra pestaña</a>',
    });
  }
  public humanizeNumber(n) {
    n = n.toString();
    while (true) {
      var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');
      if (n == n2) break;
      n = n2;
    }
    return n;
  }
  reporte() {
    Swal.fire({
      title: 'Elige un formato para descargar tu reporte',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#01723A',
      confirmButtonText: '<i class="fas fa-file-excel"></i> Excel',
      denyButtonText: '<i class="fas fa-file-pdf"></i> PDF',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.exportAsExcelFile();
      } else if (result.isDenied) {
        this.imprimir();
      }
    });
  }

  public exportAsExcelFile(): void {
    console.log(this.info);
    let personas = this.info.movimientos;
    const workBook = new Workbook();
    const workSheet = workBook.addWorksheet('MXN');
    const workSheetUSD = workBook.addWorksheet('USD');
    let headers = workSheet.addRow([
      'FECHA',
      'FOLIO',
      'CONCEPTO',
      'TIPO',
      'MONTO',
      'SALDO',
      'USUARIO',
    ]);
    let headersUSD = workSheetUSD.addRow([
      'FECHA',
      'FOLIO',
      'CONCEPTO',
      'TIPO',
      'MONTO',
      'SALDO',
      'USUARIO',
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
    for (let i = 1; i < 8; i++) {
      let columna = headersUSD.getCell(i);
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
        item.FHora,
        item.IdMovimiento,
        item.Descripcion,
        item.TipoMovimiento,
        item.Cantidad,
        item.Saldo,
        item.Usuario,
      ]);
      for (let i = 1; i < 8; i++) {
        const col = row.getCell(i);
        col.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (i == 5 || i == 6) {
          col.numFmt = '$ #,##0.00';
        }
      }
    });
    personas = this.info.movimientosUSD;
    personas.forEach((item) => {
      const row = workSheetUSD.addRow([
        item.FHora,
        item.IdMovimiento,
        item.Descripcion,
        item.TipoMovimiento,
        item.Cantidad,
        item.Saldo,
        item.Usuario,
      ]);
      for (let i = 1; i < 8; i++) {
        const col = row.getCell(i);
        col.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (i == 5 || i == 6) {
          col.numFmt = '$ #,##0.00';
        }
      }
    });
    workSheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value
          ? cell.value.toString().length * 2 + 6
          : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
    workSheetUSD.columns.forEach(function (column, i) {
      var maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length * 2 : 10;
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
      saveAs(blob, 'movimientos.xlsx');
    });
  }
  /* this.saveAsExcelFile(excelBuffer);  */

  cargar() {
    this.infoi.movimientos = '';
    for (let i = 0; i < this.info.movimientos.length; i++) {
      this.infoi.movimientos +=
        `
          <tr>
              <td>` +
        this.info.movimientos[i].IdMovimiento +
        `</td>
              <td>` +
        this.info.movimientos[i].Descripcion +
        `</td>
              <td>` +
        this.info.movimientos[i].TipoMovimiento +
        `</td>
        <td>$ ` +
        this.humanizeNumber(this.info.movimientos[i].Cantidad) +
        `</td>
        <td>$ ` +
        this.humanizeNumber(this.info.movimientos[i].Saldo) +
        `</td>
          <td>` +
        this.info.movimientos[i].Usuario +
        `</td>
          </tr>`;
    }
  }
  imprimir() {
    this.cargar();
    this.contabilidad.ReportePDF(this.infoi).subscribe((res: any) => {
      var blob = new Blob([res]);
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.pdf';
      link.click();
    });
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
        movimiento.Fecha = this.datepipe.transform(
          movimiento.Fecha,
          'yyyy-MM-dd'
        );
        movimiento.IdUsuario = this.usuario.IdUsuario;
        movimiento.Divisa = this.moneda;
        if (movimiento.Ingresos) {
          movimiento.TipoMovimiento = 1;
          let dinero = movimiento.Ingresos;
          movimiento.Cantidad = Number(dinero.replace(/[^0-9.-]+/g, ''));
        } else {
          movimiento.TipoMovimiento = 2;
          let dinero = movimiento.Gastos;
          movimiento.Cantidad = Number(dinero.replace(/[^0-9.-]+/g, ''));
        }
      });
      this.archivo = null;

      this.myModal.toggle();
    };
  }
  public subirExcel() {
    this.mensaje = 'Subiendo movimientos';
    this.subiendo = true;
    this.contabilidad.InsertarExcel(this.excel).subscribe((res: any) => {
      if (res.exito) {
        this.toast.success('Se han guardado los movimientos');
      } else {
        this.toast.error('Ocurrio un error interno');
      }
      this.ObtenerMovimientos();
      this.myModal.toggle();
    });
  }
  ajustar(movimiento, metodo, e) {
    if (!isNaN(e.key)) {
      if (metodo == 1) {
        delete movimiento.Gastos;
        movimiento.TipoMovimiento = 1;
        movimiento.Cantidad = movimiento.Ingresos;
      } else {
        delete movimiento.Ingresos;
        movimiento.TipoMovimiento = 2;
        movimiento.Cantidad = movimiento.Gastos;
      }
    }
  }
  modificarMovimiento() {
    this.movimiento.TipoMovimiento = 1;
    this.loadingcarga = true;
    this.contabilidad
      .GuardarMovimiento(this.movimiento)
      .subscribe((res: any) => {
        if (res.Updated) {
          this.loadingcarga = false;
          this.toast.success('Movimiento actualizado');
          let cerrar = document.getElementById('cerrar');
          cerrar.click();
        } else {
          this.toast.success('Ocurrio un error interno');
          this.loadingcarga = false;
        }
        this.ObtenerMovimientos();
      });
  }

  todos(event) {
    let check = event.target.checked;
    if (check == true) {
      this.contador = this.excel.length;
    } else {
      this.contador = 0;
    }
    this.excel.forEach((element) => {
      element.Checked = check;
    });
  }
  numero(event) {
    if (event.target.value) {
      let valor = Number(event.target.value.replace(/[^0-9.-]+/g, ''));
      event.target.type = 'number';
      event.target.value = valor;
    }
  }
  texto(event) {
    if (event.target.value) {
      let actual = Number(event.target.value);
      let valor = '$ ' + this.humanizeNumber(actual.toFixed(2));
      event.target.type = 'text';
      event.target.value = valor;
    }
  }
  eliminar() {
    let nuevo = [];
    this.excel.forEach((movimiento) => {
      if (!movimiento.Checked) {
        nuevo.push(movimiento);
      } else {
        this.contador--;
      }
    });
    this.excel = nuevo;
  }

  checar(event) {
    if (event.target.checked) {
      this.contador++;
    } else {
      this.contador--;
    }
  }
  eliminarMov(IdMovimiento) {
    this.contabilidad.EliminarMoviemto(IdMovimiento).subscribe((res: any) => {
      if (res.Deleted) {
        this.toast.success('Movimiento eliminado');
        this.ObtenerMovimientos()
        
      }
    });
  }
}
