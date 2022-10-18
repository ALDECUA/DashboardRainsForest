import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContabilidadService } from 'src/app/services/contabilidad.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-editar-hrinv',
  templateUrl: './editar-hr.component.html',
  styleUrls: ['./editar-hr.component.scss']
})
export class EditarHrComponentInv implements OnInit, AfterViewInit {

  public persona: any = {};
  public archivos: any = {};
  public baseFiles: string = this.app.dominio +'asesores/Content/img/archivos_usuarios/';
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
  public user;
  public pago_n: any = {};
  public lotes_inversionistas: any = [];
  public arrayListasLotes: any[] = [];

  constructor(
    public app: AppService,
    private sanitizer: DomSanitizer,
    private activatedRouter: ActivatedRoute,
    private controlcalidad: ControlcalidadService,
    private toast: ToastrService,
    private auth: AuthService,
    private router: Router,
    private contabilidad: ContabilidadService
  ) {
    this.app.currentModule = 'Control de calidad';
    this.app.currentSection = ' - HR de persona';
  }

  ngOnInit(): void {

    this.user = this.auth.user;
    this.loadingehr = true;
    this.controlcalidad.getDesarrollos().subscribe((res: any) => {
      this.desarrollos = res.desarrollos;
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
          this.BuscarLotes();
          // this.getEtapas();
          // this.getLotesDisponibles();
          Object.keys(this.archivos).forEach((key) => {
            this.archivos[key] = JSON.parse(this.archivos[key]) ? JSON.parse(this.archivos[key])[0] : null;
          });


        });
      });
      setTimeout(() => {
        this.loadingehr = false;
      }, 1000);
    });

    this.app.getPaises().subscribe((res: any) => {
      this.paises = res;
    })

  }


  ngAfterViewInit(): void {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
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

  public cambiarStatus(estatus = 1) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Al aceptar el HR confirmas que has revisado que la información sea correcta",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.controlcalidad.actualizarStatusHr(
          {
            IdHR: this.persona.IdHR,
            Registro_Aceptado: estatus
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
        });
      }
    })
  }

  public cambiarStatusArchivos() {
    this.controlcalidad.actualizarStatusArchivos({ files: this.archivos, user: this.persona, notify: this.notify }).subscribe((res: any) => {
      if (res.error !== true) {
        this.toast.success('', 'Documentos actualizados!', { timeOut: 3000 });
      }
    });
  }

  public actualizarDatosGenerales() {
    const User = this.auth.user.Nombre + ' ' + this.auth.user.Apellidos;
    this.persona.usr_upd = User;
    this.controlcalidad.actualizarDatosGeneralesHr(this.persona).subscribe((res: any) => {
      if (res.updated) {
        this.toast.success('', 'Datos de inversionista actualizados', { timeOut: 3000 });
      }
    });
  }

  public actualizarBr() {
    const datos = this.persona;
    datos['Fch_Nacimiento'] = this.persona.Nac_Beneficiario;
    this.controlcalidad.actualizarBonoRed(datos).subscribe((res: any) => {
      console.log(res);
      if (res.updated) {
        this.toast.success('', 'Datos bono de red actualizados', { timeOut: 3000 });
      }
    });
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
        this.controlcalidad.eliminarHr(
          {
            IdHR: this.persona.IdHR
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
            this.router.navigateByUrl('/crm/controlcalidad/hr');
          }
        });
      }
    })


  }


  public reenviarCorreoBienvenida() {



    this.controlcalidad.reenviarcorreo({
      IdPersona: this.persona.IdPersona,
      Email: this.persona.Email,
      Password: 1
    }).subscribe((res: any) => {
      console.log(res);
      if (res.updated) {
        Swal.fire({
          icon: 'success',
          title: 'Correo Reenviado',
          timer: 3000
        });
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
  public CambiarPrecio(ind = 0) {
    this.lotes_inversionistas[ind].Precio_Total = (this.lotes_inversionistas[ind].Precio_m2 * this.lotes_inversionistas[ind].m2).toFixed(2);
  }
  public getEtapas() {
    this.controlcalidad.getEtapas(this.lotes[0].IdDes).subscribe((res: any) => {
      this.etapas = res.fases;
      console.log(this.etapas);
    });
  }
  public getLotesDisponibles() {
    this.controlcalidad.getLotesT(this.lotes[0].IdDes, this.lotes[0].IdFase).subscribe((res: any) => {
      this.lotesdisponibles = res.lotes;

    });
  }
  public CambioDes() {
    this.getEtapas();
  }
  public CambioEtapa() {
    this.getLotesDisponibles();
    this.lotes[0].IdLote = null;
  }
  public cambiarLote(ind = 0, idlote) {

    let lotenuevo = this.arrayListasLotes[ind].lotes.find(elem => +elem.IdLote === +idlote);
    this.lotes_inversionistas[ind].Precio_Total = lotenuevo.Precio_Total;
    this.lotes_inversionistas[ind].m2 = lotenuevo.m2;
    this.lotes_inversionistas[ind].Precio_m2 = lotenuevo.Precio_m2;
    /* console.log(this.lote_resp.IdLote + lote);
    if (+this.lote_resp.IdLote === +lote) {
      this.persona.PrecioM2 = this.pm2;
      this.lotes[0].m2 = this.m2;
      console.log("entro");
    }
    else
      for (let i = 0; i < this.lotesdisponibles.length; i++) {

        if (this.lotesdisponibles[i].idpropiedad == this.lotes[0].IdLote) {
          console.log(this.lotesdisponibles[i]);
          this.persona.PrecioM2 = this.lotesdisponibles[i].Precio_m2;
          this.lotes[0].m2 = this.lotesdisponibles[i].m2;
        }
      } */
  }

  public cambiarFormaPago() {

    if (this.lotes[0].FormaCompra == 1) {
      this.lotes[0].Mensualidades = 0;
      this.lotes[0].Enganche = 0;
    }
    
    if (this.lotes[0].FormaCompra == 2) {
      this.lotes[0].Mensualidades = this.lote_resp.Mensualidades;
      this.lotes[0].Enganche = this.lote_resp.Enganche;
    }
  }

  public ActualizarDatosLote(ind = 0) {
    this.controlcalidad.ActualizarLoteHR({
      IdHR: this.lotes_inversionistas[ind].IdHR,
      IdLoteOld: this.lote_resp.IdLote,
      IdLote: this.lotes_inversionistas[ind].IdLote,
      IdDesarrollo: this.lotes_inversionistas[ind].IdDes,
      PrecioM2: this.lotes_inversionistas[ind].Precio_m2,
      PrecioFinal: this.lotes_inversionistas[ind].Precio_Total,
      MontoEnganche: this.lotes_inversionistas[ind].Enganche,
      FormaCompra: this.lotes_inversionistas[ind].FormaCompra,
      MesesFinanciamiento: this.lotes_inversionistas[ind].Mensualidades,
      FechaCompra: this.lotes_inversionistas[ind].Fecha_Enganche
    }).subscribe((res: any) => {
      if (res.updated == true) {
        Swal.fire(
          'Datos actualizados',
          'Los datos del lote han sido actualizados',
          'success'
        ).then(function () {

        });
      }
    });
  }

  public enviarSMS() {
    this.controlcalidad.enviarSMS({
      IdPersona: this.persona.IdPersona,
      Numero: '+' + this.persona.codigoPais + this.persona.Num_Cel
    }).subscribe((result: any) => {
      console.log(result);
      if (result?.Status?.Code === 1) {
        this.toast.success('', 'Mensaje enviado!', { timeOut: 3000 });
      }
    })
  }

  public async validateMail(mail) {
    console.log(mail.target.value);

    var url = "https://emailvalidation.abstractapi.com/v1/?api_key=0c67d1ee715b4f1c8d1466f90aaf9111&email=" + mail.target.value;

    fetch(url, {
      method: 'GET', // or 'PUT'
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log(response);
        console.log(response.is_valid_format);
        console.log(response.deliverability);

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
    console.log("xxx");
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
        this.controlcalidad.HR_Old(this.persona.IdHR).subscribe((res: any) => {
          if (res.updated == 1) {
            Swal.fire(
              'HR Previo al sistema',
              'Recuerda marcar el HR como aceptado cuando verifiques la información',
              'success'
            )
          }
        });
      }
    })
  }

  public RegistrarPago() {
    if (
      this.pago_n.Concepto == null ||
      this.pago_n.monto == null ||
      this.pago_n.rep == null ||
      this.pago_n.comprobante == null ||
      this.pago_n.fechapago == null
    ) {
      this.toast.error('', 'Todos los campos son requeridos', {
        timeOut: 3000,
      });
      return;
    }
    let insertados = 0;
    for (let i = 0; i < this.pago_n.rep; i++) {
      this.controlcalidad
        .registrarPago({
          IdHR: this.pago_n.IdHR,
          IdTipoPago: this.pago_n.tipopago,
          Referencia: this.lotes[0].Desarrollo + ' Lote ' + this.lotes[0].nombre,
          Importe: this.pago_n.monto,
          IdStatus: 1,
          FechaRegistro: new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '),
          FechaPago: this.pago_n.fechapago,
          Usr: 1,
          ComprobantePago: this.pago_n.comprobante,
          IdConcepto: this.pago_n.Concepto
        })
        .subscribe((response: any) => {
          if (response.error !== true) {
            console.log(response);
            if (response.insert == true) {
              insertados++;
              this.toast.success(
                '',
                'Se ha registrado el pago correctamente'
              );
            }
          }
          else {
            this.toast.error(
              '',
              'Ocurrio un error interno, intenta nuevamente'
            );
          }
        });
      console.log(insertados);
    }

  }


  public subirImagen(event) {
    console.log(event);
    let formData = new FormData();
    formData.append('foto', event[0], 'imagen.png');
    formData.append('IdInversionista', this.persona.IdPersona);
    this.contabilidad.SubirComp(formData).subscribe((res: any) => {
      if (res == '{"error":1,"message":"No se subio la imagen"}') {
        this.toast.warning(
          '',
          'Ocurrio un error al cargar la imagen, intenta nuevamente'
        );
      } else {
        this.pago_n.comprobante = res;
      }
    });
  }


  public BuscarLotes() {
    this.controlcalidad
      .getLotesInversionista(this.persona.IdPersona)
      .subscribe((lotes: any) => {
        lotes.forEach((value, i) => {
          this.arrayListasLotes[i] = [];
        });

        this.lotes_inversionistas = lotes;

        this.lotes_inversionistas.forEach((elem, i) => {
          this.obtenerFases(elem.IdDes, i);
          this.obtenerLotes(elem.IdDes, elem.IdFase, i);
        });
      });
  }

  public obtenerFases(des, index, event = false) {
    if (event) {
      this.lotes_inversionistas[index].IdFase = null;
      this.arrayListasLotes[index].fases = [];
    }

    this.controlcalidad.getEtapas(des).subscribe((res: any) => {
      if (res.error !== true) {
        this.arrayListasLotes[index].fases = res.fases;
      }
    })
  }

  public obtenerLotes(des, etapa, index, event = false) {

    if (event) {
      this.lotes_inversionistas[index].IdLote = null;
      this.arrayListasLotes[index].lotes = [];
    }

    this.controlcalidad.getLotesT(des, etapa).subscribe((res: any) => {
      if (res !== true) {
        this.arrayListasLotes[index].lotes = res.lotes;
      }
    });
  }

  public concatLote(lote) {
    this.arrayListasLotes.push({ lotes: [], fases: [] });
    this.lotes_inversionistas.push(lote);
    this.obtenerFases(lote.IdDes, this.lotes_inversionistas.length - 1);
    this.obtenerLotes(lote.IdDes, lote.IdFase, this.lotes_inversionistas.length - 1);
  }
}
