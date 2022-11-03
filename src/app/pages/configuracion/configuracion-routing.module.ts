import { UsuarioComponent } from './usuario/usuario.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { EditarPerfilesComponent } from './editar-perfiles/editar-perfiles.component';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';


const routes: Routes = [
  
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 1 }
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 1 }
  },
  {
    path: 'editarusuario/:id',
    component: EditarUsuarioComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 1 }
  },
  {
    path: 'editarperfil/:id',
    component: EditarPerfilesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 1 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
