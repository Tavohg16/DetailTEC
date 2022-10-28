import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../services/clientes/clientes.service';
import { ClientesResponse, Cliente } from '../services/clientes/clientes.types';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-mis-puntos',
  templateUrl: './mis-puntos.component.html',
  styleUrls: ['./mis-puntos.component.css']
})
export class MisPuntosComponent implements OnInit {

  protected cliente: any;

  protected puntosCliente = [
    {
      title: "Obtenidos",
      value: 0
    },
    {
      title: "Acumulados",
      value: 0
    },
    {
      title: "Redimidos",
      value: 0
    },
  ];

  constructor(private clientesService: ClientesService, private loginService: LoginService) {
    this.clientesService.todosClientes().subscribe({
      next: (clientesResponse: ClientesResponse) => {
        if (clientesResponse.exito) {
          this.cliente = clientesResponse.clientes.find(
            (clienteLista: Cliente) => {
              return clienteLista.usuario === this.loginService.idLogin;
            }
          );
          this.puntosCliente[0].value = this.cliente.puntos_obt;
          this.puntosCliente[1].value = this.cliente.puntos_acum;
          this.puntosCliente[2].value = this.cliente.puntos_redim;
        } else {
          alert('Error al obtener cliente de cita.');
        }
      },
      error: (error) => {
        alert('Error al obtener cliente de cita.');
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
  }

}
