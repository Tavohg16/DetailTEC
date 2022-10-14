import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  LavadosResponse,
  LavadoResponse,
  Lavado,

} from './lavados.types'

@Injectable({
  providedIn: 'root'
})
export class LavadosService {
  // Definiendo ruta a la que se hara los request http relacionados a los lavados
  private lavadosUrl: string = `${environment.apiUrl}/manage/wash`;

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
   * Metodo para obtener la lista de todos los lavados.
   * @returns observable del query: Observable<LavadosResponse[]>.
   */
   todosLavados() {
    return this.http.get<LavadosResponse>(
      `${this.lavadosUrl}/all`,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar un producto.
   * @returns observable del query: Observable<ProductosResponse[]>.
   */
   borrarLavado(nombre_lavado: string) {
    const body = JSON.stringify({nombre_lavado});
    return this.http.delete<LavadoResponse>(
      this.lavadosUrl,
      {...this.httpOptions, body }
    );
  }
}