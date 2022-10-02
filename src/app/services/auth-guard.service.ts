import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login/login.service';

/**
 * Servicio para restringir acceso a determinadas rutas dependiendo del estado de autenticación del usuario.
 */
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public loginService: LoginService, public router: Router) {}
  
  /**
   * Método para deifnir si el usuario tiene acceso a una ruta definida. 
   * @param route Detalles de la ruta que se está tratando de accesar.
   * @returns True o false dependiendo de si se permite el acceso o no.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig?.path === 'login') {
      // Para la ruta loggin, si el usuario ya está autenticado se redirige a home, si no permite el acceso.
      if (this.loginService.isLoggedIn) {
        this.router.navigate(['home']);
        return false;
      }
      return true;
    } else {
      // Para cualquier otra ruta, si el usuario ya está autenticado permite el acceso, si no permite se redirige a login.
      if (!this.loginService.isLoggedIn) {
        this.router.navigate(['login']);
        return false;
      }
      else {
        // Manejo de casos de trabajador o cliente para cada ruta
        switch (route.routeConfig?.path) {
          case 'gestion-trabajadores':
            return this.loginService.isAdmin;
          default:
            return true;
        }
      }
    }
  }
}
