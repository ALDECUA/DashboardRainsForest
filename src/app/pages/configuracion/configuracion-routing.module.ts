import { UsuarioComponent } from './usuario/usuario.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { EditarPerfilesComponent } from './editar-perfiles/editar-perfiles.component';
import { HasGrantGuard } from 'src/app/guards/has-grant.guard';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { EditarComisionesComponent } from './editar-comisiones/editar-comisiones.component';

const routes: Routes = [
  
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 2 }
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 3 }
  },
  {
    path: 'editarusuario/:id',
    component: EditarUsuarioComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 3 }
  },
  {
    path: 'editarperfil/:id',
    component: EditarPerfilesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 2 }
  },
  {
    path: 'editarcomisones/:id',
    component: EditarComisionesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 43 }
  },
  {
    path: 'comisiones',
    component: ComisionesComponent,
    canActivate: [HasGrantGuard],
    data: { grant: 43 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
