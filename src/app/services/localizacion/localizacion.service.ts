import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Localidad,
  LocalidadesResponse
} from './localizacion.types'
@Injectable({
  providedIn: 'root'
})
export class LocalizacionService {
  // Definiendo ruta a la que se hara los request http relacionados a las localidades
  private localidadesUrl: string = `https://api.pruebayerror.com/locaciones/v1/`;

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
   * Metodo para obtener la lista de todos las localidades.
   * @returns observable del query: Observable<LocalidadesResponse[]>.
   */
   ObtenerProvinvias() {
    return this.http.get<LocalidadesResponse>(
      `${this.localidadesUrl}/provincias`,
      this.httpOptions
    );
  }
}
