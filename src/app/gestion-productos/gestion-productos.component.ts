import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../services/productos/productos.service';
import {
  Producto,
  ProductosResponse,
  ProductoResponse
} from '../services/productos/productos.types'

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {
  protected productos: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.ObtenerProductos();
  }
  /**
   * Esta función llama al servicio de productos, obtiene todos los productos de la base de datos
   * y actualiza la lista de productos del componente.
   */
   protected ObtenerProductos(): void {
    this.productosService.todosProductos().subscribe({
      next: (productosResponse: ProductosResponse) => {
        if (productosResponse.exito) {
          this.productos = productosResponse.productos.sort(
            (productoA, productoB) => {
              return productoA.nombre_insumo.localeCompare(
                productoB.nombre_insumo
              );
            }
          );
        } else {
          alert('Error al obtener productos.');
        }
      },
      error: (error) => {
        alert('Error al obtener productos.');
        console.log(error);
      },
    });
  }
  /**
   * Función para borrar un producto haciendo uso del servicio de productos.
   * @param nombre_insumo nombre del producto que se quiere eliminar.
   */
   protected borrarProducto(nombre_insumo: string) {
    this.productosService.borrarProducto(nombre_insumo).subscribe({
      next: (productoResponse: ProductoResponse) => {
        alert(productoResponse.mensaje);
        this.ObtenerProductos()
      },
      error: (error) => {
        alert(`Error al eliminar producto.`);
        console.log(error);
      },
    });
  }
  protected crearProducto() {
    this.router.navigate(['producto']);
  }

  protected editarProducto(producto: Producto) {
    this.router.navigate(['producto'], {state: producto});
  }
}