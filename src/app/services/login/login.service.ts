import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from './login.types';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
}) 
export class LoginService {

  // Definiendo variable a la que todos los componentes tendrán acceso para verificar estado de autenticacion
  private loggedIn: boolean = false ;
  // Definiendo variable a la que todos los componentes tendrán acceso para verificar si usuario es admin
  private admin: boolean = false ;
  // Definiendo ruta a la que se hara los request http relacionados al login
  private loginUrl: string = `${environment.apiUrl}/login`;

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type":  "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    })
  };

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Metodo para autenticar un trabajador o un cliente. Se hace el query al backend para validar los credenciales,
   * se retorna el observable del query.
   * @param usuario Cedula correspondiente al trabajador o usuario correspondiente al cliente que se quiere autenticar.
   * @param password password correspondiente al trabajador que se quiere autenticar.
   * @returns observable del query: Observable<LoginResponse>.
   */
  login(usuario: string, password: string) {
    const body = JSON.stringify({ usuario, password });
    return this.http.post<LoginResponse>(this.loginUrl, body, this.httpOptions);
  }

  /**
   * Metodo para desautenticar un trabajador. Simplemente se redefine la variable loggedIn como falsa y se
   * redirige al usuario a la página de login.
   */
  logout() {
    window.localStorage.setItem('loggedIn', 'false');
    window.localStorage.setItem('administrador', 'false');
    window.localStorage.setItem('id', '');
    this.router.navigate(['/login']);
  }

  /**
   * Metodo para setear la variable loggedIn.
   * @param logged Nuevo valor de loggedIn: Boolean.
   * @param administrador Nuevo valor de administrador: Boolean.
   */
  setLoggedIn(logged: boolean, administrador: boolean, id: string) {
    window.localStorage.setItem('loggedIn', logged.toString());
    window.localStorage.setItem('admin', administrador.toString());
    window.localStorage.setItem('id', id);
  }

  /**
   * Metodo para obtener la variable loggedIn.
   * @returns variable loggedIn: Boolean.
   */
  get isLoggedIn() {
    this.loggedIn = window.localStorage.getItem('loggedIn') === 'true';
    return this.loggedIn ?? false;
  }

  /**
   * Metodo para obtener la variable loggedIn.
   * @returns variable admin: Boolean.
   */
   get isAdmin() {
    this.admin = window.localStorage.getItem('admin') === 'true';
    return this.admin ?? false;
  }

  /**
   * Metodo para obtener la variable id.
   * @returns variable id: String.
   */
   get idLogin() {
    return window.localStorage.getItem('id');
  }
}
