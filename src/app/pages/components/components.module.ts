import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EjemploComponent } from './ejemplo/ejemplo.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    EjemploComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule
  ],
  exports:[
    EjemploComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class ComponentsModule { }
