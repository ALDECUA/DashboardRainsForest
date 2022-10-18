import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContabilidadService } from 'src/app/services/contabilidad.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss'],
})
export class CobranzaComponent implements OnInit {
  public referencia = null;
  public monto = null;
  public fch = null;
  public Pago: any[] = [];
  public registros: any[] = [];
  public HR:any = {};
  public TipoPago: any[];
  public usuario;
  public pago = null;
  public HRStatus1=null;
  public HRStatus2=null;
  public HRStatus3=null;
  public TP: any[];
  public personas: any[] = [];
  public IdPersonaa = null;
  public IdHR = null;
  public Lotes: any[] = [];
  public Concepto = null;
  public rep = 1;
  public montopagos = null;
  public fechapago;
  public comprobante = null;
  public usuariopagos;
  public tipopago = null;
  public text;
  public insertados;
  constructor(
    public app: AppService,
    private auth: AuthService,
    public controlcalidad: ControlcalidadService,
    public contabilidad: ContabilidadService,
    private toast: ToastrService,
  ) {}
  
  ngOnInit(): void {
    this.usuario = this.auth.user.Nombre;
    this.controlcalidad.getPagosCobranza().subscribe((response: any) => {
      if (response.error !== true) {
        this.registros = response;
        this.HR = this.registros[0];
        console.log(this.registros);
        /* if (this.registros[0]) {
          
        } */
      }
    });
    this.usuariopagos = this.auth.user.Nombre;
    this.controlcalidad.getInversionistas().subscribe((personasHr: any) => {
      this.personas = personasHr;
      console.log(this.personas);
    });
    this.controlcalidad.getTipoPago().subscribe((response: any) => {
      if (response.error !== true) {
        this.TipoPago = response;
        console.log(this.TipoPago);
      }
    });
  }
  public ObtenerHr(registro) {
    console.log(registro);
    this.HR = registro;
  }
  public RegistrarPago() {
    this.controlcalidad
      .registrarPago({
        IdHR: this.HR.IdHR,
        IdTipoPago: this.pago, 
        Referencia: this.referencia,
        Importe:  this.monto,
        IdStatus: 1,
        FechaRegistro: new Date().toISOString().slice(0, 19).replace('T', ' '),
        FechaPago: this.fch,
        Usr: this.usuario
      })
      .subscribe((response: any) => {
        if (response.error !== true) {
          console.log(response);
          if (response.insert==true) {
            Swal.fire(
              '¡Pago registrado!',
              'El pago se ha registrado con éxito',
              'success'
            );
          this.Vaciar();
          }
          else
          {
            Swal.fire(
              '¡El pago no fue registrado!',
              'Ocurrió un error, intente nuevamente',
              'error'
            );
          }
        }
      });
  }
  public Vaciar() {
    this.pago = null;
    this.referencia = null;
    this.fch = null;
    this.monto = null;
  /*   console.log(registro.IdPago);
    console.log(registro.Concepto);
    this.HR=registro; */
  }

  public registrarPago(hr) {
    console.log(hr);

    let ids= {
      'IdPago': hr.IdPago,
      'IdStatus' : 1,
      'IdHR': hr.IdHR
    }
    this.controlcalidad.verificarPago(ids).subscribe((response:any) => {
      console.log(response);
      if (response.updated === 1) {
        Swal.fire({
          title: 'Pago Verificado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        //$('#myModal').modal('hide')
        $('.modal').removeClass('show');//eliminamos modal
        $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
        $('.modal-backdrop').remove();//eliminamos el backdrop del modal
        $('.modal.fade').css('display','none');

      }else{
        Swal.fire({
          title: 'Ocurrio algo, Intente mas tarde',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        }) 
      }
    });
  }

   public rechazarPago(hr) {
     console.log(hr);

     let ids= {
      'IdPago': hr.IdPago,
      'IdStatus' : 3
    }
    this.controlcalidad.verificarPago(ids).subscribe((response:any) => {
      console.log(response);
      if (response.updated === 1) {
        Swal.fire({
          title: 'Pago Rechazado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
         //$('#myModal').modal('hide')
         $('.modal').removeClass('show');//eliminamos modal
         $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
         $('.modal-backdrop').remove();//eliminamos el backdrop del modal
         $('.modal.fade').css('display','none');
      }else{
        Swal.fire({
          title: 'Ocurrio algo, Intente mas tarde',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  public verRecibo(recibo) {
    Swal.fire({
      imageUrl: this.app.dominio + 'asesores/Content/img/archivos_usuarios/COMP_PAGO/'+recibo,
      imageWidth: 400,
      imageAlt: 'El archivo no es una imagen',
      html:'<a href="'+this.app.dominio+'/asesores/Content/img/archivos_usuarios/COMP_PAGO/'+recibo+'" target="_blank">Ver en otra pestaña</a>'
    })
  }
  

  BuscarLotes() {
    console.log(this.IdPersonaa);
    this.controlcalidad
      .getLotesInversionista(this.IdPersonaa)
      .subscribe((lotes: any) => {
        console.log(lotes);
        this.Lotes = lotes;
      });
    this.IdHR = null;
  }
  concepto() {
    if (this.Concepto != 4) {
      this.rep = 1;
    }
  }
  RegistrarPagos() {
    if (
      this.Concepto == null ||
      this.montopagos == null ||
      this.IdHR == null ||
      this.IdPersonaa == null ||
      this.rep == null ||
      this.comprobante == null ||
      this.fechapago == null
    ) {
      this.toast.error('', 'Todos los campos son requeridos', {
        timeOut: 3000,
      });
      return;
    }
    this.insertados = 0;
    for (let i = 0; i < this.rep; i++) {
      this.controlcalidad
        .registrarPago({
          IdHR: this.IdHR,
          IdTipoPago: this.tipopago,
          Referencia: this.text,
          Importe: this.montopagos,
          IdStatus: 1,
          FechaRegistro: new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '),
          FechaPago: this.fechapago,
          Usr: this.usuariopagos,
          ComprobantePago: this.comprobante,
          IdConcepto: this.Concepto,
        })
        .subscribe((response: any) => {
          if (response.error !== true) {
            console.log(response);
            if (response.insert == true) {
              this.insertados++;
              this.toast.success(
                '',
                'Se ha registrado el pago correctamente'
              );
            }
          }
          else
          {
            this.toast.error(
              '',
              'Ocurrio un error interno, intenta nuevamente'
            );
          }
        });
      console.log(this.insertados);
    }

    this.VaciarPagos();
  }
  public subirImagen(event) {
    console.log(event);
    let formData = new FormData();
    formData.append('upload_file', event[0]);
    formData.append('IdPersona', this.IdPersonaa);
    formData.append('subfolder', 'COMP_PAGO');
    this.contabilidad.SubirComp(formData).subscribe((res: any) => {
      if (res == '{"error":1,"message":"No se subio la imagen"}') {
        this.toast.warning(
          '',
          'Ocurrio un error al cargar la imagen, intenta nuevamente'
        );
      } else {
        this.comprobante = res.filename;
      }
    });
  }
  Ref($event) {
    this.text = $event.target.options[$event.target.options.selectedIndex].text;
  }
  VaciarPagos() {
    this.Concepto = null;
    this.montopagos = null;
    this.IdHR = null;
    this.IdPersonaa = null;
    this.rep = 1;
    this.comprobante = null;
    this.fechapago == null;
  }











  
  
}
