import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FxcoinsService } from 'src/app/services/fxcoins.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  public pedidos: any[] = [];
  public configDataTable = {
    fields: [
      {
        text: 'Colaborador',
        value: 'Nombre',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Producto',
        value: 'Producto',
        hasImage: false,
        pipe: null
      },
      {
        text: 'Moneda',
        value: 'Moneda',
        hasImage: false,
        pipe: null
      },
      {
        text: 'Fecha',
        value: 'Fch_Pedido',
        hasImage: false,
        pipe: null
      },
      {
        text: 'Estatus',
        value: 'Status',
        hasImage: false,
        pipe: null
      }
    ],
    editable: false,
    urlEdit: '/crm/fxcoins/pedido/',
    idField: 'IdPedido',
    urlMedia: this.app+'fxcoins/img/',
    fotoField: 'Img',
    show: true,
    urlShow: '/crm/fxcoins/pedido/',
    filtroA: {
      data: [
        {
          value: 'Aprobado',
          texto: 'Aprobado'
        },
        {
          value: 'Pendiente',
          texto: 'Pendiente'
        },
        {
          value: 'Rechazado',
          texto: 'Rechazado'
        }
      ],
      fieldFilter: 'Status'
    }
  };

  public loading: boolean = false;

  constructor(
    public app: AppService,
    private fxcoins: FxcoinsService
  ) {
    this.app.currentModule = 'Fxcoins'
    this.app.currentSection = ' - Pedidos';
  }

  ngOnInit(): void {
    this.loading = true;
    this.fxcoins.getPedidos().subscribe((res: any) => {
      console.log(res);
      this.pedidos = res.pedidos;
      this.loading = false;
    });
  }

}
