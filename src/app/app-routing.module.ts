import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { GestionTrabajadoresComponent } from './gestion-trabajadores/gestion-trabajadores.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GestionSucursalesComponent } from './gestion-sucursales/gestion-sucursales.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { ProductoComponent } from './producto/producto.component';
import { GestionLavadosComponent } from './gestion-lavados/gestion-lavados.component';
import { LavadoComponent } from './lavado/lavado.component';
import { GestionClientesComponent } from './gestion-clientes/gestion-clientes.component';
import { ClienteComponent } from './cliente/cliente.component';
import { GestionCitasComponent } from './gestion-citas/gestion-citas.component';
import { ReportesComponent } from './reportes/reportes.component';
import { FacturaComponent } from './factura/factura.component';
import { MisDatosComponent } from './mis-datos/mis-datos.component';
import { GestionCitasClienteComponent } from './gestion-citas-cliente/gestion-citas-cliente.component';
import { MisPuntosComponent } from './mis-puntos/mis-puntos.component';
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
  { path: 'gestion-productos', component: GestionProductosComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'producto', component: ProductoComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'gestion-lavados', component: GestionLavadosComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'lavado', component: LavadoComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'gestion-clientes', component: GestionClientesComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'cliente', component: ClienteComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'gestion-citas', component: GestionCitasComponent, pathMatch: 'full'},
  { path: 'factura', component: FacturaComponent ,  pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'reportes', component: ReportesComponent ,  pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'mis-datos', component: MisDatosComponent ,  pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'gestion-citas-cliente', component: GestionCitasClienteComponent ,  pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'mis-puntos', component: MisPuntosComponent ,  pathMatch: 'full', canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
