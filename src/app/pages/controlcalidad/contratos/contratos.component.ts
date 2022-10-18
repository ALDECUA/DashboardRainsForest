import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Console } from 'console';

declare var bootstrap: any;

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss'],
})
export class ContratosComponent implements OnInit, AfterViewInit {

  public contratos: any[] = [];
  public porenviar: any[] = [];
  public pendientes: any[] = [];
  public finalizados: any[] = [];
  public bloquedBtns: any[] = [];

  public selectedContrato: string = null;
  public selectedIdHr: number = 1;
  public currentPDfUrl: string =
    'https://www.proturbiomarspa.com/files/_pdf-prueba.pdf';
  public loadingPreview: boolean = false;
  public dataUrl: any = 'https://www.proturbiomarspa.com/files/_pdf-prueba.pdf';
  public loading: boolean = false;
  public loaders: any = {
    token: false,
    sending: false,
    updating: false,
  };
  public user;
  public infoContrato: any;
  public celdas: any;
  public documentos: any = {};
  public IDHR: any = {};
  public loadercontrato: boolean = false;
  public themodal: any;
  public Mostrar: any;
  public OcultarTest: any;
  public OcultarTest2: any;
  public Ocultar = 0


  constructor(
    public app: AppService,
    private controlcalidad: ControlcalidadService,
    private toast: ToastrService,
    public auth: AuthService
  ) {
    this.app.currentModule = 'Control de calidad';
    this.app.currentSection = ' - Contratos HR';
  }

  ngOnInit(): void {
    this.init();
    this.user = this.auth.user;
    this.Mostrar = 0
  }

  ngAfterViewInit(): void {
    this.themodal = new bootstrap.Modal(
      document.getElementById('previewContratoModal'),
      {
        keyboard: false,
      }
    );
  }

  private init() {
    this.loading = true;
    this.controlcalidad.getStatusContratos().subscribe((response: any) => {
      this.contratos = response.contratos;

      this.porenviar = this.contratos.filter(
        (element) => element.ENVIADO === null && element.FIRMADO === null
      );
      console.log(this.porenviar)
      this.pendientes = this.contratos.filter(
        (element) => element.ENVIADO === 1 && element.FIRMADO === null
      );
      this.finalizados = this.contratos.filter(
        (element) => element.ENVIADO === 1 && element.FIRMADO === 1
      );

      this.loading = false;

      /* this.loaders.updating = false; */
    });
  }

