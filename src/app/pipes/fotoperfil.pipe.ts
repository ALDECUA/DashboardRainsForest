import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';


@Pipe({
  name: 'fotoperfil'
})
export class FotoperfilPipe implements PipeTransform {

  transform(value:string): any {
    return  environment.dominio+"api/storage/usuarios/perfiles/" + value;
  }

}
