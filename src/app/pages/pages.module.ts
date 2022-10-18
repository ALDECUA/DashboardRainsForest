import { ComponentsModule } from './components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { AppService } from '../services/app.service';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    PipesModule
  ]
})
export class PagesModule {
  constructor(private app: AppService) {
    this.app.renderApp = true;
  }
}
