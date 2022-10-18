import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { observable, Observable, Subscriber } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ZapierService } from 'src/app/services/zapier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addelemento',
  templateUrl: './addelemento.component.html',
  styleUrls: ['./addelemento.component.scss']
})
export class AddelementoComponent implements OnInit {

  public formulario: any;
  public formu = [];
  private dataconfig = [];
  public OpcionMenu:string;
  public listmenusistem: any = [];
  private responseData: any;
  private User = this.auth.user.Nombre + ' ' + this.auth.user.Apellidos;
  public listarOpciones:any = [];
  public loadingList: boolean = true;
  public loadingSend: boolean = true;
  public title:string;
  public dataInfo:any  = {

  }

  constructor(public app: AppService, private auth: AuthService, private sistema: ZapierService, private el: ElementRef) {

  }

  ngOnInit(): void {

    console.log(this.User);
    //Traemos toda la lista de los menus
    this.sistema.datamenus().subscribe((res: any) => {
      this.listmenusistem = res.data;
      console.log(this.listmenusistem);
      
    });

    /* 
      Activamos el disparador del formulario para pasar los parametros en especificos que vamos a recibir,
      como el menu y la opcion
    */
    this.sistema.disparadorForm.subscribe((data: any) => {
      //Loading
      this.loadingList = false;
      //Asignamos los datos del menu y la opcion
      this.dataconfig = data;
      this.responseData = data.opcion;
      this.OpcionMenu = this.dataconfig['opcion'];
      this.title = this.OpcionMenu;

      const observable = new Observable(subscriber => {
        subscriber.next(this.ListarOpciones(this.dataconfig));
        subscriber.next(this.generateForm(this.dataconfig));
       
        setTimeout(() => {
          subscriber.next(this.listo(1));
          subscriber.complete();
        }, 1000);
      });

      observable.subscribe({
        next(x) { console.log('....')},
        error(err) { console.error('something wrong occurred: ' + err); },
        complete() { console.log('done');}
      });
      
    });

  }

  listo(event){
    if (event === 1) {
      this.loadingList = true;
    }else{
      this.loadingSend = true;
    }
  }

  ListarOpciones(opcion){
    this.sistema.ObtenerSistema(opcion.opcion).subscribe((res:any) => {
      this.listarOpciones = res;
    })
  }


  generateForm(data) {

    let formulario: any;

    switch (data.opcion) {
      case 'pasos':

        formulario = `
          <form class="row g-3">
            <div class="col-md-12">
              <label for="paso" class="form-label">Nombre del paso</label>
              <input type="text" class="form-control" id="paso">
            </div>
          </form>`;
        break;

      case 'mensajes':
        formulario = `
          <form class="row g-3">
            <div class="col-md-12">
              <label for="mensaje" class="form-label">Nombre del mensaje</label>
              <input type="text" class="form-control" id="mensaje">
            </div>
          </form>`;
        break;

      case 'pasosUpdate':
        formulario = `
          <form class="row g-3">
            <div class="col-md-12">
              <label for="paso" class="form-label">Nombre del paso</label>
              <input type="text" class="form-control" id="paso" value="${data.nombre}">
            </div>
          </form>`;
        break;

        case 'mensajesUpdate':
          formulario = `
            <form class="row g-3">
              <div class="col-md-12">
                <label for="paso" class="form-label">Nombre del mensaje</label>
                <input type="text" class="form-control" id="mensaje" value="${data.nombre}">
              </div>
            </form>`;
          break;

      default:
        break;
    }

    let form = document.getElementById("form");
    form.innerHTML = formulario;
     
  }

  editar(item){
    console.log(item);
    let valores:any = {};

    if (Object.keys(item)[0] == 'IdCatPasos') {
      
          valores.opcion = 'pasosUpdate';
          valores.nombre = item.nombre;
          valores.Idpasos = item.IdCatPasos;
      
    }else{

      valores.opcion = 'mensajesUpdate';
      valores.nombre = item.nombre;
      valores.IdMensaje = item.IdMensaje;

    }

    this.dataconfig = valores;
    console.log(this.dataconfig);
    console.log("nmuevos valores");
    this.generateForm(this.dataconfig);

  }

