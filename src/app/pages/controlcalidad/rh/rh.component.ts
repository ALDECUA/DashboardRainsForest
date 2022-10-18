import { Component, ElementRef, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import { ToastrService } from 'ngx-toastr';
import { DesarrollosService } from 'src/app/services/desarrollos.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

declare var bootstrap: any;
@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.scss'],
})
export class RhComponent implements OnInit {
  public registros: any[] = [];
  public registros_pendientes: any[] = [];
  public registros_aceptados: any[] = [];
  public registros_eliminados: any[] = [];
  public registros_cancelados: any[] = [];
  public loading: boolean = false;
  public pendientes = 0;
  public realizados = 0;
  public eliminados = 0;
  public cancelados = 0;
  public asesores: any[] = [];
  public promotores = [];
  public organigrama: any = { IdPromotor: null };
  public clientes: any;
  public canvas;
  public modal;
  public configDataTable: any = {
    fields: [
      {
        text: 'Nombre inversionista',
        value: 'Nombre',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Lote',
        value: 'Lote',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Estatus',
        value: 'Registro_Aceptado',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Campaña',
        value: 'Campana',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Progreso de HR',
        value: 'FaseHR',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Ultima actividad',
        value: 'Actividad',
        hasImage: false,
        pipe: null,
      },
    ],
    editable: false,
    show: true,
    urlEdit: '/crm/controlcalidad/editarhr/',
    urlShow: '/crm/controlcalidad/editarhr/',
    idField: 'IdPersona',
    idField2: 'IdLote',
    idField3: 'IdHR',
    fotoField: 'Foto_Perfil',
    filtroA: {
      //
      data: [
        {
          value: 'PASO 1 - Correo de bienvenida enviado',
          texto: 'Paso 1',
        },
        {
          value: 'PASO 2 - El inversionista esta registrando su informacion',
          texto: 'Paso 2',
        },
        {
          value:
            'PASO 3 - Se esta verificando la informacion del inversionista',
          texto: 'Paso 3',
        },
        {
          value: 'PASO 4 - Creando contrato del inversionista',
          texto: 'Paso 4',
        },
        {
          value: 'PASO 5 - Se le ha enviado el contrato al inversionista',
          texto: 'Paso 5',
        },
        {
          value: 'PASO 6 - EL inversionista ha firmado el contrato',
          texto: 'Paso 6',
        },
        {
          value: 'PASO 7 - Proceso completado',
          texto: 'Paso 7',
        },
      ],
      fieldFilter: 'FaseHR',
    },
  };

  public personaSelected: any = {};
  public desarrollos: any[] = [];
  public des: any = {};
  public etapas: any[] = [];
  public lotes: any[] = [];
  public persona: any;
  public Lotes: any = {};
  public tickets: any;
  public loadingdes: boolean = false;
  public loadingetapa: boolean = false;
  public loadinglote: boolean = false;
  public loadingHR: boolean = false;
  public loadingasesor: boolean = false;
  public inversionista: any = {};
  public usuario;
  public registro = {
    Nombre: null,
    Nombre_S: '',
    Apellido_Pat: null,
    Apellido_Mat: '',
    Email: null,
    Num_Cel: null,
    Whats: null,
    asesor: null,
    Nacimiento: new Date(),
    Fecha: new Date(),
    SocioCom: null,
    IdLider: null,
  };

  constructor(
    public app: AppService,
    private el: ElementRef,
    private toast: ToastrService,
    private desarrolloService: DesarrollosService,
    public controlcalidad: ControlcalidadService,
    public auth: AuthService
  ) {
    this.app.currentModule = 'Control de calidad';
    this.app.currentSection = ' - Hoja de registro';
  }

  ngOnInit(): void {
    this.load();
    this.loadASesores();
    this.fillDesarrollos();
    this.getTickets();
    this.usuario = this.auth.user;
    console.log(this.usuario);
    this.canvas = new bootstrap.Offcanvas(
      document.getElementById('offcanvasExample')
    );
    this.modal = new bootstrap.Modal(document.getElementById('agregarinv'), {
      keyboard: false,
    });
  }

