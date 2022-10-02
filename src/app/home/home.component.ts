import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected options = [
    {
      title: "Gestión de Trabajadores",
      icon: "fa-solid fa-user-gear",
      route: "home"
    },
    {
      title: "Gestión de Sucursales",
      icon: "fa-solid fa-users",
      route: "home"
    },
    {
      title: "Gestion de Proveedores",
      icon: "fa-solid fa-calendar-check",
      route: "home"
    },
     {
      title: "Gestion de Insumos",
      icon: "fa-solid fa-chart-line",
      route: "home"
    },
    /**{
      title: "Gestion de Lavados",
      icon: "fa-solid fa-chart-line",
      route: " "
    },
    {
      title: "Gestion de Clientes",
      icon: "fa-solid fa-chart-line",
      route: " "
    },
    {
      title: "Registro de Citas",
      icon: "fa-solid fa-chart-line",
      route: " "
    },
    {
      title: "Facturacion",
      icon: "fa-solid fa-chart-line",
      route: " "
    }, **/
  ];

  /**protected optionsCliente = [
    {
      title: "Gestión de trabajadores",
      icon: "fa-solid fa-user-gear",
      route: " "
    },
  ];
  **/
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  protected goTo(route: string): void {
    this.router.navigate([route]);
  }

}
