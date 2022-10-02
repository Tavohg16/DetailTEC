import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  RolesResponse,
  TiposPagoResponse,
  Trabajador,
  TrabajadoresResponse,
  TrabajadorResponse,
} from './trabajadores.types';

@Injectable({
  providedIn: 'root',
})
export class TrabajadoresService {
  // Definiendo ruta a la que se hara los request http relacionados a los trabajadores
  private trabajadoresUrl: string = `${environment.apiUrl}/manage/worker`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Metodo para obtener la lista de todos los trabajadores.
   * @returns observable del query: Observable<TrabajadoresResponse[]>.
   */
  todosTrabajadores() {
    return this.http.get<TrabajadoresResponse>(
      `${this.trabajadoresUrl}/all`,
      this.httpOptions
    );
  }

  /**
   * Metodo crear un trabajador.
   * @returns observable del query: Observable<TrabajadorResponse[]>.
   */
  crearTrabajador(trabajador: Trabajador) {
    const body = JSON.stringify(trabajador);
    return this.http.post<TrabajadorResponse>(
      this.trabajadoresUrl,
      body,
      this.httpOptions
    );
  }

  /**
   * Metodo editar un trabajador.
   * @returns observable del query: Observable<TrabajadorResponse[]>.
   */
  editarTrabajador(trabajador: Trabajador) {
    const body = JSON.stringify(trabajador);
    return this.http.patch<TrabajadorResponse>(
      this.trabajadoresUrl,
      body,
      this.httpOptions
    );
  }
  
  /**
   * Metodo borrar un trabajador.
   * @returns observable del query: Observable<TrabajadorResponse[]>.
   */
  borrarTrabajador(cedula_trabajador: string) {
    const body = JSON.stringify({cedula_trabajador});
    return this.http.delete<TrabajadorResponse>(
      this.trabajadoresUrl,
      {...this.httpOptions, body }
    );
  }

  /**
   * Metodo obtener todos los roles posibles que puede tener un trabajador.
   * @returns observable del query: Observable<RolesResponse[]>.
   */
  todosRoles() {
    return this.http.get<RolesResponse>(
      `${this.trabajadoresUrl}/roles`,
      this.httpOptions
    );
  }

  /**
   * Metodo obtener todos los tipos de pago posibles que puede tener un trabajador.
   * @returns observable del query: Observable<TiposPagoResponse[]>.
   */
  todosTiposPago() {
    return this.http.get<TiposPagoResponse>(
      `${this.trabajadoresUrl}/payment/types`,
      this.httpOptions
    );
  }
}
