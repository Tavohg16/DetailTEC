import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  SucursalesResponse,
  SucursalResponse,
  Sucursal
} from './sucursales.types'

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {
  // Definiendo ruta a la que se hara los request http relacionados a las sucursales
  private sucursalesUrl: string = `${environment.apiUrl}/manage/office`;

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
   * Metodo para obtener la lista de todos las sucursales.
   * @returns observable del query: Observable<SucursalesResponse[]>.
   */
   todasSucursales() {
    return this.http.get<SucursalesResponse>(
      `${this.sucursalesUrl}/all`,
      this.httpOptions
    );
  }

  /**
   * Metodo crear una sucursal.
   * @returns observable del query: Observable<SucursalResponse[]>.
   */
  crearSucursal(sucursal: Sucursal) {
    const body = JSON.stringify(sucursal);
    return this.http.post<SucursalResponse>(
      this.sucursalesUrl,
      body,
      this.httpOptions
    );
  }

  /**
   * Metodo editar una sucursal.
   * @returns observable del query: Observable<SucursalResponse[]>.
   */
  editarSucursal(sucursal: Sucursal) {
    const body = JSON.stringify(sucursal);
    return this.http.patch<SucursalResponse>(
      this.sucursalesUrl,
      body,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar una sucursal.
   * @returns observable del query: Observable<SucursalesResponse[]>.
   */
   borrarSucursal(nombre_sucursal: string) {
    const body = JSON.stringify({nombre_sucursal});
    return this.http.delete<SucursalResponse>(
      this.sucursalesUrl,
      {...this.httpOptions, body }
    );
  }
}
