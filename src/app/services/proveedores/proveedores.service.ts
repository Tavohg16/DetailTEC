import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ProveedoresResponse,
  ProveedorResponse,
  Proveedor
} from './proveedores.types'

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  // Definiendo ruta a la que se hara los request http relacionados a los proveedores
  private proveedoresUrl: string = `${environment.apiUrl}/manage/provider`;

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
   * Metodo para obtener la lista de todos las proveedor.
   * @returns observable del query: Observable<ProveedoresResponse[]>.
   */
   todosProveedores() {
    return this.http.get<ProveedoresResponse>(
      `${this.proveedoresUrl}/all`,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar un proveedor.
   * @returns observable del query: Observable<ProveedoresResponse[]>.
   */
   borrarProveedor(cedula_juridica_proveedor: string) {
    const body = JSON.stringify({cedula_juridica_proveedor});
    return this.http.delete<ProveedorResponse>(
      this.proveedoresUrl,
      {...this.httpOptions, body }
    );
  }
}