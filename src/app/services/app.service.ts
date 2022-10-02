import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  private urlDocumentos = environment.api + 'fx/archivos';

  public getDocuementos() {
    return this.http.get(this.urlDocumentos);
  }
}
