import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FxcoinsService } from 'src/app/services/fxcoins.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  public producto: any = {};

  constructor(
    public app: AppService,
    private activatedRouter: ActivatedRoute,
    private fxcoins: FxcoinsService
  ) { }

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params: any) => {
      const id = params.params.id;
      this.fxcoins.getProducto(id).subscribe((producto: any) => {
        console.log(producto);
        this.producto = producto[0];
      });
    });
  }

}
