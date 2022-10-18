import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Input } from '@angular/core';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-lote-masivo',
  templateUrl: './add-lote-masivo.component.html',
  styleUrls: ['./add-lote-masivo.component.scss']
})
export class AddLoteMasivoComponent implements OnInit {
  test = ClassicEditor;

  @Output() onInsertLotes = new EventEmitter<any[]>();
  @Input() etapa: any;
  @Input() desarrollo: any;
  public lote: any = {};

  public loading: boolean = false;

  public config = {
    language: 'es',
    additionalLanguages: 'all'
  };

  constructor(
    private element: ElementRef,
    private desarrollos: DesarrollosService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.lote.start = 1;
    this.lote.cantidad = 99;
  }

  public onChange({ editor }: ChangeEvent, index: number, field = 'Machote') {
    this.lote[field] = editor.getData();
    this.lote.clausula1;
    this.lote.clausula2;
  }

  public guardarLote() {

    this.lote.iddesarrollo = this.desarrollo;
    this.lote.idfase = this.etapa;

    /* validaciones */
    var lotebase = this.element.nativeElement.querySelector('.base');
    var lotealtura = this.element.nativeElement.querySelector('.altura');
    var lotem2 = this.element.nativeElement.querySelector('.m2');
    var loteprecio = this.element.nativeElement.querySelector('.precio');
    var lotepreciototal = this.element.nativeElement.querySelector('.PrecioTotal');
    var lotetablaje = this.element.nativeElement.querySelector('.Numtablaje');
    var invalidclausula1 = this.element.nativeElement.querySelector('.invalidclausula1');
    var invalidclausula2 = this.element.nativeElement.querySelector('.invalidclausula2');

    if (this.lote.base != undefined) {
      lotebase.classList.add('is-valid');
    }else{
      lotebase.classList.add('is-invalid');
      lotebase.focus();
      setTimeout(() => {
        lotebase.classList.remove('is-invalid');
      }, 2500);
      return
    }
    if (this.lote.altura != undefined) {
      lotealtura.classList.add('is-valid');
    }else{
      lotealtura.classList.add('is-invalid');
      lotealtura.focus();
      setTimeout(() => {
        lotealtura.classList.remove('is-invalid');
      }, 2500);
      return
    }
    if (this.lote.m2 != undefined) {
      lotem2.classList.add('is-valid');
    }else{
      lotem2.classList.add('is-invalid');
      lotem2.focus();
      setTimeout(() => {
        lotem2.classList.remove('is-invalid');
      }, 2500);
      return
    }
    if (this.lote.precio != undefined) {
      loteprecio.classList.add('is-valid');
    }else{
      loteprecio.classList.add('is-invalid');
      loteprecio.focus();
      setTimeout(() => {
        loteprecio.classList.remove('is-invalid');
      }, 2500);
      return
    }
    if (this.lote.preciototal != undefined) {
      lotepreciototal.classList.add('is-valid');
    }else{
      lotepreciototal.classList.add('is-invalid');
      lotepreciototal.focus();
      setTimeout(() => {
        lotepreciototal.classList.remove('is-invalid');
      }, 2500);
      return
    }
    if (this.lote.numtablaje != undefined) {
      lotetablaje.classList.add('is-valid');
    }else{
      lotetablaje.classList.add('is-invalid');
      lotetablaje.focus();
      setTimeout(() => {
        lotetablaje.classList.remove('is-invalid');
      }, 2500);
      return
    }
    if (this.lote.clausula1 != undefined) {
      invalidclausula1.classList.add('is-valid');
    }else{
      document.querySelector('.invalidclausula1').classList.add('display-block');
      setTimeout(() => {
        document.querySelector('.invalidclausula1').classList.remove('display-block');
      }, 2500);
      return
    }
    if (this.lote.clausula2 != undefined) {
      invalidclausula2.classList.add('is-valid');
    }else{
      document.querySelector('.invalidclausula2').classList.add('display-block');
      setTimeout(() => {
        document.querySelector('.invalidclausula2').classList.remove('display-block');
      }, 2500);
      return
    }

    this.loading = true;
    this.desarrollos.guardarLotesMasivo(this.lote).subscribe((res: any) => {
      if (res.error !== true) {
        this.onInsertLotes.emit(res);
        this.toast.success('', 'Lote guardado correctamente!', { timeOut: 3000 });
        this.lote = {};
      }
      this.loading = false;

    });
    
  }



}
