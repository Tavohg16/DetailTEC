import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SucursalesService } from '../services/sucursales/sucursales.service';
import {
  Sucursal,
  SucursalesResponse,
  SucursalResponse
} from '../services/sucursales/sucursales.types'

@Component({
  selector: 'app-gestion-sucursales',
  templateUrl: './gestion-sucursales.component.html',
  styleUrls: ['./gestion-sucursales.component.css']
})
export class GestionSucursalesComponent implements OnInit {
  protected sucursales: Sucursal[] = [];

  constructor(
    private sucursalesService: SucursalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ObtenerSucursales();
  }
  /**
   * Esta función llama al servicio de sucursales, obtiene todos las sucursales de la base de datos
   * y actualiza la lista de sucursales del componente.
   */
   protected ObtenerSucursales(): void {
    this.sucursalesService.todasSucursales().subscribe({
      next: (sucursalesResponse: SucursalesResponse) => {
        if (sucursalesResponse.exito) {
          this.sucursales = sucursalesResponse.sucursales.sort(
            (sucursalA, sucursalB) => {
              return sucursalA.nombre_sucursal.localeCompare(
                sucursalB.nombre_sucursal
              );
            }
          );
        } else {
          alert('Error al obtener sucursales.');
        }
      },
      error: (error) => {
        alert('Error al obtener sucursales.');
        console.log(error);
      },
    });
  }

  
  /**
   * Esta función es para dar un formato a la de inicio de gerencia a partir de varios atributos.
   * @param sucursal la sucursal de la cual se quiere obtener la fecha de inicio de gerencia actual.
   * @returns Fecha de inicio de la gerencia actual: string.
   */
   protected fechaInicioGerencia(sucursal: Sucursal): string {
    const fecha = new Date(sucursal.fecha_inicio_gerencia);
    return fecha.toLocaleDateString('es');
  }

  /**
   * Esta función es para dar un formato a la de inicio de apertura a partir de varios atributos.
   * @param sucursal la sucursal de la cual se quiere obtener la fecha de apertura.
   * @returns Fecha de apertura: string.
   */
   protected fechaApertura(sucursal: Sucursal): string {
    const fecha = new Date(sucursal.fecha_apertura);
    return fecha.toLocaleDateString('es');
  }

  /**
   * Función para borrar una sucursal haciendo uso del servicio de sucursales.
   * @param nombre_sucursal nombre de la sucursal que se quiere eliminar.
   */
   protected borrarSucursal(nombre_sucursal: string) {
    this.sucursalesService.borrarSucursal(nombre_sucursal).subscribe({
      next: (sucursalResponse: SucursalResponse) => {
        alert(sucursalResponse.mensaje);
        this.ObtenerSucursales()
      },
      error: (error) => {
        alert(`Error al eliminar sucursal.`);
        console.log(error);
      },
    });
  }

  /**
   * Función para navegar a la pantalla de crear sucursal.
   */
   protected crearSucursal() {
    this.router.navigate(['sucursal']);
  }

  protected editarSucursal(sucursal: Sucursal) {
    this.router.navigate(['sucursal'], {state: sucursal});
  }

  /**
   * Esta función es para dar un formato al nombre del trabajador gerente a partir de varios atributos.
   * @param sucursal La sucursal de la cual se quiere conocer el nombre del gerente.
   * @returns Nombre del gerente: string.
   */
   protected nombreCompleto(sucursal: Sucursal): string {
    return `${sucursal.nombre_trabajador_gerente} ${sucursal.primer_apellido_trabajador_gerente}`;
  }
  

}
