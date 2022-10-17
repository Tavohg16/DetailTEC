import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citas/citas.service';
import {
  Cita,
  CitasResponse,
  CitaResponse,
} from '../services/citas/citas.types';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css'],
})
export class GestionCitasComponent implements OnInit {
  protected citas: Cita[] = [];

  constructor(private citasService: CitasService) {}

  ngOnInit(): void {
    this.obtenerCitas();
  }
  /**
   * Esta función llama al servicio de citas, obtiene todos las citas de la base de datos
   * y actualiza la lista de citas del componente.
   */
  protected obtenerCitas(): void {
    this.citasService.todasCitas().subscribe({
      next: (citasResponse: CitasResponse) => {
        if (citasResponse.exito) {
          this.citas = citasResponse.citas.sort();
        } else {
          alert('Error al obtener citas.');
        }
      },
      error: (error) => {
        alert('Error al obtener citas.');
        console.log(error);
      },
    });
  }
  /**
   * Función para borrar un cliente haciendo uso del servicio de clientes.
   * @param id_cita id de la cita que se quiere eliminar.
   */
  protected borrarCita(id_cita: number) {
    this.citasService.borrarCita(id_cita).subscribe({
      next: (citaResponse: CitaResponse) => {
        alert(citaResponse.mensaje);
        this.obtenerCitas();
      },
      error: (error) => {
        alert(`Error al eliminar cita.`);
        console.log(error);
      },
    });
  }

  /**
   * Esta función es para dar un formato al nombre del cliente a partir de varios atributos.
   * @param cita El cliente de la cita del cual se quiere conocer el nombre completo.
   * @returns Nombre del cliente: string.
   */
  protected nombreCompletoCliente(cita: Cita): string {
    return `${cita.nombre_cliente} ${cita.apellido_cliente}`;
  }
  /**
   * Esta función es para dar un formato al nombre del cliente a partir de varios atributos.
   * @param cita El trabajador de la cita del cual se quiere conocer el nombre completo.
   * @returns Nombre del trabajador: string.
   */
  protected nombreCompletoTrabajador(cita: Cita): string {
    return `${cita.nombre_trabajador} ${cita.apellido_trabajador}`;
  }

  protected fechaCita(fechaCita: string) {
    const hora = new Date(fechaCita);
    return hora.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }

  protected horaCita(horaCita: string) {
    const hora = new Date(horaCita);
    return hora.toLocaleTimeString('es-CR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }
}
