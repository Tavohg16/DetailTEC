import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../services/productos/productos.service';
import { Producto, ProductoResponse } from '../services/productos/productos.types';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  // Definiendo variables a utilizar
  protected params: any;
  protected formType: string;
  protected title: string;
  protected productoForm: FormGroup;
  protected loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productosService: ProductosService
  ) {


    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando un producto
     * y así armar los formularios respectivamente.
     */
     this.params = router.getCurrentNavigation()?.extras.state;
     if (!this.params) {
       this.formType = 'crear';
       this.title = 'Crear producto';
       this.productoForm = this.formBuilder.group({
         nombre_insumo: [null, Validators.required],
         costo: [ null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
         marca: [null, Validators.required],
         cedula_juridica_proveedor: [ null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
       });
     } else {
       this.formType = 'editar';
       this.title = 'Editar producto';
       this.productoForm = this.formBuilder.group({
         nombre_insumo: [{value: this.params.nombre_insumo, disabled: true}, Validators.required],
         costo: [this.params.costo, Validators.required],
         marca: [this.params.marca, Validators.required],
         cedula_juridica_proveedor: [{value: this.params.cedula_juridica_proveedor, disabled: true}, Validators.required],
       });
     }

   }
    ngOnInit(): void {
        
    }
  // Getter para acceder facilmente a los form fields
  get productoFormControls() {
    return this.productoForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.productoForm.invalid) {
      return;
    }

     // Query a través del proveedores service para agregar o editar producto.
    this.loading = true;
    if (this.formType == 'crear') {
      this.productosService
        .crearProducto(this.formatoProducto(this.productoForm.value))
        .subscribe({
          next: (productoResponse: ProductoResponse) => {
            alert(productoResponse.mensaje);
            this.router.navigate(['gestion-productos']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} producto.`);
            console.log(error);
            this.loading = false;
          },
        });
    } else {
      console.log(this.formatoProducto(this.productoForm.value))
      this.productosService
        .editarProducto(this.formatoProducto(this.productoForm.value))
        .subscribe({
          next: (productoResponse: ProductoResponse) => {
            alert(productoResponse.mensaje);
            this.router.navigate(['gestion-productos']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} producto.`);
            console.log(error);
            this.loading = false;
          },
        });
    }
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un producto
   * con el formato respectivo.
   * @param productoFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Producto.
   */
   formatoProducto(productoFormValues: any) {
    return this.formType === 'editar'
      ? ({
          nombre_insumo: this.params.nombre_insumo,
          costo: productoFormValues.costo,
          marca: productoFormValues.marca,
          cedula_juridica_proveedor: this.params.cedula_juridica_proveedor,
          //nombre_proveedor: productoFormValues.nombre_proveedor,
        } as Producto)
      : ({
        nombre_insumo: productoFormValues.nombre_insumo,
        costo: productoFormValues.costo,
        marca: productoFormValues.marca,
        cedula_juridica_proveedor: productoFormValues.cedula_juridica_proveedor,
        //nombre_proveedor: productoFormValues.nombre_proveedor,
        } as Producto);
  }
}