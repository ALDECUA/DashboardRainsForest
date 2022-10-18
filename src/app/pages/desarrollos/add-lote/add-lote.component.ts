import { Component, OnInit } from '@angular/core';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Input } from '@angular/core';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-lote',
  templateUrl: './add-lote.component.html',
  styleUrls: ['./add-lote.component.scss']
})
export class AddLoteComponent implements OnInit {

  test = ClassicEditor;


  @Input() etapa: any;
  @Input() desarrollo: any;

  public lote: any = {};

  public loading: boolean = false;

  public config = {
    language: 'es',
    additionalLanguages: 'all'
  };

  constructor(
    private desarrollos: DesarrollosService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }

  public onChange({ editor }: ChangeEvent, index: number, field = 'Machote') {
    this.lote[field] = editor.getData();
  }

  public guardarLote() {

    this.lote.iddesarrollo = this.desarrollo;
    this.lote.idfase = this.etapa;


    this.loading = true;
    this.desarrollos.guardarLote(this.lote).subscribe((res: any) => {
      console.log(res);
      if (res.insert === true) {
        this.toast.success('', 'Lote guardado correctamente!', { timeOut: 3000 });
        this.lote = {};
      }
      this.loading = false;

    });
  }
}
