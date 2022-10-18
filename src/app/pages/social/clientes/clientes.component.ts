import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  id: number;
  nombre: string = '';
  telefono: string = '';
  fase: string = '';
  origen: string = '';
  contacto: string = '';

  constructor(
    public app: AppService,
  ) { }

  ngOnInit(): void {
  }

  editar(id: number, nombre: string, telefono: string, fase: string, origen: string, contacto: string) {
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.fase = fase;
    this.origen = origen;
    this.contacto = contacto;
  }
}