  private load() {
    this.loading = true;
    this.controlcalidad.getPersonasHr().subscribe((personasHr: any) => {
      if (personasHr.error === undefined) {
        this.registros = personasHr;
        console.log(this.registros);
        for (let i = 0; i < this.registros.length; i++) {
          if (this.registros[i].IdStatus == 0) {
            this.registros_eliminados.push(this.registros[i]);
          } else if (this.registros[i].IdStatus == 1) {
            if (this.registros[i].RegistroAceptado == 1) {
              this.registros_aceptados.push(this.registros[i]);
            } else if (this.registros[i].RegistroAceptado == 0) {
              this.registros_pendientes.push(this.registros[i]);
            } else if (this.registros[i].RegistroAceptado == 2) {
              this.registros_cancelados.push(this.registros[i]);
            }
          }
        }

        this.eliminados = this.registros_eliminados.length;
        this.pendientes = this.registros_pendientes.length;
        this.realizados = this.registros_aceptados.length;
        this.cancelados = this.registros_cancelados.length;
      }
      this.loading = false;
    });
  }

  public loadASesores() {
    this.controlcalidad.getAsesores().subscribe((res: any) => {
      console.log(res);
      this.asesores = res.personas;
    });
  }

  public fillDesarrollos() {
    this.desarrolloService.getDesarrollos(1).subscribe((res: any) => {
      console.log(res);
      this.desarrollos = res.desarrollos;
    });
  }

  public fillEtapas(event) {
    this.loadingdes = true;

    let etapa = this.el.nativeElement.querySelector('#etapaname');
    let lote = this.el.nativeElement.querySelector('#lotename');
    let lx = this.el.nativeElement.querySelector('.lx');
    let x = this.el.nativeElement.querySelector('.x');
    let m2 = document.getElementById('m2');
    let formacompra = this.el.nativeElement.querySelector('#formacompra');
    let opc = this.el.nativeElement.querySelector('#optioncontado');
    let opf = this.el.nativeElement.querySelector('#optionfinanciado');

    x.remove();
    lx.remove();
    opc.remove();
    opf.remove();

    if (event.target.value == 12) {
      etapa.insertAdjacentHTML(
        'afterbegin',
        '<label class="form-label label-ref x" for="etapa">Edificio</label>'
      );
      lote.insertAdjacentHTML(
        'afterbegin',
        '<label class="form-label label-ref lx" for="lote">Fraxion</label>'
      );
      m2.style.display = 'none';

      if (this.tickets.SaldoContado > 0) {
        formacompra.insertAdjacentHTML(
          'beforeend',
          '<option value="1" id="optioncontado">Contado (' +
            this.tickets.SaldoContado +
            ' Disponibles)</option><option value="2" id="optionfinanciado">Financiado</option>'
        );
      }
    } else {
      etapa.insertAdjacentHTML(
        'afterbegin',
        '<label  *ngIf="des.IdDesarrollo != 12" class="form-label label-ref x" for="etapa">Etapa</label>'
      );
      lote.insertAdjacentHTML(
        'afterbegin',
        '<label class="form-label label-ref lx" for="lote">Lote</label>'
      );
      formacompra.insertAdjacentHTML(
        'beforeend',
        '<option value="1" id="optioncontado">Contado</option><option value="2" id="optionfinanciado">Financiado</option>'
      );
      m2.style.display = 'block';
    }

    this.desarrolloService
      .getEtapa(event.target.value)
      .subscribe((res: any) => {
        this.etapas = res.fases;
        console.log(this.etapas);
        this.loadingdes = false;
      });
  }

  public fillLotes(evt) {
    this.loadinglote = true;
    let desarrollo = this.el.nativeElement.querySelector('#desarrollo');

    this.desarrolloService
      .getLotesHr(desarrollo.value, evt.target.value)
      .subscribe((res: any) => {
        console.log(res);
        this.lotes = res.lotes;
        this.loadinglote = false;
      });
  }

  public seleccionarLote(event) {
    let loteSeleccionado = this.lotes.find(
      (elem) => elem.IdLote === +event.target.value
    );
    this.Lotes.controls = {
      Precio_M2: loteSeleccionado.Precio_m2,
      M2: loteSeleccionado.m2,
      Precio_Total: loteSeleccionado.Precio_Total,
    };
    console.log(this.Lotes);
    this.el.nativeElement.querySelector('#preciom2').value =
      this.Lotes.controls.Precio_M2;
    this.el.nativeElement.querySelector('#m2lote').value =
      this.Lotes.controls.M2;
    this.el.nativeElement.querySelector('#preciototal').value =
      this.Lotes.controls.Precio_Total;
  }

