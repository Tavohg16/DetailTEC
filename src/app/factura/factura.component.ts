import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientesService } from '../services/clientes/clientes.service';
import { Cliente, ClientesResponse } from '../services/clientes/clientes.types';
import { FacturasService } from '../services/facturas/facturas.service';
import { FacturaResponse, Factura } from '../services/facturas/facturas.types';
import { LavadosService } from '../services/lavados/lavados.service';
import { Lavado, LavadosResponse } from '../services/lavados/lavados.types';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent {
  // Definiendo variables a utilizar
  protected params: any;
  protected facturaForm: FormGroup;
  protected loading: boolean = false;
  protected cliente: any;
  protected lavado: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private facturasService: FacturasService,
    private clientesService: ClientesService,
    private lavadosService: LavadosService
  ) {
    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando una factura
     * y así armar los formularios respectivamente.
     */
    this.params = router.getCurrentNavigation()?.extras.state;
    if (!this.params) {
      this.router.navigate(['gestion-citas']);
    }

    this.facturaForm = this.formBuilder.group({
      cantidad_bebidas: [null, Validators.required],
      cantidad_snacks: [null, Validators.required],
      pago_puntos: [false, Validators.required],
    });

    this.clientesService.todosClientes().subscribe({
      next: (clientesResponse: ClientesResponse) => {
        if (clientesResponse.exito) {
          this.cliente = clientesResponse.clientes.find(
            (clienteLista: Cliente) => {
              return clienteLista.cedula_cliente === this.params.cedula_cliente;
            }
          );
          this.lavadosService.todosLavados().subscribe({
            next: (lavadosResponse: LavadosResponse) => {
              if (lavadosResponse.exito) {
                this.lavado = lavadosResponse.lavados.find(
                  (lavadoLista: Lavado) => {
                    return (
                      lavadoLista.nombre_lavado === this.params.nombre_lavado
                    );
                  }
                );
                if (this.cliente.puntos_acum <= this.lavado.costo_puntos) {
                  this.facturaFormControls['pago_puntos'].disable();
                }
              } else {
                alert('Error al obtener lavado de cita.');
              }
            },
            error: (error) => {
              alert('Error al obtener lavado de cita.');
              console.log(error);
            },
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

  pagoPuntosDisponible() {
    return this.cliente?.puntos_acum >= this.lavado?.costo_puntos;
  }

  // Getter para acceder facilmente a los form fields
  get facturaFormControls() {
    return this.facturaForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.facturaForm.invalid) {
      return;
    }

    // Query a través del proveedores service para agregar o editar factura.
    this.loading = true;
    this.facturasService
      .crearFactura(this.formatoFactura(this.facturaForm.value))
      .subscribe({
        next: (facturaResponse: FacturaResponse) => {
          alert(facturaResponse.mensaje);
          this.router.navigate(['gestion-facturas']);
          this.loading = false;
        },
        error: (error) => {
          alert(`Error al crear factura.`);
          console.log(error);
          this.loading = false;
        },
      });
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar una factura
   * con el formato respectivo.
   * @param facturaFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Factura.
   */
  formatoFactura(facturaFormValues: any) {
    return {
      id_cita: this.params.id_cita,
      cantidad_bebidas: this.facturaForm.value.cantidad_bebidas,
      cantidad_snacks: this.facturaForm.value.cantidad_snacks,
      pago_puntos: this.pagoPuntosDisponible() ? this.facturaForm.value.pago_puntos : false,
    } as Factura;
  }
}
