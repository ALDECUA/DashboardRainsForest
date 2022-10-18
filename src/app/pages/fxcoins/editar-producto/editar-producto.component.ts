import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute } from '@angular/router';
import { FxcoinsService } from 'src/app/services/fxcoins.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {

  public producto: any = {};
  test = ClassicEditor;
  public editor: any = [];

  public config = {
    language: 'es',
    additionalLanguages: 'all'
  };

  constructor(
    public app: AppService,
    private activatedRouter: ActivatedRoute,
    private fxcoins: FxcoinsService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params: any) => {
      const id = params.params.id;
      this.fxcoins.getProducto(id).subscribe((producto: any) => {
        this.producto = producto[0];
        console.log(this.producto);
      });
    });

  }

  public onChange({ editor }: ChangeEvent, index: number, field = 'Machote') {
    this.producto[field] = editor.getData();
    this.producto.Nota;
    this.producto.Descripcion;
    console.log(this.producto.Nota);
    console.log(this.producto.Descripcion);
  }

  public actualizarProducto() {
    this.fxcoins.updateProducto(this.producto).subscribe((result: any) => {
      console.log(result);
      if(result.updated == true)
      {
        this.toast.success('', 'Información del producto actualizada', { timeOut: 3000 });
      }
      else
      {
        this.toast.error('', 'No se actualizaron los datos, intente nuevamente o reporte este mensaje', { timeOut: 3000 });
      }
    });
  }

  public restrictNumeric(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
   }
}
