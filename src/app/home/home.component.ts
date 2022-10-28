import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  protected optionsTrabajador = [
    {
      title: "Gestión de Trabajadores",
      icon: "fa-solid fa-user-gear",
      route: "gestion-trabajadores"
    },
    {
      title: "Gestión de Sucursales",
      icon: "fa-solid fa-shop",
      route: "gestion-sucursales"
    },
    {
      title: "Gestion de Proveedores",
      icon: "fa-solid fa-truck",
      route: "gestion-proveedores"
    },
     {
      title: "Gestion de Productos",
      icon: "fa-solid fa-barcode",
      route: "gestion-productos"
    },
    {
      title: "Gestion de Lavados",
      icon: "fa-solid fa-car",
      route: "gestion-lavados"
    },
    {
      title: "Gestion de Clientes",
      icon: "fa-solid fa-user",
      route: "gestion-clientes"
    },
    {
      title: "Registro de Citas",
      icon: "fa-solid fa-calendar-check",
      route: "gestion-citas"
    },
    {
      title: "Reportes",
      icon: "fa-solid fa-file-pdf",
      route: "reportes"
    }, 
  ];

  protected optionsCliente = [
    {
      title: "Mis datos",
      icon: "fa-solid fa-user",
      route: "mis-datos"
    },
    {
      title: "Registro de Citas",
      icon: "fa-solid fa-calendar-check",
      route: "gestion-citas-cliente"
    },
    {
      title: "Mis puntos",
      icon: "fa-solid fa-star",
      route: "mis-puntos"
    },
  ];
  constructor(
    protected loginService: LoginService,
    private router: Router) { }

  ngOnInit(): void {
  }

  protected goTo(route: string): void {
    this.router.navigate([route]);
  }

}
