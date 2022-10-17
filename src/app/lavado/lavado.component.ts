import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LavadosService } from '../services/lavados/lavados.service';
import { Lavado, LavadoResponse } from '../services/lavados/lavados.types';
import { TrabajadoresService } from '../services/trabajadores/trabajadores.service';
import {
  Rol,
  RolesResponse,
} from '../services/trabajadores/trabajadores.types';
import {
  Producto,
  ProductosResponse,
} from '../services/productos/productos.types';
import { ProductosService } from '../services/productos/productos.service';

@Component({
  selector: 'app-lavado',
  templateUrl: './lavado.component.html',
  styleUrls: ['./lavado.component.css'],
})
export class LavadoComponent implements OnInit {
  // Definiendo variables a utilizar
  protected params: Lavado;
  protected formType: string;
  protected title: string;
  protected lavados: Lavado[] = [];
  protected lavadoForm: FormGroup;
  protected loading: boolean = false;

  protected rolesOpciones: Rol[] = [];
  protected productosOpciones: Producto[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private lavadosService: LavadosService,
    private trabajadoresService: TrabajadoresService,
    private productosService: ProductosService
  ) {
    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando un lavado
     * y así armar los formularios respectivamente.
     */
    this.params = router.getCurrentNavigation()?.extras.state as Lavado;
    if (!this.params) {
      this.formType = 'crear';
      this.title = 'Crear lavado';
      this.lavadoForm = this.formBuilder.group({
        nombre_lavado: [null, Validators.required],
        costo_personal: [
          null,
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        precio: [
          null,
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        duracion: [
          null,
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        puntos_otorgados: [
          null,
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        costo_puntos: [
          null,
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        roles_seleccionados: new FormArray([]),
        productos_seleccionados: new FormArray([]),
      });
    } else {
      this.formType = 'editar';
      this.title = 'Editar lavado';
      this.lavadoForm = this.formBuilder.group({
        nombre_lavado: [
          { value: this.params.nombre_lavado, disabled: true },
          Validators.required,
        ],
        costo_personal: [this.params.costo_personal, Validators.required],
        precio: [this.params.precio, Validators.required],
        duracion: [this.params.duracion, Validators.required],
        puntos_otorgados: [this.params.puntos_otorgados, Validators.required],
        costo_puntos: [this.params.costo_puntos, Validators.required],
        roles_seleccionados: new FormArray([]),
        productos_seleccionados: new FormArray([]),
      });
    }
  }
  ngOnInit(): void {
    // Obteniendo opciones de roles
    this.trabajadoresService.todosRoles().subscribe({
      next: (rolesResponse: RolesResponse) => {
        const roles_seleccionados = this.lavadoForm.controls[
          'roles_seleccionados'
        ] as FormArray;
        if (rolesResponse.exito) {
          this.rolesOpciones = rolesResponse.roles;
          this.rolesOpciones.forEach((rolOpcion) => {
            const asignado = this.params?.roles?.find(
              (rol) => rolOpcion.id_rol === rol.id_rol
            );
            if (asignado) {
              rolOpcion.asignado = true;
              roles_seleccionados.push(
                new FormControl({
                  id_rol: asignado.id_rol,
                  tipo_rol: asignado.tipo_rol,
                })
              );
            } else {
              rolOpcion.asignado = false;
            }
          });
        } else {
          alert('Error al obtener roles.');
        }
      },
      error: (error) => {
        alert('Error al obtener roles.');
        console.log(error);
      },
    });

    // Obteniendo opciones de productos
    this.productosService.todosProductos().subscribe({
      next: (productosResponse: ProductosResponse) => {
        const productos_seleccionados = this.lavadoForm.controls[
          'productos_seleccionados'
        ] as FormArray;
        if (productosResponse.exito) {
          this.productosOpciones = productosResponse.productos;
          this.productosOpciones.forEach((productoOpcion) => {
            const asignado = this.params?.insumos?.find(
              (producto) => productoOpcion.nombre_insumo === producto
            );
            if (asignado) {
              productoOpcion.asignado = true;
              productos_seleccionados.push(new FormControl(asignado));
            } else {
              productoOpcion.asignado = false;
            }
          });
        } else {
          alert('Error al obtener productos.');
        }
      },
      error: (error) => {
        alert('Error al obtener productos.');
        console.log(error);
      },
    });
  }
  // Getter para acceder facilmente a los form fields
  get lavadoFormControls() {
    return this.lavadoForm.controls;
  }

  onCheckboxRolesChange(event: any) {
    const roles_seleccionados = this.lavadoForm.controls[
      'roles_seleccionados'
    ] as FormArray;
    if (event.target.checked) {
      const rolSeleccionado = this.rolesOpciones.find(
        (rol) => rol.id_rol.toString() === event.target.value
      );
      roles_seleccionados.push(
        new FormControl({
          id_rol: rolSeleccionado?.id_rol,
          tipo_rol: rolSeleccionado?.tipo_rol,
        })
      );
    } else {
      const index = roles_seleccionados.value.findIndex((rol: Rol) => {
        return rol.id_rol === parseInt(event.target.value);
      });
      roles_seleccionados.removeAt(index);
    }
  }

  onCheckboxProductosChange(event: any) {
    const productos_seleccionados = this.lavadoForm.controls[
      'productos_seleccionados'
    ] as FormArray;
    if (event.target.checked) {
      const productoSeleccionado = this.productosOpciones.find(
        (producto) => producto.nombre_insumo === event.target.value
      );
      productos_seleccionados.push(
        new FormControl(productoSeleccionado?.nombre_insumo)
      );
    } else {
      const index = productos_seleccionados.value.findIndex(
        (producto: Producto) => {
          return producto.nombre_insumo === event.target.value;
        }
      );
      productos_seleccionados.removeAt(index);
    }
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.lavadoForm.invalid) {
      return;
    }

    // Query a través del lavados service para agregar o editar un lavado.
    this.loading = true;
    if (this.formType == 'crear') {
      this.lavadosService
        .crearLavado(this.formatoLavado(this.lavadoForm.value))
        .subscribe({
          next: (lavadoResponse: LavadoResponse) => {
            alert(lavadoResponse.mensaje);
            this.router.navigate(['gestion-lavados']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} lavado.`);
            console.log(error);
            this.loading = false;
          },
        });
    } else {
      this.lavadosService
        .editarLavado(this.formatoLavado(this.lavadoForm.value))
        .subscribe({
          next: (lavadoResponse: LavadoResponse) => {
            alert(lavadoResponse.mensaje);
            this.router.navigate(['gestion-lavados']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} lavado.`);
            console.log(error);
            this.loading = false;
          },
        });
    }
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un lavado
   * con el formato respectivo.
   * @param lavadoFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Lavado.
   */
  formatoLavado(lavadoFormValues: any) {
    return this.formType === 'editar'
      ? ({
          nombre_lavado: this.params.nombre_lavado,
          costo_personal: lavadoFormValues.costo_personal,
          precio: lavadoFormValues.precio,
          duracion: lavadoFormValues.duracion,
          puntos_otorgados: lavadoFormValues.puntos_otorgados,
          costo_puntos: lavadoFormValues.costo_puntos,
          insumos: lavadoFormValues.productos_seleccionados,
          roles: lavadoFormValues.roles_seleccionados,
        } as Lavado)
      : ({
          nombre_lavado: lavadoFormValues.nombre_lavado,
          costo_personal: lavadoFormValues.costo_personal,
          precio: lavadoFormValues.precio,
          duracion: lavadoFormValues.duracion,
          puntos_otorgados: lavadoFormValues.puntos_otorgados,
          costo_puntos: lavadoFormValues.costo_puntos,
          insumos: lavadoFormValues.productos_seleccionados,
          roles: lavadoFormValues.roles_seleccionados,
        } as Lavado);
  }
}
