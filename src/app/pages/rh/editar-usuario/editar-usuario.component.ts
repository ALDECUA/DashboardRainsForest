import { ActivatedRoute, Router } from '@angular/router';
import { RhService } from 'src/app/services/rh.service';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  public persona: any = {};

  public scs: any[] = [];
  public ilr: any[] = [];
  public isr: any[] = [];

  public archivos: any = {};

  public baseFiles: string = this.app.dominio+'asesores/Content/img/archivos_usuarios/';
  public currentFile: string = '';
  public fileSanitized: any;
  public notify: boolean = false;
  public paises: any[] = [];

  constructor(public app: AppService,
    private rhService: RhService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer,
    private route: Router,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: any) => {
      const id = params.params.id;
      this.rhService.getObtenerPersona(id).subscribe((res: any) => {
        console.log(res);
        this.persona = res.persona[0];
        this.archivos = res.archivos[0];
        this.persona.IdPersona = id;

        Object.keys(this.archivos).forEach((key) => {
          this.archivos[key] = JSON.parse(this.archivos[key]) ? JSON.parse(this.archivos[key])[0] : null;
        });

        this.rhService.obtenerILideres(this.persona.IdSCom).then((res: any) => {
          this.ilr = res.personas;
        })

        this.rhService.obtenerISenior(this.persona.IdILider).then((res: any) => {
          this.isr = res.personas;
        })
      })
    })


    this.rhService.obtenerSociosComerciales().then((res) => {
      this.scs = res.personas;
    });

    fetch(environment.api + 'webapp/paises').then((res) => res.json()).then((res) => {
      if (res.error !== true) {
        this.paises = res;
      }
    });
  }

  public cargarArchivo(path) {
    this.fileSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseFiles + path);
    this.currentFile = this.baseFiles + path;
    console.log(this.currentFile);
  }

  public guardarDatosPersona() {
    console.log(this.persona);
    this.rhService.updatePersonaGeneral(this.persona).subscribe((response: any) => {
      if (response.inserted === true) {
        let timerInterval
        Swal.fire({
          title: 'Datos personales actualizados!',
          html: '<b></b>',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b: any = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        });
      }
    });
  }

  public guardarDatosBancarios() {
    this.rhService.updateBancoGeneral(this.persona).subscribe((response: any) => {
      if (response.updated === true) {
        let timerInterval
        Swal.fire({
          title: 'Datos bancarios actualizados!',
          html: '<b></b>',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b: any = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        });
      }
    })
  }

  public cambiarStatusArchivos() {
    this.rhService.actualizarStatusArchivos({ files: this.archivos, user: this.persona, notify: this.notify }).subscribe((res: any) => {
      if (res.updated) {
        this.toast.success('', 'Documentos actualizados!', { timeOut: 3000 });
      }
    });
  }

  public loadIls() {
    this.rhService.obtenerILideres(this.persona.IdSCom).then((res: any) => {
      this.ilr = res.personas;
    })
  }

  public loadscoms() {
    this.rhService.obtenerISenior(this.persona.IdILider).then((res: any) => {
      this.isr = res.personas;
    })
  }

  public eliminarReclu(){

    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras recuperar a la persona una vez eliminado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rhService.eliminarHr(
          {
            IdHR: 0 ,
            IdPersona: this.persona.IdPersona
          }
        ).subscribe((res: any) => {
          console.log(res);
          if (res.Deleted) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado con exito',
              width: 600,
              padding: '3em',
              showConfirmButton: false,
              timer: 1000
            });
            this.route .navigateByUrl('/crm/rh/reclutamiento');
          }
        });
      }
    })
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

