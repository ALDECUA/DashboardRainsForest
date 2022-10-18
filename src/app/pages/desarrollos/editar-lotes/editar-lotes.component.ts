import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-editar-lotes',
  templateUrl: './editar-lotes.component.html',
  styleUrls: ['./editar-lotes.component.scss']
})
export class EditarLotesComponent implements OnInit {

  public lote: any = {};
  test = ClassicEditor;

  public loading: boolean = false;

  constructor(
    public app: AppService,
    private desarrollos: DesarrollosService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe((params: any) => {
      const id = params.params.id;
      this.desarrollos.getLoteById(id).then((res: any) => {
        console.log(res);
        if (!res.error) {
          this.lote = res.lote;
        } else {
          this.toast.error('', 'Lote no encontrado');
          this.router.navigateByUrl('/crm/desarrollos');
        }
        this.loading = false;
      });
    })
  }

  public updateLoteActual() {
    
    this.desarrollos.updateLote(this.lote).subscribe((res: any) => {
      console.log(res);
      if (res.updated) {
        this.toast.success('', 'Se guardaron los cambios!');
      } else {
        this.toast.error('', 'No se guardaron los cambios');
      }
    });
  }

  public onChange({ editor }: ChangeEvent, index: number, field = 'Machote') {
    this.lote[field] = editor.getData();
    console.log(this.lote.Clausula1);
    console.log(this.lote.Clausula2);
    console.log(this.lote.Notas);
  }

  public logChange(event) {
  //  console.log(event.html);
   // console.log(this.lote.Clausula2);
  }
}
