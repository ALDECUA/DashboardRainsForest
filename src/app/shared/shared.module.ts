import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { DatatableComponent } from './datatable/datatable.component';
import { SortDirective } from '../directives/sort.directive';
import { FullLoaderComponent } from './full-loader/full-loader.component';

import { DatatableHR } from './datatableHR/datatable.component';
import { DatatableHRVerComponent } from './datatable-hrver/datatable-hrver.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {  ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    DatatableComponent,
    SortDirective,
    FullLoaderComponent,
  
    DatatableHR

  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
   
    DatatableComponent,
    FullLoaderComponent,
    DatatableHR,
   

  ]
})
export class SharedModule { }
