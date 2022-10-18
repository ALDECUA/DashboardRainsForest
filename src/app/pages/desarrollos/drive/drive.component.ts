import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {

  public data: any = {};
  public file: any;
  public uploading: boolean = true;
  public ruta: string = '';

  public files: any[] = [];

  public desarrollosTxt = {
    '8': 'mantra',
    '10': 'villamar',
    '11': 'kunal',
    '3': 'zazil-ha',
    '4': 'koomuna',
    '5': 'via-palmar',
    '7': 'horizontes'
  };

  img: string = 'mantra-card.png';

  public archivoPorEditar = null;

  constructor(
    public app: AppService,
    public desarrollosService: DesarrollosService,
    public auth: AuthService,
    private toast: ToastrService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
  }

  public obtenerRuta() {
    this.ruta = $("#desarrollo :selected").text() + '/' + $("#etapa :selected").text() + '/' + $("#carpeta :selected").text();
    this.ruta = this.ruta.replace(/ /g, '');
    console.log(this.ruta);
  }

  test() {
    console.log(1);
    
  }

  public setFile(files: FileList, ev) {
    // console.log('---setFile---');
    // console.log(ev);
    // console.log(files[0]);
    
    this.file = files[0];

    // Si el titulo no está en blanco, se habilita el botón de subir archivo
    if (this.el.nativeElement.querySelector('#titulo').value.length > 0) {
      this.uploading = false;
    }
  }

  public habilitarUpload(ev) {
    // Si el titulo no está en blanco y el file input no está vacío, se habilita el botón de subir archivos
    if (ev.length > 0 && this.el.nativeElement.querySelector('#subirDoc').files[0] != undefined) {
      this.uploading = false;
      // console.log('archivo subido');
    } else {
      this.uploading = true;
      // console.log('no se puede subir el archivo');
    }
  }

  public uploadDocument() {

    // this.uploading = true;
    
    let formdata = new FormData();

    formdata.append('desarrollo', this.desarrollosTxt['' + this.data.desarrollo]);
    formdata.append('etapa', this.data.etapa);
    formdata.append('carpeta', this.data.carpeta);
    formdata.append('titulo', this.data.titulo);
    formdata.append('IdUsuario', this.auth.user.IdUsuario);
    formdata.append('IdDesarrollo', this.data.desarrollo);
    formdata.append('documento', this.file);


    console.log('this.file');
    console.log(this.file);

    // console.log('---uploadDocument---');
    // for (var pair of formdata.entries()) {
    //   console.log(pair[0]+ ': ' + pair[1]); 
    // }


    this.desarrollosService.uploadDriveFile(formdata).subscribe((result) => {
      console.log('result');
      console.log(result);
      console.log(this.data);
      this.desarrollosService.saveNameFile({
        IdDesarrollo: this.data.desarrollo,
        IdEtapa: this.data.etapa,
        Documento: result,
        Carpeta: this.data.carpeta,
        Notas: '',
        Titulo: result
      }).subscribe((res: any) => {

        if (res.error !== true) {

          this.toast.success('', 'EL documento se subió correctamente!', { timeOut: 3000 });

        }

        // this.uploading = false;
        
        this.data.titulo = '';
        $('#subirDoc').val('');

        const data = {
          IdDesarrollo: +this.data.desarrollo,
          IdEtapa: +this.data.etapa,
          Carpeta: this.data.carpeta,
          Status: Number(this.data.status)
        };
        
        // location.reload();
        this.desarrollosService.obtenerDocumentosFiltrados(data).subscribe((res: any) => {
          if (res.error !== true) {
            this.files = res;
          }
          this.uploading = true;
        });
      })
    });
  }

  public filterDocuments(ev) {

    // console.log(ev.target.name);
    // console.log(ev.target.value);
    // console.log('disabled');
    // console.log(this.el.nativeElement.querySelector('#etapa').disabled);
    // console.log(this.el.nativeElement.querySelector('#carpeta').value);

    // Habilitar los input
    if (ev.target.name == 'desarrollo') {
      $("#etapa").removeAttr("disabled");
    }
    else if (ev.target.name == 'etapa') {
      $("#carpeta").removeAttr("disabled");
    }
    else {
      if (this.el.nativeElement.querySelector('#etapa').disabled == false && this.el.nativeElement.querySelector('#carpeta').value != 'undefined') {
        $("#agregarArchivo").removeAttr("disabled");
      }
    }

    if (ev.target.name == 'carpeta') {
      $("#status").removeAttr("disabled");
    }

    const data = {
      IdDesarrollo: +this.data.desarrollo,
      IdEtapa: +this.data.etapa,
      Carpeta: this.data.carpeta,
      Status: Number(this.data.status)
    };

    this.desarrollosService.obtenerDocumentosFiltrados(data).subscribe((res: any) => {
      // Actualizamos la imagen de fondo de los archivos
      if (ev.target.name == 'desarrollo') {
        switch (ev.target.value) {
          case '3': this.img = 'zazilfile.png';
            break;
          case '4': this.img = 'koomunafile.png';
            break;
          case '5': this.img = 'viapalmarfile.png';
            break;
          case '7': this.img = 'horizontes-card.png';
            break;
          case '8': this.img = 'mantra-card.png';
            break;
          case '10': this.img = 'card-villamar.jpg';
            break;
          case '11': this.img = 'kunal-card.png';
            break;
          default:
            break;
        }
      }

      if (res.error !== true) {
        this.files = res;
      }
      this.uploading = true;

      let arr = res;
      console.log('---arr---');
      console.log(arr);
      console.log(this.files.length);
      
      // arr.forEach(element => {
      //   if (element.IdStatus == 0) {
      //     console.log('Documento eliminado');
      //   } else {
      //     console.log(element);
      //   }
      // });
      // console.log('obtenerDocumentosFiltrados');
      // console.log(res);
    });
  }

  public openFile(data) {
    window.open(
      this.app.dominio + 'asesores/Content/desarrollos/' +
      this.desarrollosTxt[data.IdDesarrollo] + '/etapa-' + data.IdEtapa + '/' + data.Carpeta + '/' + data.Titulo,
      'blank'); // data.Titulo
  }

  public editarArchivo(archivo) {
    this.archivoPorEditar = archivo;
    document.getElementById('editarArchivo').click();
    // console.log('this.archivoPorEditar');
    // console.log(this.archivoPorEditar);
  }

  // Eliminamos la extensión del archivo que vamos subir para mandarle solo el nombre al formdata
  public getBeforePlus(str) {
    return str.substring(0, str.indexOf("."));
    /* This gets a substring from the beginning of the string 
       to the first index of the character "+".
    */
  }

  public setEditFile(files: FileList) {
    this.file = files[0];
    // console.log('FUNCIÓN EDIT FILE');
    // console.log('this.file');
    // console.log(this.file.name);
    // console.log('this.archivoPorEditar');
    // console.log(this.archivoPorEditar);

    // this.uploading = true;

    let formdata = new FormData();

    let titulo = this.getBeforePlus(this.file.name);
    // console.log('titulo')
    // console.log(titulo);

    formdata.append('desarrollo', this.desarrollosTxt['' + this.archivoPorEditar.IdDesarrollo]);
    formdata.append('etapa', this.archivoPorEditar.IdEtapa);
    formdata.append('carpeta', this.archivoPorEditar.Carpeta);
    formdata.append('titulo', titulo); //titulo
    formdata.append('IdUsuario', this.auth.user.IdUsuario);
    formdata.append('IdDesarrollo', this.archivoPorEditar.IdDesarrollo);
    formdata.append('documento', this.file);

    // console.log('---setEditFile---');
    // for (var pair of formdata.entries()) {
    //   console.log(pair[0]+ ': ' + pair[1]); 
    // }

    // this.uploading = false;
    this.desarrollosService.uploadDriveFile(formdata).subscribe((result) => {
      console.log('result');
      console.log(result);
      this.desarrollosService.editarArchivoDrive({
        IdArchivoDrive: this.archivoPorEditar.IdArchivoDrive,
        Document: this.file.name,
        Titulo: this.file.name,
        IdArchivo: this.archivoPorEditar.IdArchivoDrive,
        Img_Archivo: this.file.name
      }).subscribe((res) => {
        console.log('res');
        console.log(res);
        this.toast.success('', 'EL documento se subió correctamente!', { timeOut: 3000 });

        const data = {
          IdDesarrollo: +this.data.desarrollo,
          IdEtapa: +this.data.etapa,
          Carpeta: this.data.carpeta,
          Status: Number(this.data.status)
        };
        this.desarrollosService.obtenerDocumentosFiltrados(data).subscribe((res: any) => {
          
          if (res.error !== true) {
            this.files = res;
          }
          // location.reload();
          this.uploading = true;
        });
      })
    });
  }

  public eliminarArchivo(doc) {
    let titulo = '';
    let mensaje = '';
    if (doc.IdStatus == 1) {
      titulo = '¿Estás segur@ de eliminar el documento?';
      mensaje = 'Documento eliminado!';
    } else {
      titulo = '¿Estás segur@ de activar el documento?';
      mensaje = 'Documento activado!';
    }
    Swal.fire({
      title: titulo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.desarrollosService.eliminarArchivoDrive({ IdArchivo: doc.IdArchivoDrive }).subscribe((res: any) => {
          if (res.Updated === 1) {
            this.toast.success('', mensaje, { timeOut: 2000 });
            console.log(res);

            const data = {
              IdDesarrollo: +this.data.desarrollo,
              IdEtapa: +this.data.etapa,
              Carpeta: this.data.carpeta,
              Status: Number(this.data.status)
            };
            this.desarrollosService.obtenerDocumentosFiltrados(data).subscribe((res: any) => {
              if (res.error !== true) {
                this.files = res;
              }
              this.uploading = true;
            });
            // location.reload();
          }
        })
      }
    })
  }

  public ModoficarNombreArchivo(doc) {
    console.log('doc');
    console.log(doc);

    Swal.fire({
      title: 'NUEVO NOMBRE',
      text: 'Guion unico caracter aceptado',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        let items: any = [];
        items = ['.', '[', ']', '+', '¿', ',', '=', '(', ')', '/', '!', '"', '#', '$', '%', '&', '¨', ' ', '°', '|', '¬', '¡', '*', '}', '{', '<', '>'];
        var split = new String(result.value);
        console.log(split);
        console.log(items.length);
        let termino = items.length;
        let terminoa = split.length;
        let x = 0;

        for (let i = 0; i < terminoa;) {
          for (let o = 0; o < termino;) {
            if (split[i] === items[o]) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
              o = termino;
              i = terminoa;
              x = 0;
            } else { x = 1; } o++
          } i++
        }

        if (x == 1) {
          var str = doc.Documento;
          var splitted = str.split('.');

          console.log(result.value + '.' + splitted[1]);
          var Nombre = result.value + '.' + splitted[1];

          console.log('this.data.titulo');
          console.log(this.data.titulo);

          this.desarrollosService.ModificarNombreArchivo({
            IdArchivo: doc.IdArchivoDrive,
            NewNombre: Nombre
          }).subscribe((res: any) => {

            if (res.updated === 1) {
              this.toast.success('', 'Nombre Modificado!', { timeOut: 2000 });
              doc.Documento = Nombre;
            }
          })
        }
      }
    })
  }
}

