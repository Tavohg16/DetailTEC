import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ClientesResponse,
  ClienteResponse,
  Cliente
} from './clientes.types'

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  // Definiendo ruta a la que se hara los request http relacionados a los clientes
  private clientesUrl: string = `${environment.apiUrl}/manage/customer`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    })
  }

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Metodo para obtener la lista de todos los clientes.
   * @returns observable del query: Observable<ClientesResponse[]>.
   */
   todosClientes() {
    return this.http.get<ClientesResponse>(
      `${this.clientesUrl}/all`,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar un cliente.
   * @returns observable del query: Observable<ClientesResponse[]>.
   */
   borrarCliente(cedula_cliente: string) {
    const body = JSON.stringify({cedula_cliente});
    return this.http.delete<ClienteResponse>(
      this.clientesUrl,
      {...this.httpOptions, body }
    );
  }
    /**
   * Metodo crear un cliente.
   * @returns observable del query: Observable<ClienteResponse[]>.
   */
     crearCliente(cliente: Cliente) {
      const body = JSON.stringify(cliente);
      return this.http.post<ClienteResponse>(
        this.clientesUrl,
        body,
        this.httpOptions
      );
    }
  
    /**
     * Metodo editar un cliente.
     * @returns observable del query: Observable<ClienteResponse[]>.
     */
    editarCliente(cliente: Cliente) {
      const body = JSON.stringify(cliente);
      return this.http.patch<ClienteResponse>(
        this.clientesUrl,
        body,
        this.httpOptions
      );
    }
}
