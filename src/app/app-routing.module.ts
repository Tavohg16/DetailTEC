import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { GestionTrabajadoresComponent } from './gestion-trabajadores/gestion-trabajadores.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GestionSucursalesComponent } from './gestion-sucursales/gestion-sucursales.component';
import { 
  AuthGuardService as AuthGuard 
} from './services/auth-guard.service';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
/**
 * Definiendo rutas a componentes
 */
const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'gestion-trabajadores', component: GestionTrabajadoresComponent ,  pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'trabajador', component: TrabajadorComponent ,  pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'gestion-sucursales', component: GestionSucursalesComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'sucursal', component: SucursalComponent ,  pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'gestion-proveedores', component: GestionProveedoresComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'proveedor', component: ProveedorComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
