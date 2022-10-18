import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';

@Component({
  selector: 'app-add-contrato',
  templateUrl: './add-contrato.component.html',
  styleUrls: ['./add-contrato.component.scss']
})
export class AddContratoComponent implements OnInit {

  test = ClassicEditor;

  public contrato: any = {};

  @Output() onSaveContrato = new EventEmitter<any>();

  constructor(
    private desarrollos: DesarrollosService,
    private auth: AuthService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }

  public setEditorData({ editor }: ChangeEvent, field: string) {
    this.contrato[field] = editor.getData();
  }

  public onChangeEditor(event: CKEditor4.EventInfo, field = 'Machote') {
    this.contrato[field] = event.editor.getData();
  }

  public saveContrato(): void {

    if(this.contrato.Nombre === undefined) {
      this.toast.warning('', 'Escribe el nombre', {timeOut: 2000});
      return;
    }
    this.contrato.user_add = this.auth.user.IdUsuario;
    this.contrato.Activo = 1;
    //return;
    this.desarrollos.crearContrato(this.contrato).subscribe((res: any) => {
      console.log(res);
      if (res.insert === true) {
        this.toast.success('', 'Contrato guardado correctamente!');
        this.contrato = {};
        this.onSaveContrato.emit(res.record);
      }
    });
  }
}
