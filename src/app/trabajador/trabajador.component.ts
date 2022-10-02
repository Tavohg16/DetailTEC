import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrabajadoresService } from '../services/trabajadores/trabajadores.service';
import {
  Rol,
  RolesResponse,
  TipoPago,
  TiposPagoResponse,
  Trabajador,
  TrabajadoresResponse,
  TrabajadorResponse,
} from '../services/trabajadores/trabajadores.types';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.css'],
})
export class TrabajadorComponent implements OnInit {
  // Definiendo variablea a utilizar
  protected params: any;
  protected formType: string;
  protected title: string;
  protected trabajadorForm: FormGroup;
  protected roles_trabajador: Rol[] = [];
  protected tipos_pago_trabajador: TipoPago[] = [];
  protected loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private trabajadorService: TrabajadoresService
  ) {
    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando un trabajador
     * y así armar los formularios respectivamente.
     */
     
    this.params = router.getCurrentNavigation()?.extras.state;
    if (!this.params) {
      this.formType = 'crear';
      this.title = 'Crear trabajador';
      this.trabajadorForm = this.formBuilder.group({
        nombre: [null, Validators.required],
        primer_apellido: [null, Validators.required],
        segundo_apellido: [null, Validators.required],
        cedula_trabajador: [
          null,
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        password_trabajador: [null, Validators.required],
        fechaIngreso: [null, Validators.required],
        fechaNacimiento: [null, Validators.required],
        id_rol: [0, Validators.required],
        id_tipo_pago: [0, Validators.required],
      });
    } else {
      this.formType = 'editar';
      this.title = 'Editar trabajador';
      const fechaIngresoTrabajador = new Date(this.params.fecha_ingreso);
      const fechaNacimientoTrabajador = new Date(this.params.fecha_nacimiento);
      this.trabajadorForm = this.formBuilder.group({
        nombre: [this.params.nombre, Validators.required],
        primer_apellido: [this.params.primer_apellido, Validators.required],
        segundo_apellido: [this.params.segundo_apellido, Validators.required],
        cedula_trabajador: [{value: this.params.cedula, disabled: true}, Validators.required],
        password_trabajador: [this.params.password_trabajador, Validators.required],
        fechaIngreso: [
          {
            year: fechaIngresoTrabajador.getFullYear(), 
            month: fechaIngresoTrabajador.getMonth() + 1,
            day: fechaIngresoTrabajador.getDate(),
          },
          Validators.required,
        ],
        fechaNacimiento: [
          {
            year: fechaNacimientoTrabajador.getFullYear(), 
            month: fechaNacimientoTrabajador.getMonth() + 1,
            day: fechaNacimientoTrabajador.getDate(),
          },
          Validators.required,
        ],
        id_rol: [this.params.id_rol, Validators.required],
        id_tipo_pago: [this.params.id_tipo_pago, Validators.required],
      });
    }
  }

  ngOnInit(): void {
    // Obteniendo opciones de roles
    this.trabajadorService.todosRoles().subscribe({
      next: (rolesResponse: RolesResponse) => {
        if (rolesResponse.exito) {
          this.roles_trabajador = rolesResponse.roles;
        } else {
          alert('Error al obtener roles.');
        }
      },
      error: (error) => {
        alert('Error al obtener roles.');
        console.log(error);
      },
    });

    // Obteniendo opciones de tipos de pago
    this.trabajadorService.todosTiposPago().subscribe({
      next: (tiposPagoResponse: TiposPagoResponse) => {
        if (tiposPagoResponse.exito) {
          this.tipos_pago_trabajador = tiposPagoResponse.tipos_pago;
        } else {
          alert('Error al obtener tipos de pago.');
        }
      },
      error: (error) => {
        alert('Error al obtener tipos de pago.');
        console.log(error);
      },
    });
  }

  // Getter para acceder facilmente a los form fields
  get trabajadorFormControls() {
    return this.trabajadorForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.trabajadorForm.invalid) {
      return;
    }

    // Query a través del trabajadores service para agregar o editar trabajador.
    this.loading = true;
    if (this.formType === 'crear') {
      this.trabajadorService
        .crearTrabajador(this.formatoTrabajador(this.trabajadorForm.value))
        .subscribe({
          next: (trabajadorResponse: TrabajadorResponse) => {
            alert(trabajadorResponse.mensaje);
            this.router.navigate(['gestion-trabajadores']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} trabajador.`);
            console.log(error);
            this.loading = false;
          },
        });
    } else {
      this.trabajadorService
        .editarTrabajador(this.formatoTrabajador(this.trabajadorForm.value))
        .subscribe({
          next: (trabajadorResponse: TrabajadorResponse) => {
            alert(trabajadorResponse.mensaje);
            this.router.navigate(['gestion-trabajadores']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} trabajador.`);
            console.log(error);
            this.loading = false;
          },
        });
    }
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un trabajador
   * con el formato respectivo.
   * @param trabajadorFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Trabajador.
   */
  formatoTrabajador(trabajadorFormValues: any) {
    return this.formType === 'editar'
      ? ({
          nombre: trabajadorFormValues.nombre,
          primer_apellido: trabajadorFormValues.primer_apellido,
          segundo_apellido: trabajadorFormValues.segundo_apellido,
          cedula_trabajador: this.params.cedula_trabajador,
          password_trabajador: trabajadorFormValues.password_trabajador,
          fecha_ingreso: (new Date(trabajadorFormValues.fechaIngreso.year, trabajadorFormValues.fechaIngreso.month - 1, trabajadorFormValues.fechaIngreso.day)).toISOString(),
          fecha_nacimiento: (new Date(trabajadorFormValues.fechaNacimiento.year, trabajadorFormValues.fechaNacimiento.month - 1, trabajadorFormValues.fechaNacimiento.day)).toISOString(),
          id_rol: trabajadorFormValues.id_rol,
          id_tipo_pago: trabajadorFormValues.id_tipo_pago,
        } as Trabajador)
      : ({
        nombre: trabajadorFormValues.nombre,
        primer_apellido: trabajadorFormValues.primer_apellido,
        segundo_apellido: trabajadorFormValues.segundo_apellido,
        cedula_trabajador: trabajadorFormValues.cedula_trabajador,
        password_trabajador: trabajadorFormValues.password_trabajador,
        fecha_ingreso: (new Date(trabajadorFormValues.fechaIngreso.year, trabajadorFormValues.fechaIngreso.month - 1, trabajadorFormValues.fechaIngreso.day)).toISOString(),
        fecha_nacimiento: (new Date(trabajadorFormValues.fechaNacimiento.year, trabajadorFormValues.fechaNacimiento.month - 1, trabajadorFormValues.fechaNacimiento.day)).toISOString(),
        id_rol: trabajadorFormValues.id_rol,
        id_tipo_pago: trabajadorFormValues.id_tipo_pago,
        } as Trabajador);
  }
}
