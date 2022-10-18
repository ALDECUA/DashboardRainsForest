import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';

@Component({
  selector: 'app-add-lote-inv',
  templateUrl: './add-lote-inv.component.html',
  styleUrls: ['./add-lote-inv.component.scss']
})
export class AddLoteInvComponent implements OnInit {

  public desarrollos: any[] = [];
  public etapas: any[] = [];
  public lotesdisponibles: any[] = [];
  public lotedata: any = {};
  public lote_resp: any;
  @Input() public datosPersonales: any = {};
  @Output() public onEmitRecord = new EventEmitter<any>();


  public loading: boolean = false;

  constructor(
    public app: AppService,
    private controlcalidad: ControlcalidadService,
    private toast: ToastrService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.controlcalidad.getDesarrollos().subscribe((res: any) => {
      this.desarrollos = res.desarrollos;
    });
  }

  public getEtapas() {
    this.controlcalidad.getEtapas(this.lotedata.IdDesarrollo).subscribe((res: any) => {
      this.etapas = res.fases;
    });
  }

  public CambioEtapa() {
    this.getLotesDisponibles();
    this.lotedata.IdLote = null;
  }

  public getLotesDisponibles() {
    this.controlcalidad.getLotesT(this.lotedata.IdDesarrollo, this.lotedata.IdFase).subscribe((res: any) => {
      this.lotesdisponibles = res.lotes;
    });
  }

  public cambiarLote(lote = null) {
    const datos = this.lotesdisponibles.find(elem => +elem.IdLote === +this.lotedata.IdLote);
    console.log(datos);
    this.lotedata.PrecioM2 = datos.Precio_m2;
    this.lotedata.m2 = datos.m2;
    this.lotedata.Precio_Final = this.lotedata.PrecioM2 * this.lotedata.m2;
  }

  public cambiarFormaPago() {
    if (this.lotedata.Forma_Compra == 1) {
      this.lotedata.Mensualidades = 0;
    }
  }

  public CambiarPrecio() {
    this.lotedata.Precio_Final = this.lotedata.PrecioM2 * this.lotedata.m2;
  }

  public saveLote() {

    if ([undefined, null, ''].includes(this.lotedata.IdLote)) {
      this.toast.warning('', 'Selecciona un lote para agregar', { timeOut: 2000 });
      return;
    }

    this.loading = true;

    this.lotedata['IdPersona'] = this.datosPersonales.IdPersona;
    this.lotedata['IdAsociado'] = this.datosPersonales.IdScom;
    this.lotedata['IdTeamLider'] = this.datosPersonales.IdIlider;
    this.lotedata['IdAsesor'] = this.datosPersonales.IdAsesor;
    this.lotedata['Origen'] = 2;

    this.controlcalidad.insertarLoteHr(this.lotedata).subscribe((res: any) => {
      if (res.insert === true) {
        if (res.record.error === 1) {
          this.toast.error('', 'El lote ya se encuentra en el protafolio del usuario', { timeOut: 3000 });
          this.loading = false;
          return;
        }
        this.toast.success('', 'Se añadio el lote al inversionista!', { timeOut: 3000 });
        this.onEmitRecord.emit(res.record);
        this.controlcalidad.FinalizarHR({
          HR: res.record.IdHR,
          Usuario: this.auth.user.IdUsuario
        }).subscribe((res: any) => {
          this.loading = false;
          this.lotedata = {};
        })
      } else {
        this.loading = false;
        this.toast.error('', 'No se pudo insertar el lote', { timeOut: 2000 });
      }
    });
  }
}