    send(){
      this.loadingSend = false;
      let resultado:any = [];
      resultado = this.datosForumarios(this.dataconfig);
      console.log("mandando send.....");
      console.log(resultado);
      switch (resultado.tipo) {
        case 'pasos':

          if (resultado.paso === "") {

            document.querySelector('#paso').classList.add('is-invalid');
            setTimeout(() => {
              document.querySelector('#paso').classList.remove('is-invalid');
            }, 2500);
            return
          }

          const observable = new Observable(subscriber => {
            subscriber.next(this.insertarElemento(resultado,'pasos'));
            setTimeout(() => {
              subscriber.next(this.ListarOpciones(this.dataconfig));
              subscriber.next(this.listo(2));
              subscriber.complete();             
            }, 1000);
          });
    
          observable.subscribe({
            next(x) { console.log('....')},
            error(err) { console.error('something wrong occurred: ' + err); },
            complete() { console.log('done');}
          });

          break;

        case 'mensajes':
          
          if (resultado.mensaje === "") {

            document.querySelector('#mensaje').classList.add('is-invalid');
            setTimeout(() => {
              document.querySelector('#mensaje').classList.remove('is-invalid');
            }, 2500);
            return
          }

          const observableTwo = new Observable(subscriber => {
            subscriber.next(this.insertarElemento(resultado,'mensajes'));
            setTimeout(() => {
              subscriber.next(this.ListarOpciones(this.dataconfig));
              subscriber.next(this.listo(2));
              subscriber.complete();             
            }, 1000);
          });
    
          observableTwo.subscribe({
            next(x) { console.log('....')},
            error(err) { console.error('something wrong occurred: ' + err); },
            complete() { console.log('done');}
          });

          break;

        case 'pasosUpdate':
 
          if (resultado.paso === "") {

            document.querySelector('#paso').classList.add('is-invalid');
            setTimeout(() => {
              document.querySelector('#paso').classList.remove('is-invalid');
            }, 2500);
            this.listo(2);
            return
          }

            const observableThree = new Observable(subscriber => {
              subscriber.next(this.insertarElemento(resultado,'pasosUpdate'));
              setTimeout(() => {
                subscriber.next(this.ListarOpciones(resultado));
                subscriber.next(this.listo(2));
                subscriber.complete();             
              }, 1000);
            });
      
            observableThree.subscribe({
              next(x) { console.log('....')},
              error(err) { console.error('something wrong occurred: ' + err); },
              complete() { console.log('done');}
            });

          break;

        case 'mensajesUpdate':

          if (resultado.mensaje === "") {

            document.querySelector('#mensaje').classList.add('is-invalid');
            setTimeout(() => {
              document.querySelector('#mensaje').classList.remove('is-invalid');
            }, 2500);
            this.listo(2);
            return
          }

            const observableCuatro = new Observable(subscriber => {
              subscriber.next(this.insertarElemento(resultado,'mensajesUpdate'));
              setTimeout(() => {
                subscriber.next(this.ListarOpciones(resultado));
                subscriber.next(this.listo(2));
                subscriber.complete();             
              }, 1000);
            });
      
            observableCuatro.subscribe({
              next(x) { console.log('....')},
              error(err) { console.error('something wrong occurred: ' + err); },
              complete() { console.log('done');}
            });
          break;
      
        default:
          break;
      }
    }



