import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportesService } from '../services/reportes/reportes.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ReporteResponse } from '../services/reportes/reportes.types';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

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

  constructor(private reportesService: ReportesService, calendar: NgbCalendar, private router: Router) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {}

  protected generarReporte(reporte: any) {
    let reporteFormato: any;
    if (reporte.id === 1) {
      reporteFormato = {
        id: reporte.id,
        dia_inicio: this.fromDate.day,
        mes_inicio: this.fromDate.month,
        ano_inicio: this.fromDate.year,
        dia_final: this.toDate?.day,
        mes_final: this.toDate?.month,
        ano_final: this.toDate?.year,
      };
    } else {
      reporteFormato = {
        id: reporte.id,
        dia_inicio: 0,
        mes_inicio: 0,
        ano_inicio: 0,
        dia_final: 0,
        mes_final: 0,
        ano_final: 0,
      };
    }
    console.log(reporte);
    console.log(this.fromDate);
    console.log(this.toDate);
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

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}