  public calcularTotal() {
    let precio = this.el.nativeElement.querySelector('#preciom2');
    let m2lote = this.el.nativeElement.querySelector('#m2lote');
    let precioTotal = this.el.nativeElement.querySelector('#preciototal');
    precioTotal.value = (precio.value * m2lote.value).toFixed(2);

    console.log((precio.value * m2lote.value).toFixed(2));

    this.Lotes.controls = {
      Precio_Total: (precio.value * m2lote.value).toFixed(2),
    };
  }

  public mensualidad(event) {
    let desarrollo = this.el.nativeElement.querySelector('#desarrollo');
    let mensualidadescopro = document.getElementById('financiado');
    let enganche = document.getElementById('enganche');
    let optionsmen;

    if (event.target.value === '1') {
      mensualidadescopro.style.display = 'none';
      enganche.style.display = 'none';
    } else {
      mensualidadescopro.style.display = 'block';
      enganche.style.display = 'block';

      if (desarrollo.value === '12') {
        optionsmen =
          this.tickets.Saldo6MSI > 0
            ? '<option value="6">6 MSI (' +
              this.tickets.Saldo6MSI +
              ' Disponibles)</option>'
            : '';
        optionsmen +=
          this.tickets.Saldo12MSI > 0
            ? '<option value="12">12 MSI (' +
              this.tickets.Saldo12MSI +
              ' Disponibles)</option>'
            : '';
        optionsmen +=
          this.tickets.Saldo18MSI > 0
            ? '<option value="18">18 MSI (' +
              this.tickets.Saldo18MSI +
              ' Disponibles)</option>'
            : '';
        optionsmen +=
          this.tickets.Saldo24MSI > 0
            ? '<option value="24">24 MSI (' +
              this.tickets.Saldo24MSI +
              ' Disponibles)</option>'
            : '';
      } else {
        optionsmen =
          '<option value="12">12 Meses</option><option value="24">24 Meses</option><option value="36">36 Meses</option>';
      }
      let option =
        '<label class="label-ref" for="formacompra">Financiamiento</label><select class="form-control tiempofinanciado " name="tiempofinanciado[]" id="tiempofinanciado" autocomplete="off"> <option value="" selected disabled>Selecciona una mensualidad</option>' +
        optionsmen +
        '</select>';
      mensualidadescopro.innerHTML = option;
      enganche.innerHTML = `<label>Monto de enganche</label>
      <input type="text" name="montoenganche[]" id="montoenganche"
          class="form-control  montoenganche" placeholder="Monto de enganche" autocomplete="off">`;
    }
  }

  public getTickets() {
    this.desarrolloService.getTickets().subscribe((res: any) => {
      this.tickets = res.promos[0];
      console.log(this.tickets);
    });
  }

  public searchAsesor() {
    let input, filter, ul, txtValue, activelist;

    input = this.el.nativeElement.querySelector('.search');
    filter = input.value.toLowerCase();
    ul = $('#mylistasesor').parent().find('.list-group-item');
    activelist = this.el.nativeElement.querySelector('.scrolling');
    activelist.style.display = 'block';

    for (let index = 0; index < ul.length; index++) {
      const element = ul[index];
      txtValue =
        element.textContent.toLowerCase() || element.innerText.toLowerCase();

      if (txtValue.indexOf(filter) > -1) {
        ul[index].style.display = 'block';
      } else {
        ul[index].style.display = 'none';
      }
    }
  }

  public dataShow(item) {
    this.loadingasesor = true;
    let id = item.IdPersona;
    this.personaSelected = item;
    console.log(this.personaSelected);
    this.promotores = [];
    this.controlcalidad.getOrganigrama(id).subscribe((res: any) => {
      if (!res.error) {
        this.organigrama = res;
        if (res.Promotores) {
          this.promotores = JSON.parse(res.Promotores);
        }
        this.toast.success('', 'Asesor Seleccionado!', { timeOut: 2000 });
        let activelist, input;
        input = this.el.nativeElement.querySelector('.search');
        activelist = this.el.nativeElement.querySelector('.scrolling');
        setTimeout(() => {
          activelist.style.display = 'none';
          input.value = '';
          this.loadingasesor = false;
        }, 2000);
        this.organigrama.IdPromotor = null;
      } else {
        this.toast.error(
          'El asesor seleccionado no es valido, verifique su selección'
        );
      }
    });

    this.controlcalidad.getClientes(id).subscribe((res: any) => {
      this.clientes = res;
    });
  }

