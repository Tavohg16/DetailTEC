import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../services/clientes/clientes.service';
import {
  Cliente,
  ClientesResponse,
  ClienteResponse,
  Direccion,
} from '../services/clientes/clientes.types';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css'],
})
export class GestionClientesComponent implements OnInit {
  protected clientes: Cliente[] = [];

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }
  /**
   * Esta función llama al servicio de clientes, obtiene todos los clientes de la base de datos
   * y actualiza la lista de clientes del componente.
   */
  protected obtenerClientes(): void {
    this.clientesService.todosClientes().subscribe({
      next: (clientesResponse: ClientesResponse) => {
        if (clientesResponse.exito) {
          this.clientes = clientesResponse.clientes.sort(
            (clienteA, clienteB) => {
              return clienteA.cedula_cliente.localeCompare(
                clienteB.cedula_cliente
              );
            }
          );
        } else {
          alert('Error al obtener clientes.');
        }
      },
      error: (error) => {
        alert('Error al obtener clientes.');
        console.log(error);
      },
    });
  }
  /**
   * Función para borrar un cliente haciendo uso del servicio de clientes.
   * @param cedula_cliente cedula juridica del cliente que se quiere eliminar.
   */
  protected borrarCliente(cedula_cliente: string) {
    this.clientesService.borrarCliente(cedula_cliente).subscribe({
      next: (clienteResponse: ClienteResponse) => {
        alert(clienteResponse.mensaje);
        this.obtenerClientes();
      },
      error: (error) => {
        alert(`Error al eliminar cliente.`);
        console.log(error);
      },
    });
  }
  /**
   * Función para navegar a la pantalla de crear cliente.
   */
  protected crearCliente() {
    this.router.navigate(['cliente']);
  }

  protected editarCliente(cliente: Cliente) {
    this.router.navigate(['cliente'], { state: cliente });
  }

  /**
   * Esta función es para dar un formato al nombre del cliente a partir de varios atributos.
   * @param cliente El cliente del cual se quiere conocer el nombre completo.
   * @returns Nombre del cliente: string.
   */
  protected nombreCompleto(cliente: Cliente): string {
    return `${cliente.nombre} ${cliente.primer_apellido}`;
  }

  protected direccionFormato(direccion: Direccion): string {
    return `${direccion.distrito}, ${direccion.canton}, ${direccion.provincia}`;
  }
}
