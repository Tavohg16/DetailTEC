import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../services/clientes/clientes.service';
import { LocalizacionService } from '../services/localizacion/localizacion.service';
import { LoginService } from '../services/login/login.service';
import {
  Localidad,
  LocalidadesResponse,
} from '../services/localizacion/localizacion.types';
import {
  Cliente,
  ClienteResponse,
  ClientesResponse,
} from '../services/clientes/clientes.types';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css'],
})
export class MisDatosComponent implements OnInit {
  // Definiendo variables a utilizar
  protected cliente: any;
  protected title = 'Mis datos';
  protected lista_provincias_1: Localidad[] = [];
  protected lista_cantones_1: Localidad[] = [];
  protected lista_distritos_1: Localidad[] = [];
  protected lista_provincias_2: Localidad[] = [];
  protected lista_cantones_2: Localidad[] = [];
  protected lista_distritos_2: Localidad[] = [];
  protected id_provincia_1: string = '';
  protected nombre_provincia_1: string = '';
  protected id_canton_1: string = '';
  protected nombre_canton_1: string = '';
  protected id_distrito_1: string = '';
  protected nombre_distrito_1: string = '';
  protected id_provincia_2: string = '';
  protected nombre_provincia_2: string = '';
  protected id_canton_2: string = '';
  protected nombre_canton_2: string = '';
  protected id_distrito_2: string = '';
  protected nombre_distrito_2: string = '';
  protected clienteForm: FormGroup = this.formBuilder.group({
    cedula_cliente: [
      null,
      [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
    ],
    nombre: [null, Validators.required],
    primer_apellido: [null, Validators.required],
    segundo_apellido: [null, Validators.required],
    usuario: [null, Validators.required],
    correo_cliente: [null, Validators.required],
    password_cliente: [''],
    telefono_1: [
      null,
      [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
    ],
    telefono_2: [null, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
    provincia_1: [null, Validators.required],
    canton_1: [null, Validators.required],
    distrito_1: [null, Validators.required],
    provincia_2: [null],
    canton_2: [null],
    distrito_2: [null],
  });
  protected loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localidadService: LocalizacionService,
    private clientesService: ClientesService,
    protected loginService: LoginService
  ) {
    this.clientesService.todosClientes().subscribe({
      next: (clientesResponse: ClientesResponse) => {
        if (clientesResponse.exito) {
          this.cliente = clientesResponse.clientes.find(
            (clienteLista: Cliente) => {
              return clienteLista.usuario === this.loginService.idLogin;
            }
          );
          this.clienteForm = this.formBuilder.group({
            cedula_cliente: [
              { value: this.cliente.cedula_cliente, disabled: true },
              Validators.required,
            ],
            nombre: [this.cliente.nombre, Validators.required],
            primer_apellido: [
              this.cliente.primer_apellido,
              Validators.required,
            ],
            segundo_apellido: [
              this.cliente.segundo_apellido,
              Validators.required,
            ],
            usuario: [this.cliente.usuario, Validators.required],
            correo_cliente: [this.cliente.correo_cliente, Validators.required],
            password_cliente: [
              this.cliente.password_cliente,
              Validators.required,
            ],
            telefono_1: [
              this.cliente.telefonos[0],
              [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
            ],
            telefono_2: [
              this.cliente.telefonos[1] ? this.cliente.telefonos[1] : null,
              Validators.pattern(/^-?(0|[1-9]\d*)?$/),
            ],
            provincia_1: [
              this.cliente.direcciones[0].provincia,
              Validators.required,
            ],
            canton_1: [this.cliente.direcciones[0].canton, Validators.required],
            distrito_1: [
              this.cliente.direcciones[0].distrito,
              Validators.required,
            ],
            provincia_2: [
              this.cliente.direcciones[1]
                ? this.cliente.direcciones[1].provincia
                : null,
            ],
            canton_2: [
              this.cliente.direcciones[1]
                ? this.cliente.direcciones[1].canton
                : null,
            ],
            distrito_2: [
              this.cliente.direcciones[1]
                ? this.cliente.direcciones[1].distrito
                : null,
            ],
          });
        } else {
          alert('Error al obtener cliente de cita.');
        }
      },
      error: (error) => {
        alert('Error al obtener cliente de cita.');
        console.log(error);
      },
    });
  }

  /**
   * Obteniendo lista de provincias al inicial el componente.
   * Revisa si hay parametros en el componente, de ser asi,
   * utiliza localidadService para cargar las listas de
   * cantones y provincias que corresponden a los parametros
   * para popular los selectores en el form cuando se quiere
   * editar un cliente.
   */
  ngOnInit(): void {
    this.localidadService.ObtenerProvincias().subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_provincias_1 = localidadesResponse.data;
        this.lista_provincias_2 = localidadesResponse.data;

        if (this.cliente) {
          this.id_provincia_1 = this.identificarProvincia1(
            this.cliente.direcciones[0].provincia
          );
          this.clienteForm.value.provincia_1 = this.id_provincia_1;

          this.localidadService.ObtenerCantones(this.id_provincia_1).subscribe({
            next: (localidadesResponse: LocalidadesResponse) => {
              this.lista_cantones_1 = localidadesResponse.data;
              this.id_canton_1 = this.identificarCanton1(
                this.cliente.direcciones[0].canton
              );
              this.clienteForm.value.canton_1 = this.id_canton_1;

              this.localidadService
                .ObtenerDistritos(this.id_provincia_1, this.id_canton_1)
                .subscribe({
                  next: (localidadesResponse: LocalidadesResponse) => {
                    this.lista_distritos_1 = localidadesResponse.data;
                    this.id_distrito_1 = this.identificarDistrito1(
                      this.cliente.direcciones[0].distrito
                    );
                    this.clienteForm.value.distrito_1 = this.id_distrito_1;
                    this.clienteForm.patchValue(this.clienteForm.value, {
                      onlySelf: false,
                      emitEvent: true,
                    });
                  },
                });
            },
          });

          if (this.cliente.direcciones[1]) {
            this.id_provincia_2 = this.identificarProvincia2(
              this.cliente.direcciones[1].provincia
            );
            this.clienteForm.value.provincia_2 = this.id_provincia_2;
            this.localidadService
              .ObtenerCantones(this.id_provincia_2)
              .subscribe({
                next: (localidadesResponse: LocalidadesResponse) => {
                  this.lista_cantones_2 = localidadesResponse.data;
                  this.id_canton_2 = this.identificarCanton2(
                    this.cliente.direcciones[1].canton
                  );
                  this.clienteForm.value.canton_2 = this.id_canton_2;

                  this.localidadService
                    .ObtenerDistritos(this.id_provincia_2, this.id_canton_2)
                    .subscribe({
                      next: (localidadesResponse: LocalidadesResponse) => {
                        this.lista_distritos_2 = localidadesResponse.data;
                        this.id_distrito_2 = this.identificarDistrito2(
                          this.cliente.direcciones[1].distrito
                        );
                        this.clienteForm.value.distrito_2 = this.id_distrito_2;
                        this.clienteForm.patchValue(this.clienteForm.value, {
                          onlySelf: false,
                          emitEvent: true,
                        });
                      },
                    });
                },
              });
          }
        }
      },
    });
  }

