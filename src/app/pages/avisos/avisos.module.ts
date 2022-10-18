import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvisosRoutingModule } from './avisos-routing.module';
import { PromosComponent } from './promos/promos.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    PromosComponent,
    NotificacionesComponent
  ],
  imports: [
    CommonModule,
    AvisosRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    SharedModule,
     NgbModule
  ]
})
export class AvisosModule { }
