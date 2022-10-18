import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';

const routes: Routes = [
  {
    path: '',
    redirectTo:'perfil',
    pathMatch:'full'
  },
  {
    path: 'perfil',
    component: UsuariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
