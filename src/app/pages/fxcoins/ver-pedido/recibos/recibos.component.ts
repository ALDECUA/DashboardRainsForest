import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { FxcoinsService } from 'src/app/services/fxcoins.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.scss']
})
export class RecibosComponent implements OnInit {

  public contador = 0;
  public listItem:any = [];
  public pedidos:any = [];
  public nombre:any;
  public cantidad:any;
  public cantidadtexto:any;
  public totalCantidad:any = 0;
  public nota:any;
  public nopedido:any;
  public fechahoy:any;
  public textoCat:any;
  
  //valdiaciones
  fechav = false;
  codigov = false;
  descv = false;
  cantv = false;
  fxv = false;
  private subscriptions = new Subscription();



  constructor(private el: ElementRef,private fxcoins: FxcoinsService ) { }

  ngOnInit(): void {
    this.fxcoins.disparadorRecibo.subscribe((data:any) => {
      this.pedidos = Object.values(data);
      this.nombre = this.pedidos[0].Nombre;
      this.cantidad = this.pedidos[0].Precio_Final;
      this.cantidadtexto = this.pedidos[0].preciotexto;
      this.totalCantidad = parseInt(this.pedidos[0].Precio_Final);
      this.nota = this.pedidos[0].Nota;
      this.nopedido = this.pedidos[0].IdPedido;
      let txtCategorias = document.getElementById('title_cat');
      if (this.pedidos[0].IdCategoria === 1) {

        txtCategorias.innerHTML = `<p class="fs-2 fw-bold ">RECIBO DE CANJE</p>
        <p><strong>(MENSUALIDAD)</strong></p>`;
        this.textoCat = `<p class="fs-2 fw-bold ">RECIBO DE CANJE</p>
        <p><strong>(MENSUALIDAD)</strong></p>`;
        
      }else if (this.pedidos[0].IdCategoria === 19) {
        txtCategorias.innerHTML = `<p class="fs-2 fw-bold">RECIBO DE CANJE</p>
        <p><strong>(EFECTIVO)</strong></p>`;
        this.textoCat = `<p class="fs-2 fw-bold">RECIBO DE CANJE</p>
        <p><strong>(EFECTIVO)</strong></p>`;
      }else{
        txtCategorias.innerHTML = `<p class="fs-2 fw-bold">RECIBO DE CANJE</p>`;
        this.textoCat = `<p class="fs-2 fw-bold">RECIBO DE CANJE</p>`;
      }
    })
     /* setear fecha de la semana */
     var curr = new Date; // get current date
     this.fechahoy = curr.toLocaleDateString();
  }
 
  public AgregarCampo(){
        
    let fecha = this.el.nativeElement.querySelector('#fecha').value;
    let codigo = this.el.nativeElement.querySelector('#codigo').value;
    let descripcion = this.el.nativeElement.querySelector('#descripcion').value;
    let cantidad = this.el.nativeElement.querySelector('#cantidad').value;
    let fxcoins = this.el.nativeElement.querySelector('#fxcoins').value;

    if (fecha === "") {
      this.fechav = !this.fechav;
      const limpiar = timer(3000);
      limpiar.subscribe( () => this.fechav = !this.fechav );
      return false;
    }
    if (codigo === "") {
      this.codigov = !this.codigov;
      const limpiar = timer(3000);
      limpiar.subscribe( () => this.codigov = !this.codigov );
      return false;
    }
    if (descripcion === "") {
      this.descv = !this.descv;
      const limpiar = timer(3000);
      limpiar.subscribe( () => this.descv = !this.descv );
      return false;
    }
    if (cantidad === "") {
      this.cantv = !this.cantv;
      const limpiar = timer(3000);
      limpiar.subscribe( () => this.cantv = !this.cantv );
      return false;
    }
    if (fxcoins === "") {
      this.fxv = !this.fxv;
      const limpiar = timer(3000);
      limpiar.subscribe( () => this.fxv = !this.fxv );
      return false;
    }
    let fechaItem = new Date(fecha).toLocaleDateString();

    let rowContent:any = {
      fecha: fechaItem,
      codigo: codigo,
      descripcion: descripcion,
      cantidad: cantidad,
      fxcoins: fxcoins
    }; 
    
    this.listItem.push(rowContent);
    console.log(this.totalCantidad);
    console.log(fxcoins);
    this.totalCantidad += parseFloat(fxcoins);

    document.getElementById("textocambio").innerHTML = "";

    this.subscriptions.add(
      this.fxcoins.convertirTexto(
        {
          cantidad: this.totalCantidad
        }
      ).subscribe((res:any) => {
        this.cantidadtexto = res[0].total;
        document.getElementById("textocambio").innerHTML = this.cantidadtexto;
      })
    )
    return true;
  }

  public deleteItem(item){
    console.log(item);

    Swal.fire({
      title: '¿Eliminar elemento?',
      text: "No se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado!',
          'Elemento borrado.',
          'success',
        )
        this.listItem.splice(item,1);
        console.log(this.listItem);
      }
    })
    
  }

  public EnviarRecibo(){
    console.log("enviando...");
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Procesando...',
      showConfirmButton: false,
      timer: 1000
    })

    let items = '';
    let rowimtem = '';


    for (let index = 0; index < this.pedidos.length; index++) {
      const element = this.pedidos[index];
      items+= `
      <tr>
          <td class="text-center">${element.Fch_Pedido}</td>
          <td class="text-center">FXPROD${element.IdPedido}</td>
          <td class="text-center">${element.Producto}</td>
          <td class="text-center">1</td>
          <td class="text-center">$ ${element.Precio_Final}</td>
      </tr>`;
    }
    for (let index = 0; index < this.listItem.length; index++) {
      const element = this.listItem[index];
      rowimtem += `
      <tr>
          <td class="text-center">${element.fecha}</td>
          <td class="text-center">${element.codigo}</td>
          <td class="text-center">${element.descripcion}</td>
          <td class="text-center">${element.cantidad}</td>
          <td class="text-center">$ ${element.fxcoins}</td>
      </tr>`;
      
    }

   
    this.subscriptions.add(
      this.fxcoins.sendRecibos({
        tituloCat: this.textoCat,
        nombre: this.nombre,
        cantidad: this.cantidad,
        cantTxt: this.cantidadtexto,
        totalCant: this.totalCantidad,
        totalFinal: this.totalCantidad,
        nota: this.nota,
        items: items,
        itemrows: rowimtem,
        pedido: this.nopedido,
        fecha: this.fechahoy,
        email: this.pedidos[0].Email
      }).subscribe((res:any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Enviado...',
          showConfirmButton: false,
          timer: 1500
        })
      })
    )




   
    
    
  }
  
  
}