  public async continuar() {
    this.loadingHR = true;

    let validation = 0;

    let datos: any = {};

    let asesor: any = document.getElementById('fdfgfdds');
    let desarrollo: any = document.getElementById('desarrollo');
    let etapa: any = document.getElementById('etapa');
    let lote: any = document.getElementById('lote');
    let precio: any = document.getElementById('preciom2');
    let m2lote: any = document.getElementById('m2lote');
    let preciototal: any = document.getElementById('preciototal');
    let tipopago: any = document.getElementById('formacompra');
    let financiamiento: any;
    let enganche: any;

    datos.asesor = this.personaSelected.IdPersona;
    datos.cliente = this.inversionista.IdPersona;
    datos.desarrollo = desarrollo.value;
    datos.etapa = etapa.value;
    datos.lote = lote.value;
    datos.precio = precio.value;
    datos.m2lote = m2lote.value;
    datos.preciototal = preciototal.value;
    datos.tipopago = tipopago.value;
    datos.idlider = this.personaSelected.IdILider;
    datos.idScom = this.personaSelected.IdSCom;

    if (asesor.value === '') {
      asesor.classList.add('is-active');
      setTimeout(() => {
        asesor.classList.remove('is-active');
      }, 2500);
      validation = 1;
    }

    if (desarrollo.value === '') {
      desarrollo.classList.add('is-active');
      setTimeout(() => {
        desarrollo.classList.remove('is-active');
      }, 2500);
      validation = 1;
    }

    if (etapa.value === '') {
      etapa.classList.add('is-active');
      setTimeout(() => {
        etapa.classList.remove('is-active');
      }, 2500);
      validation = 1;
    }
    if (lote.value === '') {
      lote.classList.add('is-active');
      setTimeout(() => {
        lote.classList.remove('is-active');
      }, 2500);
      validation = 1;
    }
    if (precio.value === '') {
      precio.classList.add('is-active');
      setTimeout(() => {
        precio.classList.remove('is-active');
      }, 2500);
      validation = 1;
    }
    if (tipopago.value === '') {
      tipopago.classList.add('is-active');
      setTimeout(() => {
        tipopago.classList.remove('is-active');
      }, 2500);
      validation = 1;
    } else {
      if (tipopago.value === '2') {
        financiamiento = document.getElementById('tiempofinanciado');
        enganche = document.getElementById('montoenganche');

        if (financiamiento.value === '') {
          financiamiento.classList.add('is-active');
          setTimeout(() => {
            financiamiento.classList.remove('is-active');
          }, 2500);
          validation = 1;
        }
        if (enganche.value === '') {
          enganche.classList.add('is-active');
          setTimeout(() => {
            enganche.classList.remove('is-active');
          }, 2500);
          validation = 1;
        }
        datos.financiamiento = financiamiento.value;
        datos.enganche = enganche.value;
      }
    }
    if (validation === 0) {
      if (this.inversionista.inversionista == 0) {
        this.controlcalidad
          .crearInversionista(this.inversionista)
          .subscribe(async (res: any) => {
            if (res.updated) {
              const hrinsert: any = await this.insertarHR(datos);

              if (hrinsert.insert === true) {
                console.log(hrinsert);
                location.reload();
              }
              this.toast.success('', 'HR guardado con exito!', {
                timeOut: 2000,
              });
            }
          });
      } else {
        const hrinsert: any = await this.insertarHR(datos);

        if (hrinsert.insert === true) {
          console.log(hrinsert);
          location.reload();
        }
        this.toast.success('', 'HR guardado con exito!', { timeOut: 2000 });
      }
    } else {
      console.log('noexito');
      this.toast.error('', 'Llene todos los campos!', { timeOut: 2000 });
    }

    let whoiam = 2;
    let name = '1.png';
    let inversionista = this.inversionista.IdPersona;
    let titulo = 'Se te ha enviado un correo de bienvenida';
    let link = 'null';
    this.controlcalidad
      .Notificacionpwa({
        name: name,
        whoiam: whoiam,
        inversionista: inversionista,
        titulo: titulo,
        link: link,
      })
      .subscribe((res: any) => {
        console.log(res);
      });

    this.loadingHR = false;
  }

