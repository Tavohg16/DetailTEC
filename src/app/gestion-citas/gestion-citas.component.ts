import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CitasService } from '../services/citas/citas.service';
import {
  Cita,
  CitasResponse,
  CitaResponse,
} from '../services/citas/citas.types';
import { LavadosService } from '../services/lavados/lavados.service';
import { Lavado, LavadosResponse } from '../services/lavados/lavados.types';
import { SucursalesService } from '../services/sucursales/sucursales.service';
import {
  Sucursal,
  SucursalesResponse,
} from '../services/sucursales/sucursales.types';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css'],
})
export class GestionCitasComponent implements OnInit {
  protected citas: Cita[] = [];
  protected sucursales: Sucursal[] = [];
  protected lavados: Lavado[] = [];
  protected title = 'Gestión de Citas';
  protected citaForm: FormGroup;
  protected loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private citasService: CitasService,
    private sucursalesService: SucursalesService,
    private lavadosService: LavadosService
  ) {
    this.citaForm = this.formBuilder.group({
      cedula_cliente: [
        null,
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      placa_vehiculo: [null, Validators.required],
      nombre_sucursal: [null, Validators.required],
      nombre_lavado: [null, Validators.required],
      fecha: [null, Validators.required],
      hora: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerLavados();
    this.obtenerSucursales();
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
          this.citas = citasResponse.citas.sort((dateA: Cita, dateB: Cita) => {
            return (
              new Date(dateA.hora).valueOf() - new Date(dateB.hora).valueOf()
            );
          });
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
   * Esta función llama al servicio de sucursales, obtiene todos las sucursales de la base de datos
   * y actualiza la lista de sucursales del componente.
   */
  protected obtenerSucursales(): void {
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
   * Esta función llama al servicio de productos, obtiene todos los productos de la base de datos
   * y actualiza la lista de productos del componente.
   */
  protected obtenerLavados(): void {
    this.lavadosService.todosLavados().subscribe({
      next: (lavadosResponse: LavadosResponse) => {
        if (lavadosResponse.exito) {
          this.lavados = lavadosResponse.lavados.sort((lavadoA, lavadoB) => {
            return lavadoA.nombre_lavado.localeCompare(lavadoB.nombre_lavado);
          });
        } else {
          alert('Error al obtener lista de lavados.');
        }
      },
      error: (error) => {
        alert('Error al obtener lista de lavados.');
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

  protected horaInicioCita(cita: Cita) {
    const hora = new Date(cita.hora);
    return hora.toLocaleTimeString('es-CR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  protected horaFinalizacionCita(cita: Cita) {
    let hora = new Date(cita.hora);
    hora = this.addMinutes(hora, cita.duracion);
    return hora.toLocaleTimeString('es-CR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  protected minDate() {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  protected addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }

  protected duracionLavadoSeleccionado(): number {
    if (!this.citaForm.value.nombre_lavado) {
      return 0;
    } else {
      const duracion = this.lavados.find(
        (lavado: Lavado) =>
          lavado.nombre_lavado === this.citaForm.value.nombre_lavado
      )?.duracion;
      return duracion ? duracion : 0;
    }
  }

  protected horaDisponible(): Boolean {
    if (
      !this.citaForm.value.fecha ||
      !this.citaForm.value.hora ||
      this.citaForm.value.hora.hour < 8 ||
      this.citaForm.value.hora.hour > 16
    ) {
      return false;
    }
    let horaDisponible = true;
    this.citas.forEach((cita: Cita) => {
      const horaSeleccionada = new Date(
        this.citaForm.value.fecha.year,
        this.citaForm.value.fecha.month - 1,
        this.citaForm.value.fecha.day,
        this.citaForm.value.hora.hour,
        this.citaForm.value.hora.minute
      );
      const horaFinalizacionSeleccionada = this.addMinutes(
        horaSeleccionada,
        this.duracionLavadoSeleccionado()
      );
      const horaInicioCita = new Date(cita.hora);
      const horaFinalizacionCita = this.addMinutes(
        horaInicioCita,
        cita.duracion
      );
      if (
        (horaSeleccionada >= horaInicioCita &&
          horaSeleccionada <= horaFinalizacionCita) ||
        (horaFinalizacionSeleccionada >= horaInicioCita &&
          horaFinalizacionSeleccionada <= horaFinalizacionCita) ||
        horaFinalizacionSeleccionada.getHours() > 17 ||
        (horaFinalizacionSeleccionada.getHours() >= 17 &&
          horaFinalizacionSeleccionada.getMinutes() > 0)
      ) {
        horaDisponible = false;
      }
    });
    return horaDisponible;
  }

  facturarCita(cita: Cita) {
    this.router.navigate(['factura'], { state: cita  });
  }

  // Getter para acceder facilmente a los form fields
  get citaFormControls() {
    return this.citaForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.citaForm.invalid) {
      return;
    }

    this.loading = true;
    this.citasService
      .crearCita(this.formatoCita(this.citaForm.value))
      .subscribe({
        next: (citaResponse: CitaResponse) => {
          alert(citaResponse.mensaje);
          this.loading = false;
          this.citaForm = this.formBuilder.group({
            cedula_cliente: [
              null,
              [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
            ],
            placa_vehiculo: [null, Validators.required],
            nombre_sucursal: [null, Validators.required],
            nombre_lavado: [null, Validators.required],
            fecha: [null, Validators.required],
            hora: [null, Validators.required],
          });
          this.obtenerCitas();
        },
        error: (error) => {
          alert(`Error al crear cita.`);
          console.log(error);
          this.loading = false;
        },
      });
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar una cita
   * con el formato respectivo.
   * @param citaFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Cita.
   */
  formatoCita(citaFormValues: any): Cita {
    return {
      cedula_cliente: citaFormValues.cedula_cliente,
      placa_vehiculo: citaFormValues.placa_vehiculo,
      nombre_sucursal: citaFormValues.nombre_sucursal,
      nombre_lavado: citaFormValues.nombre_lavado,
      hora: new Date(
        citaFormValues.fecha.year,
        citaFormValues.fecha.month - 1,
        citaFormValues.fecha.day,
        citaFormValues.hora.hour - 6,
        citaFormValues.hora.minute
      ).toISOString(),
      facturada: false,
      duracion: this.duracionLavadoSeleccionado(),
    } as Cita;
  }
}
