import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { GestionTrabajadoresComponent } from './gestion-trabajadores/gestion-trabajadores.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { GestionSucursalesComponent } from './gestion-sucursales/gestion-sucursales.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { ProductoComponent } from './producto/producto.component';
import { GestionLavadosComponent } from './gestion-lavados/gestion-lavados.component';
import { LavadoComponent } from './lavado/lavado.component';
import { GestionClientesComponent } from './gestion-clientes/gestion-clientes.component';
import { ClienteComponent } from './cliente/cliente.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GestionTrabajadoresComponent,
    TrabajadorComponent,
    GestionSucursalesComponent,
    SucursalComponent,
    GestionProveedoresComponent,
    ProveedorComponent,
    GestionProductosComponent,
    ProductoComponent,
    GestionLavadosComponent,
    LavadoComponent,
    GestionClientesComponent,
    ClienteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
