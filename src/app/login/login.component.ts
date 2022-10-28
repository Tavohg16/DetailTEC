import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { LoginResponse } from '../services/login/login.types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  ngOnInit() {}

  // Getter para acceder facilmente a los form fields
  get loginFormControls() {
    return this.loginForm.controls;
  }

  onSubmit() {

    // Caso en el que el form es inválido
    if (this.loginForm.invalid) {
      return;
    }

    // Query a través del loggin service para validar los credenciales.
    this.loading = true;
    this.loginService
      .login(
        this.loginFormControls['usuario'].value,
        this.loginFormControls['contrasena'].value
      )
      .subscribe({
        next: (loginResponse: LoginResponse) => {
          this.loginService.setLoggedIn(loginResponse.logged, loginResponse.administrador, this.loginFormControls['usuario'].value);
          if (loginResponse.logged) {
            this.router.navigate(['']);
          } else {
            alert('Su usuario, contraseña o ambas son inválidas');
          }
          this.loading = false;
        },
        error: (error) => {
          alert('Error al intentar autenticar su usuario.');
          console.log(error);
          this.loading = false;
        },
      });
  }
}
