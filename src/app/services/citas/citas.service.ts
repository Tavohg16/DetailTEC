import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CitasResponse,
  CitaResponse,
} from './citas.types'

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  // Definiendo ruta a la que se hara los request http relacionadas a las citas
  private citasUrl: string = `${environment.apiUrl}/manage/appointment`;

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
   * Metodo para obtener la lista de todas las citas.
   * @returns observable del query: Observable<CitasResponse[]>.
   */
   todasCitas() {
    return this.http.get<CitasResponse>(
      `${this.citasUrl}/all`,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar una cita.
   * @returns observable del query: Observable<CitasResponse[]>.
   */
   borrarCita(id_cita: number) {
    const body = JSON.stringify({id_cita});
    return this.http.delete<CitaResponse>(
      this.citasUrl,
      {...this.httpOptions, body }
    );
  }
}