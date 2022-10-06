import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyPipe } from './money.pipe';
import { FotoperfilPipe } from './fotoperfil.pipe';
import { SanitizarPipe } from './sanitizar.pipe';
import { UpperPipe } from './upper.pipe';



@NgModule({
  declarations: [
    MoneyPipe,
    FotoperfilPipe,
    SanitizarPipe,
    UpperPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MoneyPipe,
    FotoperfilPipe,
    SanitizarPipe,
    UpperPipe
  ]
})
export class PipesModule { }
