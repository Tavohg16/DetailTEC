import { Component } from '@angular/core';
import { LoginService } from './services/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'detail-tec';
  
  constructor(protected loginService: LoginService) {}

  /**
   * Función para desloggearse.
   */
  logout() {
    this.loginService.logout();
  }

}
