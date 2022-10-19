import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportesService } from '../services/reportes/reportes.service';
import { ReporteResponse } from '../services/reportes/reportes.types';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  protected options = [
    {
      title: 'Planilla',
      descripcion:
        'Listado del pago a los empleados.',
      icon: 'fa-solid fa-money-bill',
      id: 1,
    },
    {
      title: 'Tipos de lavado por cliente',
      descripcion:
        'Listado de lavados realizados por el cliente y la cantidad correspondiente a cada lavado.',
      icon: 'fa-solid fa-person',
      id: 2,
    },
    {
      title: 'Redencion de puntos',
      descripcion: 'Listado de los clientes que más puntos han redimido.',
      icon: 'fa-solid fa-medal',
      id: 3,
    },
  ];

  constructor(private reportesService: ReportesService, private router: Router) {
    
  }

  ngOnInit(): void {}

  protected generarReporte(reporte: any) {
    let reporteFormato: any;
    if (reporte.id === 2) {
      reporteFormato = {
        tipo_reporte: reporte.id,
        //cedula_cliente: poner cedula de cliente obtenida desde field aqui
      };
    } else {
      reporteFormato = {
        tipo_reporte: reporte.id,
        cedula_cliente: "",
      };
    }

    this.reportesService
        .generarReporte(reporteFormato)
        .subscribe({
          next: (reporteResponse: ReporteResponse) => {
            alert(reporteResponse.mensaje);
            this.router.navigate(['home']);
          },
          error: (error) => {
            alert(`Error al generar reporte.`);
            console.log(error);
          },
        });
  }
}