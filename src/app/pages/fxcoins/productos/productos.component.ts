import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FxcoinsService } from 'src/app/services/fxcoins.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  public productos: any[] = [];
  public configDataTable = {
    fields: [
      {
        text: 'Nombre',
        value: 'Nombre',
        hasImage: true,
        pipe: null,
      },
      {
        text: 'Categoria',
        value: 'Nombre_Categoria',
        hasImage: false,
        pipe: null
      },
      {
        text: 'Precio',
        value: 'Precio',
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
    editable: true,
    urlEdit: '/crm/fxcoins/editarproducto/',
    idField: 'IdProducto',
    urlMedia: this.app.dominio+'fxcoins/img/',
    fotoField: 'Img',
    show:true,
    urlShow: '/crm/fxcoins/producto/',
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

  public loading: boolean = true;

  constructor(
    public app: AppService,
    private fxcoins: FxcoinsService
  ) {
    this.app.currentModule = 'Fxcoins'
    this.app.currentSection = ' - Productos';
  }

  ngOnInit(): void {
    this.fxcoins.getProductos().subscribe((result: any) => {
      this.loading = false;
      this.productos = result.productos;
    });
    
  }

}
