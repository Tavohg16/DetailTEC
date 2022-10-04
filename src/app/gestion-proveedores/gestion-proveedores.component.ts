import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProveedoresService } from '../services/proveedores/proveedores.service';
import {
  Proveedor,
  ProveedoresResponse,
  ProveedorResponse
} from '../services/proveedores/proveedores.types'

@Component({
  selector: 'app-gestion-proveedores',
  templateUrl: './gestion-proveedores.component.html',
  styleUrls: ['./gestion-proveedores.component.css']
})
export class GestionProveedoresComponent implements OnInit {
  protected proveedores: Proveedor[] = [];

  constructor(
    private proveedoresService: ProveedoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ObtenerProveedores();
  }
  /**
   * Esta función llama al servicio de proveedores, obtiene todos los proveedores de la base de datos
   * y actualiza la lista de proveedores del componente.
   */
   protected ObtenerProveedores(): void {
    this.proveedoresService.todosProveedores().subscribe({
      next: (proveedoresResponse: ProveedoresResponse) => {
        if (proveedoresResponse.exito) {
          this.proveedores = proveedoresResponse.proveedores;
        } else {
          alert('Error al obtener proveedores.');
        }
      },
      error: (error) => {
        alert('Error al obtener proveedores.');
        console.log(error);
      },
    });
  }
  /**
   * Función para borrar un proveedor haciendo uso del servicio de proveedores.
   * @param cedula_juridica_proveedor cedula juridica del proveedor que se quiere eliminar.
   */
   protected borrarProveedor(cedula_juridica_proveedor: string) {
    this.proveedoresService.borrarProveedor(cedula_juridica_proveedor).subscribe({
      next: (proveedorResponse: ProveedorResponse) => {
        alert(proveedorResponse.mensaje);
        this.ObtenerProveedores()
      },
      error: (error) => {
        alert(`Error al eliminar proveedor.`);
        console.log(error);
      },
    });
  }



}