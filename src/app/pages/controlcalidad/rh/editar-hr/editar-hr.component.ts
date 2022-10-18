import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import { Subscription } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-editar-hr',
  templateUrl: './editar-hr.component.html',
  styleUrls: ['./editar-hr.component.scss']
})
export class EditarHrComponent implements OnInit, AfterViewInit, OnDestroy {

  public persona: any = {};
  public archivos: any = {};
  public baseFiles: string = this.app.dominio+'asesores/Content/img/archivos_usuarios/';
  public currentFile: string = '';
  public fileSanitized: any;
  public lotes: any[] = [];
  public notify: boolean = false;
  public pago: any = {};
  public desarrollos: any[] = [];
  public etapas: any[] = [];
  public lote_resp;
  public lotesdisponibles: any[] = [];
  public m2;
  public pm2;
  public codigoPais: string = '52';
  public loadingehr: boolean = false;
  public paises: any[] = [];
  public verificacion: any[] = [];
  private subscriptions = new Subscription();

  constructor(
    public app: AppService,
    private sanitizer: DomSanitizer,
    private activatedRouter: ActivatedRoute,
    private controlcalidad: ControlcalidadService,
    private toast: ToastrService,
    private auth: AuthService,
    private router: Router
  ) {
    this.app.currentModule = 'Control de calidad';
    this.app.currentSection = ' - HR de persona';

  }

  ngOnInit(): void {

    this.loadingehr = true;
    this.subscriptions.add(
      this.controlcalidad.getDesarrollos().subscribe((res: any) => {
        this.desarrollos = res.desarrollos;
        this.subscriptions.add(
          this.activatedRouter.paramMap.subscribe((params: any) => {
            const data = params.params;
            this.controlcalidad.getDatosHr(data).subscribe((res: any) => {
              this.archivos = res.archivos;
              this.persona = res.datos;
              this.lotes = res.lotes;
              this.pago = res.pago;
              let b = JSON.stringify(res.lotes[0]);
              this.lote_resp = JSON.parse(b);
              /* let a= JSON.stringify(res.persona);
              this.m2= JSON.parse(a); */
              let a = this.lotes[0].m2;
              this.m2 = a;
              let c = this.persona.PrecioM2;
              this.pm2 = c;
              this.getEtapas();
              this.getLotesDisponibles();
              Object.keys(this.archivos).forEach((key) => {
                this.archivos[key] = JSON.parse(this.archivos[key]) ? JSON.parse(this.archivos[key])[0] : null;
              });
            });
          })
        );
        setTimeout(() => {
          this.loadingehr = false;
        }, 1000);
      })
    );

    this.subscriptions.add(
      this.controlcalidad.obtenerverificacion().subscribe((res: any) => {
        this.verificacion = res.usuarios;
        console.log(this.verificacion);
      })
    );

    this.subscriptions.add(
      this.app.getPaises().subscribe((res: any) => {
        this.paises = res;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    })
  }

  public cargarArchivo(path) {
    this.fileSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseFiles + path);
    this.currentFile = this.baseFiles + path;
  }

  public setGentilicio() {
    this.persona.Nacionalidad = this.paises.find(elem => elem.Pais.toUpperCase() === this.persona.PaisNacimiento).Gentilicio.toUpperCase();
  }

