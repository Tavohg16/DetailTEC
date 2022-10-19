import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Reporte, ReporteResponse } from './reportes.types';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  // Definiendo ruta a la que se hara los request http relacionados a las citas
  private reportesUrl: string = `${environment.apiUrl}/manage/report`;

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
   * Metodo para generar reporte.
   * @returns observable del query: Observable<ReporteResponse[]>.
   */
  generarReporte(reporte: Reporte) {
    const body = JSON.stringify(reporte);
    return this.http.post<ReporteResponse>(
      this.reportesUrl,
      body,
      this.httpOptions
    );
  }
}