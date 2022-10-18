import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inversionistas',
  templateUrl: './inversionistas.component.html',
  styleUrls: ['./inversionistas.component.scss'],
})
export class InversionistasComponent implements OnInit {
  constructor(
    public app: AppService,
    public controldecalidad: ControlcalidadService,
    public toast: ToastrService
  ) {}
  public registro = {
    Nombre: null,
    Nombre_S: '',
    Apellido_Pat: null,
    Apellido_Mat: '',
    Email: null,
    Num_Cel: null,
    Whats: null,
    asesor: null,
    Nacimiento: new Date(),
    Fecha: new Date(),
    SocioCom: null,
    IdLider: null,
  };
  public loading: boolean = true;
  public registros = { aceptados: [], pendientes: [] };
  public configDataTable: any = {
    fields: [
      {
        text: 'Nombre inversionista',
        value: 'Nombre',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Email',
        value: 'Email',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Telefono',
        value: 'Num_Cel',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Whatsapp',
        value: 'WhatssApp',
        hasImage: false,
        pipe: null,
      },
      {
        text: 'Asesor',
        value: 'Nombre_Asesor',
        hasImage: false,
        pipe: null,
      },
    ],
    editable: false,
    show: true,
    urlEdit: '/crm/controlcalidad/editarhrInv/',
    urlShow: '/crm/controlcalidad/editarhrInv/',
    idField: 'IdPersona',
    idField2: 'IdLote',
    idField3: 'IdHR',
    fotoField: 'Foto_Perfil',
    filtroA: false,
  };
  ngOnInit(): void {
    this.GetInfo();
  }

  GetInfo() {
    this.controldecalidad.getRegistrosInversionistas().subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].RegistroAceptado == 1) {
          this.registros.aceptados.push(res[i]);
        } else {
          this.registros.pendientes.push(res[i]);
        }
      }
      this.loading = false;
    });
  }
  public registro_persona() {
    if (
      this.registro.Nombre == null ||
      this.registro.Apellido_Pat == null ||
      this.registro.Email == null ||
      this.registro.Num_Cel == null ||
      this.registro.Whats == null
    ) {
      this.toast.error(
        'Todos los campos marcados (*) son obligatorios',
        'Registro no realizado',
        {
          timeOut: 3000,
        }
      );
      this.loading = false;
      return;
    }
    if (
      this.registro.Num_Cel < 1000000000 ||
      this.registro.Whats < 1000000000
    ) {
      this.toast.error(
        'Ingresa tu número telefónico completo',
        'Número invalido',
        {
          timeOut: 3000,
        }
      );
      this.loading = false;
      return;
    }
    this.loading = true;
    var url =
      'https://emailvalidation.abstractapi.com/v1/?api_key=0c67d1ee715b4f1c8d1466f90aaf9111&email=' +
      this.registro.Email;
    fetch(url, {
      method: 'GET', // or 'PUT'
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        if (
          (response.is_valid_format.value === true &&
            response.deliverability === 'DELIVERABLE') ||
          (response.is_valid_format.value === true &&
            response.deliverability === 'UNKNOWN')
        ) {
          //exito
          this.loading = true;
          this.app.InsertarPersona(this.registro).subscribe(
            (res: any) => {
              if (res.inserted == true) {
                this.controldecalidad.InvPresistema({
                    IdPersona: res.persona[0].IdPersona,
                    IdAsesor: this.registro.asesor,
                    SocioCom: this.registro.SocioCom,
                    IdLider: this.registro.IdLider,
                  })
                  .subscribe((ress: any) => {
                    if (ress.error != true) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso!',
                        text: 'Tu contraseña ha sido enviada a tu correo',
                        confirmButtonColor: '#101c64',
                      }).then(function () {
                        window.location.reload();
                      });
                    }
                  });
              } else {
                let text = res.message;
                if (text.includes('UNIQUE KEY')) {
                  Swal.fire({
                    icon: 'error',
                    title: '¡Correo duplicado!',
                    text: 'Este correo se encuentra en uso',
                    confirmButtonColor: '#101c64',
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Tuvimos un problema',
                    text: 'Por favor intenta nuevamente, si el problema persiste contacte a soporte',
                    confirmButtonColor: '#101c64',
                  });
                }
              }
              this.loading = false;
            },
            (error) => {
              this.loading = false;
            }
          );
        } else {
          this.loading = false;
          this.toast.error(
            'Por favor ingresa un correo real para recibir tu contraseña.',
            'Correo electronico invalido',
            {
              timeOut: 3000,
            }
          );
        }
      });
  }
}
