import { Subscription } from 'rxjs';
import { DesarrollosService } from './../../services/desarrollos.service';
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-desarrollos',
  templateUrl: './desarrollos.component.html',
  styleUrls: ['./desarrollos.component.scss']
})
export class DesarrollosComponent implements OnInit {

  public empresas: any = [];
  public desarrollos: any = [];
  public etapas: any = [];
  public lotes: any = [];
  public vista: number = 1;
  public dessave: any = {};
  public etasave: any = [];
  public contratos: any = [];

  public isLoadingEmp: boolean = false;
  public isLoadingDes: boolean = false;
  public isLoadingEta: boolean = false;
  public isLoadingLot: boolean = false;

  public subscription: Subscription = new Subscription();

  public desIdSelected: any;
  public faseIdSelected: any;

  constructor(
    private el: ElementRef,
    public desarrollosServices: DesarrollosService,
    private auth: AuthService,
    public app: AppService,
    private toast: ToastrService
  ) {
    this.app.currentModule = 'Desarrollos';
    this.app.currentSection = '- Empresas';
  }

  ngOnInit(): void {
    this.isLoadingEmp = true;
    this.desarrollosServices.getEmpresas().subscribe((res: any) => {
      this.empresas = res.empresas;
      this.isLoadingEmp = false;
    }, (err) => {
      console.log(err);
    })

    this.desarrollosServices.getContratos().toPromise().then((res: any) => {
      if (res.unauthorized) {
        alert("Su sesión no es valida, posiblemente haya caducado");
        this.auth.logout();
      }
      if (!res.error) {
        this.contratos = res.contratos;
      }
    })

    this.isLoadingDes = true;
    this.desarrollosServices.getDesarrollos(1).subscribe((res: any) => {
      this.desarrollos = res.desarrollos;
      this.isLoadingDes = false;
    }, (err) => {
      console.log(err);
    })
  }

  public selecempresa(idempresa, empresa) {
    this.isLoadingDes = true;

    this.desarrollosServices.getDesarrollos(idempresa).subscribe((res: any) => {
      this.desarrollos = res.desarrollos;
      this.isLoadingDes = false;
    }, (err) => {
      console.log(err);
    })

    var de1 = this.el.nativeElement.querySelector('.empresabefore');
    de1.remove();
    var d1 = this.el.nativeElement.querySelector('.empresaselect');
    d1.insertAdjacentHTML('beforeend', '<div class="empresabefore" #empresabefore><p style="margin-bottom: -2px;" class="labelselect"> ' + empresa + '</p></div>');

  }

  public selectdes(id, des) {

    this.desIdSelected = id;
    this.isLoadingEta = true;

    this.desarrollosServices.getEtapa(id).subscribe((res: any) => {
      this.etapas = res.fases;
      this.isLoadingEta = false;
    }, (err) => {
      console.log(err);
    })

    let del1 = this.el.nativeElement.querySelector('.desarrollobefore');
    del1.remove();
    let add1 = this.el.nativeElement.querySelector('.desselect');
    add1.insertAdjacentHTML('beforeend', '<div class="desarrollobefore" #desarrollobefore><p style="margin-bottom: -2px;" class="labelselect"> ' + des + '</p></div>');

  }

  public selecteta(id, etapa, idDes) {

    this.faseIdSelected = id;
    this.isLoadingLot = true;

    this.subscription.add(
      this.desarrollosServices.getLote(idDes, id).subscribe((res: any) => {
        console.log(res);
        this.lotes = res.lotes;
      }, (err) => {
        console.log(err);
      })
    );

    let del2 = this.el.nativeElement.querySelector('.etapabefore');
    del2.remove();
    let add1 = this.el.nativeElement.querySelector('.etapaselect');
    add1.insertAdjacentHTML('beforeend', '<div class="etapabefore" #etapabefore><p style="margin-bottom: -2px;" class="labelselect"> ' + etapa + '</p></div>');
  }

  public addDesarrollo(x) {
    this.vista = x;

  }

  public guardarDes() {

    /*     console.log(this.dessave);
        let Desarollo = this.dessave;
    
        let del1 = this.el.nativeElement.querySelector('.desarrollobefore');
        del1.remove();
        let add1 = this.el.nativeElement.querySelector('.desselect');
        add1.insertAdjacentHTML('beforeend','<div class="desarrollobefore" #desarrollobefore><p style="margin-bottom: -2px;" class="labelselect"> '+Desarollo.Desarrollo+'</p></div>');
     */
    this.isLoadingDes = true;
    this.desarrollosServices.guardarDesarrollo(this.dessave).subscribe((res: any) => {
      if (res.insert === true) {
        this.toast.success('', 'Se guardo el desarrollo!', { timeOut: 3000 });
        this.dessave = {};
        this.desarrollos.unshift(res.record);
      }
      this.isLoadingDes = false;
    })
  }

  public guardarEta() {
    let Etapa = this.etasave;
    this.desarrollosServices.crearEtapa({
      Fase: Etapa.etapa,
      IdDesarrollo: this.desIdSelected,
      Activo: 1
    }).subscribe((res: any) => {
      console.log(res);
      if (res.insert === true) {
        this.etapas.push(res.record);
      }
    })
  }

}