   private insertarElemento(resultado,elemento:any){
 
     let result:any;

     switch (elemento) {
      case 'pasos':

        this.sistema.InsertarPasos({
          pasos: resultado.paso,
          user: this.User
        }).subscribe((res:any) => {
          console.log(res);

          if (res.inserted === 1) {
            
                Swal.fire({
                  text: 'Agregado con exito!!',
                  icon: 'success',
                  toast: true,
                  showConfirmButton: false,
                  position: 'top-end',
                  timer: 1500
                })
                

              setTimeout(() => {
                this.el.nativeElement.querySelector('#paso').value = "";
              }, 1000);
    
          }else{

              Swal.fire({
                text: 'Ocurrio un error, Intente más tarde!',
                icon: 'error',
                toast: true,
                showConfirmButton: false,
                position: 'top-end',
                timer: 1500
              })
              
          }

        })

        break;

      case 'pasosUpdate':
  
        this.sistema.UpdatePasos({
          pasos: resultado.paso,
          user: this.User,
          id: resultado.Idpasos
        }).subscribe((res:any) => {
          console.log(res);

          if (res.updated === 1) {
            
            Swal.fire({
              text: 'Actualizado con exito!!',
              icon: 'success',
              toast: true,
              showConfirmButton: false,
              position: 'top-end',
              timer: 1500
            })
            

          setTimeout(() => {
            this.el.nativeElement.querySelector('#paso').value = "";
          }, 1000);

      }else{

          Swal.fire({
            text: 'Ocurrio un error, Intente más tarde!',
            icon: 'error',
            toast: true,
            showConfirmButton: false,
            position: 'top-end',
            timer: 1500
          })
          
      }


        })
        
        break;

      case 'mensajes':

        console.log(resultado);
        this.sistema.InsertarMensajes({
          mensaje: resultado.mensaje,
          user: this.User
        }).subscribe((res:any) => {
          console.log(res);
          if (res.inserted === 1) {
            
            setTimeout(() => {
              Swal.fire({
                text: 'Agregado con exito!!',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                position: 'top-end',
                timer: 1500
              })
              
            }, 1000);

            setTimeout(() => {
              this.el.nativeElement.querySelector('#mensaje').value = "";
            }, 1000);
  
        }else{
          setTimeout(() => {
            Swal.fire({
              text: 'Ocurrio un error, Intente más tarde!',
              icon: 'error',
              toast: true,
              showConfirmButton: false,
              position: 'top-end',
              timer: 1500
            })
            
          }, 1000);
        }
        })

        break;


        case 'mensajesUpdate':

          console.log(resultado);

  
        this.sistema.UpdateMensajes({
          mensajes: resultado.mensaje,
          user: this.User,
          id: resultado.IdMensaje
        }).subscribe((res:any) => {
          console.log(res);

          if (res.updated === 1) {
            
            Swal.fire({
              text: 'Actualizado con exito!!',
              icon: 'success',
              toast: true,
              showConfirmButton: false,
              position: 'top-end',
              timer: 1500
            })
            

          setTimeout(() => {
            this.el.nativeElement.querySelector('#paso').value = "";
          }, 1000);

      }else{

          Swal.fire({
            text: 'Ocurrio un error, Intente más tarde!',
            icon: 'error',
            toast: true,
            showConfirmButton: false,
            position: 'top-end',
            timer: 1500
          })
          
      }


        })
        
        break;
     
      default:
        break;
     }
     
   }

    private datosForumarios(data:any){

      console.log(data);
  
      let result:any = {};
  
      if (data.opcion == 'pasos') {
        result.paso = this.el.nativeElement.querySelector('#paso').value;
        result.tipo = 'pasos';
        return result;
      }
      if (data.opcion == 'mensajes') {
        result.mensaje = this.el.nativeElement.querySelector('#mensaje').value;
        result.tipo = 'mensajes';
        return result;
      }
      if (data.opcion == 'pasosUpdate') {
        result.paso = this.el.nativeElement.querySelector('#paso').value;
        result.tipo = 'pasosUpdate';
        result.opcion = 'pasos';
        result.Idpasos = data.Idpasos;
        return result;
      }
      if (data.opcion == 'mensajesUpdate') {
        result.mensaje = this.el.nativeElement.querySelector('#mensaje').value;
        result.tipo = 'mensajesUpdate';
        result.opcion = 'mensajes';
        result.IdMensaje = data.IdMensaje;
        return result;
      }

      return result;
    }


}
