import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DesarrollosService } from 'src/app/services/desarrollos.service';

@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
  styleUrls: ['./add-empresa.component.scss']
})
export class AddEmpresaComponent implements OnInit {

  public saving: boolean = false;

  public empresa: any = {};

  @Output() onSaveEmpresa = new EventEmitter<any>();

  constructor(
    private desarrollos: DesarrollosService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {

  }


  public guardarEmpresa() {

    this.saving = false;
    console.log(this.empresa);
    this.desarrollos.createEmpresa(this.empresa).subscribe((res: any) => {
      console.log(res);
      if (res.created === true) {
        this.empresa = {};
        this.toast.success('', 'Se guardo la empresa!', { timeOut: 3000 });
        this.onSaveEmpresa.emit(res.data);
      }
    });
  }
}
