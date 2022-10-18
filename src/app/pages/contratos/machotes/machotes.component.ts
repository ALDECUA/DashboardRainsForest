import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-machotes',
  templateUrl: './machotes.component.html',
  styleUrls: ['./machotes.component.scss']
})
export class MachotesComponent implements OnInit, AfterViewInit {

  public contratos: any[] = [];

  public saving: boolean = false;

  public test = ClassicEditor;

  public buttonAction: boolean = false;

  public editorCOnfig: any = {
  }

  public config = {

    language: 'es',
    additionalLanguages: 'all'
  };

  public isLoading: boolean = false;
  public isLoadingMachote: boolean = false;

  public listaDeCeldas: any[] = [];

  constructor(
    public app: AppService,
    private desarrollos: DesarrollosService,
    private auth: AuthService,
    private toast: ToastrService,
  ) {
    this.app.currentModule = 'Contratos';
    this.app.currentSection = '- Machotes';
  }

  public machoteSeleccionado: any = null;

  public celdaSeleccionada: any = null;

  public canvasModal: any;

  ngOnInit(): void {


    this.isLoading = true;

    this.desarrollos.getContratos().toPromise().then((res: any) => {
      if (res.unauthorized) {
        alert("Su sesión no es valida, posiblemente haya caducado");
        this.auth.logout();
      }
      if (!res.error) {
        console.log(res.contratos)
        this.contratos = res.contratos;
        this.isLoading = false;
      }

    })
  }

  ngAfterViewInit(): void {
    var myOffcanvas = document.getElementById('offcanvasExample');
    this.canvasModal = new bootstrap.Offcanvas(myOffcanvas);
  }

  public editarContrato(contrato, titulo = null) {
    this.saving = true;
    contrato['Titulo'] = titulo;
    this.desarrollos.updateContrato(contrato).subscribe((res: any) => {
      this.buttonAction = false;
      console.log(res)
      if (res.updated) {
        this.toast.success('', 'Cambios guardados!', { timeOut: 2000 });
      }
      this.saving = false;
    });
  }

  public onChange({ editor }: ChangeEvent, index: number, field = 'Machote') {
    console.log("xxx");
    const data = editor.getData();
    this.contratos[index][field] = data;
  }

  public onChangeEditor(event: CKEditor4.EventInfo, field = 'Machote') {
    this.machoteSeleccionado[field] = event.editor.getData();
  }

  public onChangeCelda(event: CKEditor4.EventInfo) {
    this.celdaSeleccionada.ContenidoCelda = event.editor.getData();
  }

  public openPDF(id) {
    this.desarrollos.verPdfContrato(id);
  }