  public insertarHR(datos) {
    return new Promise((resolve, rejects) => {
      this.controlcalidad
        .guardarHR({
          IdPersona: this.inversionista.IdPersona,
          IdAsesor: datos.asesor,
          //IdPlaza
          //IdOrigen
          //IdCloser
          IdPromotor: this.organigrama.IdPromotor,
          IdDesarrollo: datos.desarrollo,
          IdLote: datos.lote,
          IdMetodoPago: null,
          Forma_Compra: datos.tipopago,
          Enganche: datos.enganche,
          Mensualidades: datos.financiamiento,
          Precio_M2: datos.precio,
          M2: datos.m2lote,
          Precio_Total: datos.preciototal,
          //Fecha_Enganche
          //Img_Comprobante
          IdAsociado: datos.idScom,
          IdTeamLider: datos.idlider,
          UserExists: 3,
          //Observaciones
          //IdReferido
          Usr: this.usuario.IdUsuario,
          //referido
        })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            console.log(err);
            resolve({ error: true });
          }
        );
    });
  }

  buscar() {
    this.controlcalidad
      .busqueda({ email: this.inversionista.email })
      .subscribe((res: any) => {
        if (!res.rrecordset.error) {
          Swal.fire({
            title: '¿Estas buscando a ' + res.rrecordset.nombre + '?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.inversionista = res.rrecordset;
            } else if (result.isDenied) {
              Swal.fire('Verifica el correo ingresado', '', 'info');
            }
          });
        } else {
          Swal.fire(
            'Verifica el correo ingresado',
            'No existe nadie registrado con este correo',
            'info'
          );
        }
      });
  }
  public registro_persona() {
    if (
      !this.registro.Nombre ||
      !this.registro.Apellido_Pat ||
      !this.registro.Email ||
      !this.registro.Num_Cel
    ) {
      this.toast.error(
        'Todos los campos marcados (*) son obligatorios',
        'Registro no realizado',
        {
          timeOut: 3000,
        }
      );
      this.loading = false;
      return;
    }
    if (
      this.registro.Num_Cel < 1000000000) {
      this.toast.error(
        'Ingresa tu número telefónico completo',
        'Número invalido',
        {
          timeOut: 3000,
        }
      );
      this.loading = false;
      return;
    }
    this.loading = true;
    var url =
      'https://emailvalidation.abstractapi.com/v1/?api_key=0c67d1ee715b4f1c8d1466f90aaf9111&email=' +
      this.registro.Email;
    fetch(url, {
      method: 'GET', // or 'PUT'
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        if (
          (response.is_valid_format.value === true &&
            response.deliverability === 'DELIVERABLE') ||
          (response.is_valid_format.value === true &&
            response.deliverability === 'UNKNOWN')
        ) {
          //exito
          this.loading = true;
          this.app.InsertarPersona(this.registro).subscribe(
            (res: any) => {
              if (res.inserted == true) {
                this.app
                  .CrearInversionista({
                    IdPersona: res.persona[0].IdPersona,
                    Email: this.registro.Email,
                  })
                  .subscribe((ress: any) => {
                    if (ress.error != true) {
                      this.regresar()
                      this.toast.success('Inversionista agregado y seleccionado');
                      this.inversionista = {
                        Email: this.registro.Email,
                        IdPersona: res.persona[0].IdPersona,
                        inversionista: 1,
                        nombre:
                          this.registro.Nombre +
                          ' ' +
                          this.registro.Apellido_Pat,
                      };
                      this.registro = {
                        Nombre: null,
                        Nombre_S: '',
                        Apellido_Pat: null,
                        Apellido_Mat: '',
                        Email: null,
                        Num_Cel: null,
                        Whats: null,
                        asesor: null,
                        Nacimiento: new Date(),
                        Fecha: new Date(),
                        SocioCom: null,
                        IdLider: null,
                      };
                    }
                  });
              } else {
                let text = res.message;
                if (text.includes('UNIQUE KEY')) {
                  Swal.fire({
                    icon: 'error',
                    title: '¡Correo duplicado!',
                    text: 'Este correo se encuentra en uso',
                    confirmButtonColor: '#101c64',
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Tuvimos un problema',
                    text: 'Por favor intenta nuevamente, si el problema persiste contacte a soporte',
                    confirmButtonColor: '#101c64',
                  });
                }
              }
              this.loading = false;
            },
            (error) => {
              this.loading = false;
            }
          );
        } else {
          this.loading = false;
          this.toast.error(
            'Por favor ingresa un correo real para recibir tu contraseña.',
            'Correo electronico invalido',
            {
              timeOut: 3000,
            }
          );
        }
      });
  }
  llamarmodal() {
    this.canvas.hide();
    this.modal.show();
  }
  regresar() {
    this.canvas.show();
    this.modal.hide();
  }
}
