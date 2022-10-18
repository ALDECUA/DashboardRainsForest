import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { event } from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { FxcoinsService } from 'src/app/services/fxcoins.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss'],
})
export class AgregarProductoComponent implements OnInit {
  public subscriptions = new Subscription();

  public Categoria = 0;
  public Precio_A = null;
  public Precio_N = null;
  public Precio = null;
  public Nombre;
  public Descripcion = '';
  public Nota = null;
  public Multi;
  public Usuario: any = {};
  public Slug;
  public imagen;
  public mult;

  constructor(
    public app: AppService,
    private auth: AuthService,
    private fxcoins: FxcoinsService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.Usuario = this.auth.user;
    console.log(this.Usuario);
  }

  public AgregarProductoFx() {
    console.log(
      this.Categoria,
      this.Descripcion,
      this.Precio,
      this.Precio_A,
      this.Precio_N,
      this.Nombre,
      this.Nota,
      this.Usuario,
      this.Multi
    );
    if(this.Multi==true)
      {
        this.mult=1;
      }
      else{
        this.mult=0;
      }
    this.subscriptions.add(
      this.fxcoins
        .AgregarProducto({
          Nombre: this.Nombre,
          Precio: this.Precio,
          Img: this.imagen,
          Categoria: this.Categoria,
          Multi: this.mult,
          Precio_A: this.Precio_A,
          Precio_N: this.Precio_N,
          Usuario: this.Usuario.Nombre,
          Descripcion: this.Descripcion,
          Nota: this.Nota,
          Slug: this.Slug,
          Solo_ECoins: 0,
          Precio_Ecoins: 0
        })
        .subscribe((res: any) => {
          console.log(res);
        })
    );
  }
  public subirImagen(event) {
    console.log(event);
    let formData = new FormData();
    formData.append('foto', event[0], 'imagen.png');
    formData.append('NombreProducto', this.Nombre);
    this.subscriptions.add(
      this.fxcoins.SubirFotoProducto(formData).subscribe((res: any) => {
        console.log(res);
        if (res == '{"error":1,"message":"No se subio la imagen"}') {
          this.toast.warning(
            '',
            'Ocurrio un error al cargar la imagen, intenta nuevamente'
          );
        } else {
          this.imagen = res;
        }
      })
    );
  }
}