  public cambiarStatus(estatus) {


    console.log(estatus);

    const User = this.auth.user.Nombre + ' ' + this.auth.user.Apellidos;

    /* textos */
    let texto = '';


    if (estatus === 1) {
      texto = "Al aceptar el HR confirmas que has revisado que la información sea correcta";
    } else if (estatus === 0) {
      texto = "Al No aceptar el HR confirmas que has revisado que la información sea correcta";
    } else if (estatus === 2) {
      texto = "Al cancelar el HR confirmas que has revisado que la información sea correcta";
    }
    console.log(this.persona.IdPersona, 'este es')
    Swal.fire({
      title: '¿Estas seguro?',
      text: `${texto}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let whoiam = 2;
        let name= '4.png';
        let inversionista = this.persona.IdPersona;
        let titulo = 'Se esta generando tu contrato';
        let link = 'null';
        this.controlcalidad.Notificacionpwa({
            name:name,
          whoiam:whoiam,
   inversionista:inversionista,
          titulo:titulo,
            link:link
          }).subscribe((res:any ) =>{
          console.log(res);
        })
        this.subscriptions.add(
          this.controlcalidad.actualizarStatusHr(
            {
              IdHR: this.persona.IdHR,
              Registro_Aceptado: estatus,
              User: User
            }
          ).subscribe((res: any) => {
            if (res.updated) {
              this.persona.Registro_Aceptado = estatus;
              Swal.fire({
                title: 'Se actualizo el estatus',
                width: 600,
                padding: '3em'
              });
            }
          })
        );
      }

   


    })
  }

  public cambiarStatusArchivos() {
    this.subscriptions.add(
      this.controlcalidad.actualizarStatusArchivos({ files: this.archivos, user: this.persona, notify: this.notify }).subscribe((res: any) => {
        if (res.error !== true) {
          this.toast.success('', 'Documentos actualizados!', { timeOut: 3000 });
        }
      })
    );
  }

  public actualizarDatosGenerales() {
    this.persona.usr_upd = this.auth.user.Nombre + ' ' + this.auth.user.Apellidos;
    this.persona.usr_upd,
    this.persona.IdHR,
    this.subscriptions.add(
      this.controlcalidad.actualizarDatosGeneralesHr(this.persona).subscribe((res: any) => {
        if (res.updated) {
          this.toast.success('', 'Datos de inversionista actualizados', { timeOut: 3000 });
        }
      })
    );
  }

  public actualizarBr() {
    const datos = this.persona;
    datos['Fch_Nacimiento'] = this.persona.Nac_Beneficiario;
    this.subscriptions.add(
      this.controlcalidad.actualizarBonoRed(datos).subscribe((res: any) => {
        if (res.updated) {
          this.toast.success('', 'Datos bono de red actualizados', { timeOut: 3000 });
        }
      })
    );
  }

  public eliminarBr() {

    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras recuperar el HR una vez eliminado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptions.add(
          this.controlcalidad.eliminarHr(
            {
              IdHR: this.persona.IdHR
            }
          ).subscribe((res: any) => {
            if (res.Deleted) {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado con exito',
                width: 600,
                padding: '3em',
                showConfirmButton: false,
                timer: 1000
              });
              this.router.navigateByUrl('/crm/controlcalidad/hr');
            }
          })
        );
      }
    })


  }


  public reenviarCorreoBienvenida() {
    this.subscriptions.add(
      this.controlcalidad.reenviarcorreo({
        IdPersona: this.persona.IdPersona,
        Email: this.persona.Email,
        Password: 1
      }).subscribe((res: any) => {
        if (res.updated) {
          Swal.fire({
            icon: 'success',
            title: 'Correo Reenviado',
            timer: 3000
          });
        }
      })
    );
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
  public CambiarPrecio() {
    this.persona.Precio_Final = this.persona.PrecioM2 * this.lotes[0].m2;
  }
  public getEtapas() {
    this.subscriptions.add(
      this.controlcalidad.getEtapas(this.lotes[0].IdDesarrollo).subscribe((res: any) => {
        this.etapas = res.fases;
      })
    );
  }
  public getLotesDisponibles() {
    this.subscriptions.add(
      this.controlcalidad.getLotes(this.lotes[0].IdDesarrollo, this.lotes[0].IdFase).subscribe((res: any) => {
        this.lotesdisponibles = res.lotes;
      })
    );
  }
  public CambioDes() {
    this.getEtapas();
    this.lotes[0].IdFase = null;
    this.lotes[0].IdLote = null;
  }
  public CambioEtapa() {
    this.getLotesDisponibles();
    this.lotes[0].IdLote = null;
  }
  cambiarLote(lote = null) {
    if (+this.lote_resp.IdLote === +lote) {
      this.persona.PrecioM2 = this.pm2;
      this.lotes[0].m2 = this.m2;
    }
    else
      for (let i = 0; i < this.lotesdisponibles.length; i++) {

        if (this.lotesdisponibles[i].idpropiedad == this.lotes[0].IdLote) {
          this.persona.PrecioM2 = this.lotesdisponibles[i].Precio_m2;
          this.lotes[0].m2 = this.lotesdisponibles[i].m2;
        }
      }
  }
  cambiarFormaPago() {

    if (this.lotes[0].FormaCompra == 1) {
      this.lotes[0].Mensualidades = 0;
      this.lotes[0].Enganche = 0;
    }
    if (this.lotes[0].FormaCompra == 2) {
      this.lotes[0].Mensualidades = this.lote_resp.Mensualidades;
      this.lotes[0].Enganche = this.lote_resp.Enganche;
    }
  }
  ActualizarDatosLote() {

    const User = this.auth.user.Nombre + ' ' + this.auth.user.Apellidos;

    this.subscriptions.add(
      this.controlcalidad.ActualizarLoteHR({
        IdHR: this.lotes[0].IdHR,
        IdLoteOld: this.lote_resp.IdLote,
        IdLote: this.lotes[0].IdLote,
        IdDesarrollo: this.lotes[0].IdDesarrollo,
        PrecioM2: this.persona.PrecioM2,
        PrecioFinal: this.persona.Precio_Final,
        MontoEnganche: this.lotes[0].Enganche,
        FormaCompra: this.persona.FormaCompra,
        MesesFinanciamiento: this.lotes[0].Mensualidades,
        User: User
      }).subscribe((res: any) => {
        if (res.updated == true) {
          Swal.fire(
            'Datos actualizados',
            'Los datos del lote han sido actualizados',
            'success'
          ).then(function () {
            window.location.reload();
          });
        }
      })
    );
  }

  public enviarSMS() {
    this.subscriptions.add(
      this.controlcalidad.enviarSMS({
        IdPersona: this.persona.IdPersona,
        Numero: '+' + this.persona.CodigoPais + this.persona.Num_Cel
      }).subscribe((result: any) => {
        if (result?.Status?.Code === 1) {
          this.toast.success('', 'Mensaje enviado!', { timeOut: 3000 });
        } else {
          this.toast.error(result.message, 'Hubo un problema', { timeOut: 3000 });
        }
      })
    );
  }

  public async validateMail(mail) {

    var url = "https://emailvalidation.abstractapi.com/v1/?api_key=0c67d1ee715b4f1c8d1466f90aaf9111&email=" + mail.target.value;

    fetch(url, {
      method: 'GET', // or 'PUT'
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        if ((response.is_valid_format.value === true && response.deliverability === "DELIVERABLE") || response.is_valid_format.value === true && response.deliverability === "UNKNOWN") {
          //exito
          document.querySelector(".errorMail").remove();
          document.querySelector(".email").classList.remove("is-invalid");
          document.querySelector(".email").classList.add("is-valid");
          let span = document.createElement("span");
          span.append("Email valido");
          span.style.color = "green";
          span.setAttribute("class", "errorMail");
          document.querySelector(".verifimail").append(span);
          setTimeout(() => {
            document.querySelector(".email").classList.remove("is-valid");
            document.querySelector(".errorMail").remove();
          }, 4000);

        } else {
          //no exito
          document.querySelector(".email").classList.add("is-invalid");
          let span = document.createElement("span");
          span.append("Email invalido");
          span.style.color = "red";
          span.setAttribute("class", "errorMail");
          document.querySelector(".verifimail").append(span);
        }
      });

  }

  public httpGetAsync(url, callback) {
    return new Promise((resolve, reject) => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
          callback(xmlHttp.responseText);
        resolve(xmlHttp.responseText);
      }
      xmlHttp.open("GET", url, true); // true for asynchronous
      xmlHttp.send(null);
    })
  }

  public printtext() {
  }

  public HRAntiguo() {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Al aceptar este HR no requerirá contrato y se marcará como cloncuido el proceso",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptions.add(
          this.controlcalidad.HR_Old(this.persona.IdHR).subscribe((res: any) => {
            if (res.updated == 1) {
              Swal.fire(
                'HR Previo al sistema',
                'Recuerda marcar el HR como aceptado cuando verifiques la información',
                'success'
              )
            }
          })
        );
      }
    })
  }
}
