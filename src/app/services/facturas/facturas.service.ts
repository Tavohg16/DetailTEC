import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  FacturaResponse,
  Factura,
} from './facturas.types'

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
// Definiendo ruta a la que se hara los request http relacionadas a las citas
private facturasUrl: string = `${environment.apiUrl}/manage/billing`;

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
* Metodo crear una factura.
* @returns observable del query: Observable<FacturaResponse[]>.
*/
   crearFactura(factura: Factura) {
    const body = JSON.stringify(factura);
    return this.http.post<FacturaResponse>(
      this.facturasUrl,
      body,
      this.httpOptions
    );
  }
}