  public pushMachote(event) {
    this.contratos.push(event);
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  public seleccionarContrato(elem) {
    this.machoteSeleccionado = elem;
    this.celdaSeleccionada = null;
    this.canvasModal.show();
    this.listaDeCeldas = [];
    this.desarrollos.obtenerCeldas(this.machoteSeleccionado.IdContrato).subscribe((res: any) => {
      if (res.error !== true) {
        document.getElementById('pills-home-tab').click();
        this.listaDeCeldas = res;
      }
    });
  }

  public save() {
    this.buttonAction = true;
    if (this.celdaSeleccionada !== null) {
      this.actualizarCeldaSeleccionada();
    } else {
      console.log(this.celdaSeleccionada,'ELSE')
      this.editarContrato(this.machoteSeleccionado);
    }
  }

  public saveAll() {
    this.editarContrato(this.machoteSeleccionado);
    this.listaDeCeldas.forEach((celda) => {
      this.desarrollos.actualizarCelda(celda).subscribe((res: any) => {
        if (res.Updated === 1) {
          this.toast.info('La celda ' + celda.NombreCelda + ' fue actualizada', celda.NombreCelda + ' se guardo!', { timeOut: 3000, positionClass: 'toast-top-left' });
          this.buttonAction = false;
        }
      });
    });
  }

  public saveAndClose() {
    this.buttonAction = true;
    if (this.celdaSeleccionada !== null) {
      this.actualizarCeldaSeleccionada();
    } else {
      this.editarContrato(this.machoteSeleccionado);
    }
    this.canvasModal.hide();
  }

  public async saveAs() {

    document.getElementById('offcanvasExample').removeAttribute('tabindex');

    const { value: titulo } = await Swal.fire({
      title: 'Guardar como:',
      input: 'text',
      inputPlaceholder: 'Escribe un nombre',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });


    if (titulo) {

      console.log(titulo);
      if (this.celdaSeleccionada) {
        this.celdaSeleccionada['NombreCelda'] = titulo;
        this.actualizarCeldaSeleccionada();
      } else {
        this.machoteSeleccionado['Nombre'] = titulo;
        this.editarContrato(this.machoteSeleccionado, titulo);
      }
      this.canvasModal.hide();
    }
  }

  public async iniciarDocumento() {

    const { value: titulo } = await Swal.fire({
      title: 'Crear documento:',
      input: 'text',
      inputPlaceholder: 'Escribe un nombre',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (titulo) {
      this.desarrollos.crearContrato({ Nombre: titulo }).subscribe((res: any) => {
        console.log(res);
        if (res.insert) {
          this.machoteSeleccionado = res.record;
          this.canvasModal.show();
        }
        else
          this.toast.error('No se creo el documento', 'Intente nuevamente o contacte a soporte');
      })
    }
  }


  public async anadirCelda() {

    document.getElementById('offcanvasExample').removeAttribute('tabindex');

    const { value: formValues } = await Swal.fire({
      title: 'Agregar una celda',
      html:
        `<input id="nombrecelda" class="swal2-input" placeholder="Nombre, ejemplo: Clausula 1">
          <select id="tipocelda" class="swal2-select">
          <option value="0" disabled>Tipo de celda</option>
          <option value="1" selected>Clausula</option>
          <option value="2">Generales</option>
          <option value="3">Chepina</option>
          </select>
        `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          NombreCelda: (document.getElementById('nombrecelda') as HTMLInputElement).value,
          TipoCelda: (document.getElementById('tipocelda') as HTMLInputElement).value
        }
      }
    })

    if (formValues) {
      if (['', ' ', null, undefined].includes(formValues.NombreCelda)) {
        return;
      }
      formValues['IdContrato'] = this.machoteSeleccionado.IdContrato;
      formValues['Identificador'] = '@@' + (formValues.NombreCelda.toLocaleUpperCase().replace(/ /g, '')).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      console.log(formValues);
      this.desarrollos.addCelda(formValues).subscribe((res: any) => {
        console.log(res);
        if (res.Inserted === 1) {
          this.toast.success('', 'Se añadio la celda al contrato selecciconado', { timeOut: 2000 });
          this.desarrollos.obtenerCeldas(this.machoteSeleccionado.IdContrato).subscribe((res: any) => {
            if (res.error !== true) {
              this.listaDeCeldas = res;
            }
          });
        }
      });
    }
  }

  public seleccionarCelda(elem) {
    this.celdaSeleccionada = elem;
  }

  public actualizarCeldaSeleccionada() {
    this.desarrollos.actualizarCelda(this.celdaSeleccionada).subscribe((res: any) => {
      if (res.Updated === 1) {
        this.toast.success('La celda ' + this.celdaSeleccionada.NombreCelda + ' fue actualizada', 'Cambios guardados!', { timeOut: 2000 });
        this.buttonAction = false;
      }
    });
  }

  public copiarIdentificadorCelda() {
    navigator.clipboard.writeText(this.celdaSeleccionada.Identificador);
    this.toast.success('', 'Texo copiado en el portapapeles', { timeOut: 1000, positionClass: 'toast-top-left' });
  }

  public eliminarCeldaSeleccionada() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas segur@?',
      text: "La celda sera eliminada permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SI',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.desarrollos.eliminarCelda(this.celdaSeleccionada).subscribe((res) => {
          const indexcelda = this.listaDeCeldas.findIndex(celda => celda.IdCelda === this.celdaSeleccionada.IdCelda);
          this.listaDeCeldas.splice(indexcelda, 1);
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            '',
            'success'
          )
        })
      }
    })
  }

  public previsualizarMachote(id) {
    window.open('https://crm-fx.herokuapp.com/contratos/obtener/pdf/'+id, 'blank');
  }

}
