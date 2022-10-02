import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrabajadoresService } from '../services/trabajadores/trabajadores.service';
import {
  Trabajador,
  TrabajadoresResponse,
  TrabajadorResponse,
} from '../services/trabajadores/trabajadores.types';

@Component({
  selector: 'app-gestion-trabajadores',
  templateUrl: './gestion-trabajadores.component.html',
  styleUrls: ['./gestion-trabajadores.component.css'],
})
export class GestionTrabajadoresComponent implements OnInit {
  protected trabajadores: Trabajador[] = [];

  constructor(
    private trabajadoresService: TrabajadoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerTrabajadores();
  }

  /**
   * Esta función llama al servicio de trabajadores, obtiene todos los trabajadores de la base de datos
   * y actualiza la lista de trabajadores el componente.
   */
  protected obtenerTrabajadores(): void {
    this.trabajadoresService.todosTrabajadores().subscribe({
      next: (trabajadoresResponse: TrabajadoresResponse) => {
        if (trabajadoresResponse.exito) {
          this.trabajadores = trabajadoresResponse.trabajadores.sort(
            (trabajadorA, trabajadorB) => {
              return this.nombreCompleto(trabajadorA).localeCompare(
                this.nombreCompleto(trabajadorB)
              );
            }
          );
        } else {
          alert('Error al obtener trabajadores.');
        }
      },
      error: (error) => {
        alert('Error al obtener trabajadores.');
        console.log(error);
      },
    });
  }

  /**
   * Esta función es para dar un formato al nombre completo del trabajador a partir de varios atributos.
   * @param trabajador El trabajador del que se quiere obtener el nombre completo.
   * @returns Nombre completo del trabajador: string.
   */
  protected nombreCompleto(trabajador: Trabajador): string {
    return `${trabajador.nombre} ${trabajador.primer_apellido} ${trabajador.segundo_apellido}`;
  }

  /**
   * Esta función es para dar un formato a la fecha de ingreso del trabajador a partir de varios atributos.
   * @param trabajador El trabajador del que se quiere obtener la fecha de ingreso.
   * @returns Fecha de ingreso del trabajador: string.
   */
  protected fechaIngreso(trabajador: Trabajador): string {
    const fecha = new Date(trabajador.fecha_ingreso);
    return fecha.toLocaleDateString('es');
  }

  /**
   * Esta función es para dar un formato a la fecha de nacimiento del trabajador a partir de varios atributos.
   * @param trabajador El trabajador del que se quiere obtener la fecha de nacimiento.
   * @returns Fecha de nacimiento del trabajador: string.
   */
  protected fechaNacimiento(trabajador: Trabajador): string {
    const fecha = new Date(trabajador.fecha_nacimiento);
    return fecha.toLocaleDateString('es');
  }

  /**
   * Esta función es para calcular y dar un formato a la edad del trabajador a partir de varios atributos.
   * @param trabajador El trabajador del que se quiere obtener la edad.
   * @returns Edad del trabajador: string.
   */
  protected edad(trabajador: Trabajador): string {
    const hoy = new Date();
    const fechaNacimiento = new Date(trabajador.fecha_nacimiento);

    const diferencia = hoy.getFullYear() - fechaNacimiento.getFullYear();

    if (
      hoy.getMonth() < fechaNacimiento.getMonth() ||
      (hoy.getMonth() === fechaNacimiento.getMonth() &&
      hoy.getDate() < fechaNacimiento.getDate())
    ) {
      return (diferencia - 1).toString();
    }

    return diferencia.toString();
  }

  /**
   * Función para navegar a la pantalla de crear trabajador.
   */
  protected crearTrabajador() {
    this.router.navigate(['trabajador']);
  }

  /**
   * Función para navegar a la pantalla de editar trabajador.
   */
  protected editarTrabajador(trabajador: Trabajador) {
    this.router.navigate(['trabajador'], { state: trabajador });
  }

  /**
   * Función para editar un trabajador haciendo uso del servicio de trabajadores.
   * @param cedula_trabajador Cédula del trabajador que se quiere eliminar.
   */
  protected eliminarTrabajador(cedula_trabajador: string) {
    this.trabajadoresService.borrarTrabajador(cedula_trabajador).subscribe({
      next: (trabajadorResponse: TrabajadorResponse) => {
        alert(trabajadorResponse.mensaje);
        this.obtenerTrabajadores()
      },
      error: (error) => {
        alert(`Error al eliminar trabajador.`);
        console.log(error);
      },
    });
  }
}