  public enviarcontrato(idcontrato, showdeny = true) {
    console.log(idcontrato)
    var myModal = new bootstrap.Modal(
      document.getElementById('previewContratoModal'),
      {
        keyboard: false,
      }
    );
    Swal.fire({
      title: 'Confirmación',
      text: 'El contrato se marcará como generado, ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaders.token = true;
        this.controlcalidad.generarFADToken().subscribe(
          (res: any) => {
            console.log(res);
            if (res.seted === true) {
              this.loaders.sending = true;
              this.controlcalidad.enviarFADtoSign(idcontrato).subscribe(
                (res: any) => {
                  console.log(res);
                  if (res.created === true) {
                    this.toast.success(
                      '',
                      'Se envio el contrato digital para firmar de manera correcta!',
                      { timeOut: 4000 }
                    );
                    this.init();
                  }
                  this.loaders.sending = false;
                },
                (err) => {
                  this.loaders.sending = false;
                  this.toast.error(
                    '',
                    'El servidor esta teniendo problemas en estos momentos',
                    { timeOut: 4000 }
                  );
                }
              );
            }
            this.loaders.token = false;
          },
          (err: any) => {
            this.loaders.token = false;
            this.toast.error(
              '',
              'El servidor esta teniendo problemas en estos momentos',
              { timeOut: 4000 }
            );
          }
        );
        this.controlcalidad.EnviarContrato({ HR: idcontrato.IDHR, Usuario: this.user.Nombre + " " + this.user.Apellidos }).subscribe((res: any) => {
          myModal.hide();
        });
      } else if (result.isDenied) {
        this.previewContrato(
          this.contratos.filter((contrato) => contrato.IDHR === idcontrato)[0]
        );
        myModal.show();
      }
      console.log(idcontrato,'JOEL PROSPECTO');
      let whoiam = 2;
      let name = '5.png';
      let inversionista = idcontrato.IdPersona;
      let titulo = 'Se te ha enviado tu contrato, revisa tu correo electrónico';
      let link = 'null';
      this.controlcalidad.Notificacionpwa({
        name: name,
        whoiam: whoiam,
        inversionista: inversionista,
        titulo: titulo,
        link: link
      }).subscribe((res: any) => {
        console.log(res);
      })
    });
  }

  /*   public enviartest(contrato, showdeny = true) {
      console.log(contrato)
      var myModal = new bootstrap.Modal(
        document.getElementById('previewContratoModal'),
        {
          keyboard: false,
        }
      );
      Swal.fire({
        title: 'Confirmación',
        text: 'Se enviara un correo de prueba, ¿Deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        showDenyButton: showdeny,
        denyButtonText: 'Preview',
        denyButtonColor: '#0dcaf0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.controlcalidad.EnviarContrato({ HR: contrato.IDHR, Usuario: this.user.Nombre + " " + this.user.Apellidos }).subscribe((res: any) => {
            if (res.Updated == 1) {
              Swal.fire(
                'HR concluido',
                'Este proceso de inversión concluyó correctamente.',
                'success'
              )
              myModal.hide();
            }
            else if (result.isDenied) {
              console.log(result.isDenied,'Denegado')
              myModal.show();
            }
          });
        }
      });
    } */

  public enviarrecordatorio(idcontrato) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estas segur@ que el usuario ha firmado para modificar su estatus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaders.updating = true;
        this.controlcalidad.setFirmado({ id: idcontrato }).subscribe((res: any) => {
          console.log(res);
          if (res.updated === true) {
            this.toast.success('', 'Documento actualizado', { timeOut: 3000 });
            this.init();
          }
          this.loaders.updating = false;
        });
      }
    });
    let whoiam = 2;
    let name = '7.png';
    let inversionista = idcontrato.IdPersona;
    let titulo = 'Proceso completado';
    let link = 'null';
    this.controlcalidad.Notificacionpwa({ name: name, whoiam: whoiam, inversionista: inversionista, titulo: titulo, link: link }).subscribe((res: any) => {
      console.log(res);
    })
  }

  public verificardatos(idcontrato) {
    console.log(idcontrato);
  }

  public previewContrato(hr, verificar = false) {

    console.log(hr)
    console.log(verificar, 'l')

    this.loadercontrato = true;
    this.loadingPreview = true;
    if (!verificar) {
      this.selectedIdHr = hr.IDHR;
      this.selectedContrato = 'Contrato de ' + hr.INVERSIONISTA + ' para ' + hr.DESARROLLO;

      console.log(this.selectedContrato, 'l')

      fetch(environment.api + "contratos/obtener/documentodigital/" + hr.IDHR).then(response => {
        if (response.ok) {
          return response.blob();
        } else {
          return response.json();
        }
      })
        .then((res: any) => {

          if (res.error !== true) {
            this.currentPDfUrl = window.URL.createObjectURL(res);
          } else {
            this.themodal.hide();
            Swal.fire({
              icon: 'error',
              title: 'No se generó el contrato',
              html: res.message
            });
          }


          this.loadingPreview = false;
          this.loadercontrato = false;

        });
    } else {
      /* obtener el contrato para validar */
      console.log(hr.IDHR)
      this.controlcalidad.obtenercontratoshr(hr.IDHR).subscribe((res: any) => {
        console.log(res)
        this.infoContrato = res;

        this.celdas = res.celdas;
        this.celdas.forEach((item, i) => {
          if (res.aprobados.some(elem => elem.IdCeldaContrato === item.IdCelda)) {
            this.celdas[i].Aprobado = true;
          }
        })

        this.documentos = res.contrato[0];
        this.documentos.idhr = hr.IDHR;
        this.IDHR.IDHR = hr.IDHR
        console.log(this.documentos.idhr)
        this.loadercontrato = false;
        this.loadingPreview = false;
      })
    }
    /* this.enviarcontrato(hr) */
  }

  public verContratoFirmado(idreq = '') {

    this.loadingPreview = true;
    this.controlcalidad.getContratoFirmado(idreq).subscribe((res: any) => {
      console.log(res);
      if (res.success === true) {
        this.dataUrl = "data:application/pdf;base64," + res.data.files[1].base64;
      }
      this.loadingPreview = false;
    });
    /* this.controlcalidad.generarFADToken().subscribe((res) => {
      fetch('https://api.firmaautografa.com/clients/requisitions/documentsByIdRequisition/b253a575-47dc-4158-9386-2a42f5f2d336', {
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6ImFnYXJjaWFAZmlicmF4Lm14Iiwic2NvcGUiOlsicHJvZmlsZSJdLCJleHAiOjE2MjkxNjc2NjIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiY2M0MTc0Y2UtMmRmMC00MDUzLWE4ZGQtNGU2NDdiNWM5Y2E0IiwiY2xpZW50X2lkIjoiZmFkIn0.CSPPlROqYlISvFUA_Ngg8Og21h3DnN11QHpU9_9WakyykXqx4-9XRPmTprzY9qlywkc13nEVGVIuiewLRrmbxTg3OrQTvspGdlH3ZcNTsBMTZMRlFG4av0V1yPDKUY3Mc-kqDoNNHk9RRGssXialEG85o37VaV6Q0usHlmXsOWT2PJczH0njKNzdG_KV8IQqG5qhhAQfvR-apIW8cp1O4j1VoRHJylnoXROjqdcNOPqdF_RNyxnRm6kTe_ERbgMp-pn6_lumDbDNtWdHIaLN9DXH6dTnDsxqRp2VRLy_Nt_JNxILEUrYcLtDhqedVx1IOq1r-V2KePc0fxwTGgb9lw',
        }
      }).then(response => response.json())
        .then((response) => {
          console.log(response);
        });
    }) */
  }

  public recordar(nombre, i = 0) {
    this.bloquedBtns.push(i);
    this.controlcalidad.getRecordarContrato({ Nombre: nombre }).subscribe((res: any) => {
      if (res.sended === true) {
        this.toast.success('', 'Recoradtorio enviado para ' + nombre, { timeOut: 3000 });
      }
    });
  }

  public reenviarContrato(contrato = null) {
    Swal.fire({
      title: '¿Estas segur@ que deseas reenviar el contrato?',
      text: 'Al reenviar un contrato se asume que fue incorrecto por lo tanto sera invalidado y se enviara uno nuevo al usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaders.token = true;
        this.controlcalidad.reenviarContrato({ IdContrato: contrato }).subscribe((contr: any) => {
          if (contr.error !== true) {
            this.controlcalidad.generarFADToken().subscribe(
              (res: any) => {
                console.log(res);
                if (res.seted === true) {
                  this.loaders.sending = true;
                  this.controlcalidad.enviarFADtoSign(contr.IdHR).subscribe(
                    (res: any) => {
                      console.log(res);
                      if (res.created === true) {
                        this.toast.success(
                          '',
                          'Se reenvio el contrato digital para firmar de manera correcta!',
                          { timeOut: 4000 }
                        );
                        this.init();
                      }
                      this.loaders.sending = false;
                    },
                    (err) => {
                      console.log("aquitamos");

                      this.loaders.sending = false;
                      this.toast.error(
                        '',
                        'El servidor esta teniendo problemas en estos momentos',
                        { timeOut: 4000 }
                      );
                    }
                  );
                }
                this.loaders.token = false;
              },
              (err: any) => {
                this.loaders.token = false;
                this.toast.error(
                  '',
                  'El servidor esta teniendo problemas en estos momentos',
                  { timeOut: 4000 }
                );
              }
            );
          }
        })
      }
    });
  }

  firmarcontrato(IdHR) {
    console.log(IdHR);
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
        this.controlcalidad.FinalizarHR({ HR: IdHR, Usuario: this.user.Nombre + " " + this.user.Apellidos }).subscribe((res: any) => {
          if (res.Updated == 1) {
            Swal.fire(
              'HR concluido',
              'Este proceso de inversión concluyó correctamente.',
              'success'
            )
          }
        });
      }
    })
 
  }

  public aprobar(params) {

    console.log(params);
    /* verificacion de los contratos es estatus 1 como activo, y 0 como desactivado, aunque todavia suge en null */

    this.controlcalidad.verificarContratosStatus({
      idcontrato: params.idhr,
      statusContrato: 1,
      User: this.user.Nombre + " " + this.user.Apellidos
    }).subscribe((res: any) => {
      console.log(res);
      if (res[0].Updated == 1) {
        Swal.fire(
          'Contrato Verificado',
          'success'
        )
      }
    });

  }

  public aceptarClausula(event, celda) {

    let action = null;

    if (event.target.checked) {
      action = null;
    } else {
      action = 1;
    }

    this.controlcalidad.verificarClausulasContrato({
      IdContrato: celda.IdContrato,
      IdCelda: celda.IdCelda,
      IdHR: celda.IdHR,
      Del: action
    }).subscribe((res: any) => {

      if (action === null) {
        if (res.Inserted === 1) {
          this.toast.success('', 'Clausula aprobada!', { timeOut: 2000 });
        }
      } else {
        if (res.Inserted === 1) {
          this.toast.warning('', 'Clausula desaprobada!', { timeOut: 2000 });
        }
      }

    });
  }

  public fillCelda(data, index) {
    this.controlcalidad.llenarCelda(data).subscribe((res: any) => {
      if (res !== true) {
        this.celdas[index].ContenidoCelda = res.Documento;
      }
    });
  }
}