  /**
   * Obteniene el value del selector de provincia @param provincia,
   * guarda el nombre de la provincia localmente y procede a usar el
   * localidadService para obtener la lista de cantones correspondiente
   * a la provincia seleccionada por el usurio.
   */
  seleccionarProvincia1(provincia: string): void {
    this.id_provincia_1 = provincia;
    const index = Number(this.id_provincia_1) - 1;
    this.nombre_provincia_1 = this.lista_provincias_1[index].nombre;
    this.localidadService.ObtenerCantones(this.id_provincia_1).subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_cantones_1 = localidadesResponse.data;
        this.localidadService
          .ObtenerDistritos(this.id_provincia_1, this.id_canton_1)
          .subscribe({
            next: (localidadesResponse: LocalidadesResponse) => {
              this.lista_distritos_1 = localidadesResponse.data;
            },
          });
      },
    });
  }

  seleccionarProvincia2(provincia: string): void {
    this.id_provincia_2 = provincia;
    const index = Number(this.id_provincia_2) - 1;
    this.nombre_provincia_2 = this.lista_provincias_2[index].nombre;
    this.localidadService.ObtenerCantones(this.id_provincia_2).subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_cantones_2 = localidadesResponse.data;
        this.localidadService
          .ObtenerDistritos(this.id_provincia_2, this.id_canton_2)
          .subscribe({
            next: (localidadesResponse: LocalidadesResponse) => {
              this.lista_distritos_2 = localidadesResponse.data;
            },
          });
      },
    });
  }

  /**
   * Obteniene el value del selector de canton @param canton,
   * guarda el nombre del canton localmente y procede a usar el
   * localidadService para obtener la lista de distritos correspondiente
   * al canton seleccionada por el usurio.
   */
  seleccionarCanton1(canton: string): void {
    this.id_canton_1 = canton;
    const index = Number(this.id_canton_1) - 1;
    this.nombre_canton_1 = this.lista_cantones_1[index].nombre;
    this.localidadService
      .ObtenerDistritos(this.id_provincia_1, this.id_canton_1)
      .subscribe({
        next: (localidadesResponse: LocalidadesResponse) => {
          this.lista_distritos_1 = localidadesResponse.data;
        },
      });
  }

  seleccionarCanton2(canton: string): void {
    this.id_canton_2 = canton;
    const index = Number(this.id_canton_2) - 1;
    this.nombre_canton_2 = this.lista_cantones_2[index].nombre;
    this.localidadService
      .ObtenerDistritos(this.id_provincia_2, this.id_canton_2)
      .subscribe({
        next: (localidadesResponse: LocalidadesResponse) => {
          this.lista_distritos_2 = localidadesResponse.data;
        },
      });
  }

  /**
   * Obteniene el value del selector de distrito @param distrito,
   * guarda el nombre del distrito localmente.
   */
  seleccionarDistrito1(distrito: string): void {
    this.id_distrito_1 = distrito;
    const index = Number(this.id_distrito_1) - 1;
    this.nombre_distrito_1 = this.lista_distritos_1[index].nombre;
  }

  seleccionarDistrito2(distrito: string): void {
    this.id_distrito_2 = distrito;
    const index = Number(this.id_distrito_2) - 1;
    this.nombre_distrito_2 = this.lista_distritos_2[index].nombre;
  }

  /**
   * dado @param value como el string que representa el nombre de una provincia,
   * se obtiene de la lista de provincias el elemento que haga match y se obtiene
   * el numero de provincia que luego es convertido a string.
   * @returns un string que representa el identificador numerico de una provincia.
   */
  identificarProvincia1(value: string): string {
    this.nombre_provincia_1 = value;
    let numero: string = '';
    this.lista_provincias_1.forEach((element) => {
      if (element.nombre === value) {
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  identificarProvincia2(value: string): string {
    this.nombre_provincia_2 = value;
    let numero: string = '';
    this.lista_provincias_2.forEach((element) => {
      if (element.nombre === value) {
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  /**
   * dado @param value como el string que representa el nombre de un canton,
   * se obtiene de la lista de cantones el elemento que haga match y se obtiene
   * el numero de canton que luego es convertido a string.
   * @returns un string que representa el identificador numerico de un canton.
   */
  identificarCanton1(value: string): string {
    this.nombre_canton_1 = value;
    let numero: string = '';
    this.lista_cantones_1.forEach((element) => {
      if (element.nombre === value) {
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  identificarCanton2(value: string): string {
    this.nombre_canton_2 = value;
    let numero: string = '';
    this.lista_cantones_2.forEach((element) => {
      if (element.nombre === value) {
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  /**
   * dado @param value como el string que representa el nombre de un distrito,
   * se obtiene de la lista de distritos el elemento que haga match y se obtiene
   * el numero de distrito que luego es convertido a string.
   * @returns un string que representa el identificador numerico de un distrito.
   */
  identificarDistrito1(value: string): string {
    this.nombre_distrito_1 = value;
    let numero: string = '';
    this.lista_distritos_1.forEach((element) => {
      if (element.nombre === value) {
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  identificarDistrito2(value: string): string {
    this.nombre_distrito_2 = value;
    let numero: string = '';
    this.lista_distritos_2.forEach((element) => {
      if (element.nombre === value) {
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  // Getter para acceder facilmente a los form fields
  get clienteFormControls() {
    return this.clienteForm.controls;
  }

  onSubmit() {
    console.log(this.formatoCliente(this.clienteForm.value));
    // Caso en el que el form es inválido
    if (this.clienteForm.invalid) {
      return;
    }

    // Query a través del clientes service para agregar o editar cliente.
    this.loading = true;
    this.clientesService
      .editarCliente(this.formatoCliente(this.clienteForm.value))
      .subscribe({
        next: (clienteResponse: ClienteResponse) => {
          alert(clienteResponse.mensaje);
          this.router.navigate(['home']);
          this.loading = false;
        },
        error: (error) => {
          alert(`Error al modificar sus datos.`);
          console.log(error);
          this.loading = false;
        },
      });
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un cliente
   * con el formato respectivo.
   * @param clienteFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Cliente.
   */
  formatoCliente(clienteFormValues: any) {
    return {
      cedula_cliente: this.cliente.cedula_cliente,
      nombre: clienteFormValues.nombre,
      primer_apellido: clienteFormValues.primer_apellido,
      segundo_apellido: clienteFormValues.segundo_apellido,
      correo_cliente: clienteFormValues.correo_cliente,
      usuario: clienteFormValues.usuario,
      password_cliente: clienteFormValues.password_cliente,
      puntos_acum: this.cliente.puntos_acum,
      puntos_obt: this.cliente.puntos_obt,
      puntos_redim: this.cliente.puntos_redim,
      direcciones:
        this.nombre_provincia_2 &&
        this.nombre_canton_2 &&
        this.nombre_distrito_2
          ? [
              {
                provincia: this.nombre_provincia_2,
                canton: this.nombre_canton_2,
                distrito: this.nombre_distrito_2,
              },
              {
                provincia: this.nombre_provincia_1,
                canton: this.nombre_canton_1,
                distrito: this.nombre_distrito_1,
              },
            ]
          : [
              {
                provincia: this.nombre_provincia_1,
                canton: this.nombre_canton_1,
                distrito: this.nombre_distrito_1,
              },
            ],
      telefonos: clienteFormValues.telefono_2
        ? [clienteFormValues.telefono_2, clienteFormValues.telefono_1]
        : [clienteFormValues.telefono_1],
    } as Cliente;
  }
}
