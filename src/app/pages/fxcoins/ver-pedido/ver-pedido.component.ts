import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { FxcoinsService } from 'src/app/services/fxcoins.service';

@Component({
  selector: 'app-ver-pedido',
  templateUrl: './ver-pedido.component.html',
  styleUrls: ['./ver-pedido.component.scss']
})
export class VerPedidoComponent implements OnInit {

  public producto: any = {};
  public pedido: any = {};
  public showBtn: any = true;

  constructor(
    public app: AppService,
    private fxcoins: FxcoinsService,
    private activatedRouter: ActivatedRoute,
    private toast: ToastrService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params: any) => {
      this.fxcoins.getPedido(params.params.id).subscribe((res: any) => {
        console.log(res);
        this.pedido = res;
        if (res.IdStatus != 3) {
          //this.showBtn = true;
        }
      })
    });
  }

  generarRecibo(){
     this.fxcoins.disparadorRecibo.emit(
       {
         data:this.pedido
       }
   )};


  public updateStPedido() {
    this.fxcoins.updateStatusPedido({
      IdStatus: this.pedido.IdStatus,
      IdPedido: this.pedido.IdPedido,
      IdPersona: this.pedido.IdPersona,
      Precio_Final: this.pedido.Precio_Final,
      Email: this.pedido.Email,
      nombre: this.pedido.Nombre,
      producto: this.pedido.Producto,
      Nota: this.pedido.Nota
    }).subscribe((res: any) => {
      this.showBtn = false;
      if (res.error !== true) {
        this.toast.success('', 'Estatus actualizado!', { timeOut: 2000 });
      }
    });
  }

  public verRecibo() {
    window.open('https://crm-fx.herokuapp.com/pedidos/generar_recibo/' + this.pedido.IdPedido + '/' + this.pedido.IdPersona + '', 'blank');
  }
}
