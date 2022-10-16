import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LavadosService } from '../services/lavados/lavados.service';
import { Lavado, LavadoResponse } from '../services/lavados/lavados.types';


@Component({
  selector: 'app-lavado',
  templateUrl: './lavado.component.html',
  styleUrls: ['./lavado.component.css']
})
export class LavadoComponent implements OnInit {
  // Definiendo variables a utilizar
  protected params: any;
  protected formType: string;
  protected title: string;
  protected lavados: Lavado[] = [];
  protected lavadoForm: FormGroup;
  protected loading: boolean = false;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private lavadosService: LavadosService
  ) {


    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando un lavado
     * y así armar los formularios respectivamente.
     */
     this.params = router.getCurrentNavigation()?.extras.state;
     if (!this.params) {
       this.formType = 'crear';
       this.title = 'Crear lavado';
       this.lavadoForm = this.formBuilder.group({
         nombre_lavado: [null, Validators.required],
         costo_personal: [ null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
         precio: [ null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
         duracion: [ null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
         puntos_otorgados: [ null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
         costo_puntos: [ null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],

       });
     } else {
       this.formType = 'editar';
       this.title = 'Editar lavado';
       this.lavadoForm = this.formBuilder.group({
         nombre_lavado: [{value: this.params.nombre_lavado, disabled: true}, Validators.required],
         costo_personal: [ this.params.costo_personal, Validators.required],
         precio: [this.params.precio, Validators.required],
         duracion: [this.params.duracion, Validators.required],
         puntos_otorgados: [this.params.puntos_otorgados, Validators.required],
         costo_puntos: [this.params.costo_puntos, Validators.required],

       });
     }

   }
    ngOnInit(): void {

    }
  // Getter para acceder facilmente a los form fields
  get lavadoFormControls() {
    return this.lavadoForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.lavadoForm.invalid) {
      return;
    }

     // Query a través del lavados service para agregar o editar un lavado.
    this.loading = true;
    if (this.formType == 'crear') {
      this.lavadosService
        .crearLavado(this.formatoLavado(this.lavadoForm.value))
        .subscribe({
          next: (lavadoResponse: LavadoResponse) => {
            alert(lavadoResponse.mensaje);
            this.router.navigate(['gestion-lavados']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} lavado.`);
            console.log(error);
            this.loading = false;
          },
        });
    } else {
      console.log(this.formatoLavado(this.lavadoForm.value))
      this.lavadosService
        .editarLavado(this.formatoLavado(this.lavadoForm.value))
        .subscribe({
          next: (lavadoResponse: LavadoResponse) => {
            alert(lavadoResponse.mensaje);
            this.router.navigate(['gestion-lavados']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} lavado.`);
            console.log(error);
            this.loading = false;
          },
        });
    }
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un lavado
   * con el formato respectivo.
   * @param lavadoFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Lavado.
   */
   formatoLavado(lavadoFormValues: any) {
    return this.formType === 'editar'
      ? ({
          nombre_lavado: this.params.nombre_lavado,
          costo_personal: lavadoFormValues.costo_personal,
          precio: lavadoFormValues.precio,
          duracion: lavadoFormValues.duracion,
          puntos_otorgados: lavadoFormValues.puntos_otorgados,
          costo_puntos: lavadoFormValues.costo_puntos,
        } as Lavado)
      : ({
        nombre_lavado: lavadoFormValues.nombre_lavado,
        costo_personal: lavadoFormValues.costo_personal,
        precio: lavadoFormValues.precio,
        duracion: lavadoFormValues.duracion,
        puntos_otorgados: lavadoFormValues.puntos_otorgados,
        costo_puntos: lavadoFormValues.costo_puntos,
        } as Lavado);
  }
}