import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ProductosResponse,
  ProductoResponse,
  Producto
} from './productos.types'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // Definiendo ruta a la que se hara los request http relacionados a los productos
  private productosUrl: string = `${environment.apiUrl}/manage/product`;

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
   * Metodo para obtener la lista de todos los productos.
   * @returns observable del query: Observable<ProductosResponse[]>.
   */
   todosProductos() {
    return this.http.get<ProductosResponse>(
      `${this.productosUrl}/all`,
      this.httpOptions
    );
  }

   /**
   * Metodo borrar un producto.
   * @returns observable del query: Observable<ProductosResponse[]>.
   */
   borrarProducto(nombre_insumo: string) {
    const body = JSON.stringify({nombre_insumo});
    return this.http.delete<ProductoResponse>(
      this.productosUrl,
      {...this.httpOptions, body }
    );
  }
  /**
  * Metodo crear un producto.
  * @returns observable del query: Observable<ProductoResponse[]>.
  */
  crearProducto(producto: Producto) {
    const body = JSON.stringify(producto);
    return this.http.post<ProductoResponse>(
      this.productosUrl,
      body,
      this.httpOptions
    );
  }
  /**
  * Metodo editar un producto.
  * @returns observable del query: Observable<ProductoResponse[]>.
  */
  editarProducto(producto: Producto) {
    const body = JSON.stringify(producto);
    return this.http.patch<ProductoResponse>(
      this.productosUrl,
      body,
      this.httpOptions
    );
  }
}