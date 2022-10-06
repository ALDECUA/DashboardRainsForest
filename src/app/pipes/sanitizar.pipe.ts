import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizar'
})
export class SanitizarPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer,
  ) { }

  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

}
