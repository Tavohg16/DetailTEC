import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LavadosService } from '../services/lavados/lavados.service';
import {
  Lavado,
  LavadosResponse,
  LavadoResponse
} from '../services/lavados/lavados.types'

@Component({
  selector: 'app-gestion-lavados',
  templateUrl: './gestion-lavados.component.html',
  styleUrls: ['./gestion-lavados.component.css']
})
export class GestionLavadosComponent implements OnInit {
  protected lavados: Lavado[] = [];

  constructor(
    private lavadosService: LavadosService,
    private router : Router
  ) {

  }

  ngOnInit(): void {
    this.ObtenerLavados();
  }
  /**
   * Esta función llama al servicio de productos, obtiene todos los productos de la base de datos
   * y actualiza la lista de productos del componente.
   */
   protected ObtenerLavados(): void {
    this.lavadosService.todosLavados().subscribe({
      next: (lavadosResponse: LavadosResponse) => {
        if (lavadosResponse.exito) {
          this.lavados = lavadosResponse.lavados.sort(
            (lavadoA, lavadoB) => {
              return lavadoA.nombre_lavado.localeCompare(
                lavadoB.nombre_lavado
              );
            }
          );
        } else {
          alert('Error al obtener lista de lavados.');
        }
      },
      error: (error) => {
        alert('Error al obtener lista de lavados.');
        console.log(error);
      },
    });
  }
  /**
   * Función para borrar un producto haciendo uso del servicio de lavados.
   * @param nombre_lavado nombre del lavado que se quiere eliminar.
   */
   protected borrarLavado(nombre_lavado: string) {
    this.lavadosService.borrarLavado(nombre_lavado).subscribe({
      next: (lavadoResponse: LavadoResponse) => {
        alert(lavadoResponse.mensaje);
        this.ObtenerLavados()
      },
      error: (error) => {
        alert(`Error al eliminar el lavado.`);
        console.log(error);
      },
    });
  }
}