import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from '../services/sucursales/sucursales.service';
import { LocalizacionService } from '../services/localizacion/localizacion.service';
import { 
  Localidad,
  LocalidadesResponse
} from '../services/localizacion/localizacion.types'
import { Sucursal, SucursalResponse } from '../services/sucursales/sucursales.types';



@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css']
})
export class SucursalComponent implements OnInit {
  // Definiendo variablea a utilizar
  protected params: any;
  protected formType: string;
  protected title: string;
  protected lista_provincias: Localidad[] = [];
  protected lista_cantones: Localidad[] = [];
  protected lista_distritos: Localidad[] = [];
  protected id_provincia: string ="";
  protected nombre_provincia: string = "";
  protected id_canton: string ="";
  protected nombre_canton: string = "";
  protected id_distrito: string = "";
  protected nombre_distrito: string = "";
  protected sucursalForm: FormGroup;
  protected loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localidadService: LocalizacionService,
    private sucursalesService: SucursalesService
  ) {
    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando un trabajador
     * y así armar los formularios respectivamente.
     */
     
     this.params = router.getCurrentNavigation()?.extras.state;
     if (!this.params) {
       this.formType = 'crear';
       this.title = 'Crear sucursal';
       this.sucursalForm = this.formBuilder.group({
         nombre_sucursal: [null, Validators.required],
         telefono: [null, Validators.required],
         cedula_trabajador_gerente: [
          null,
          [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
         provincia: [0, Validators.required],
         canton: [0, Validators.required],
         distrito: [0, Validators.required],
         fecha_apertura: [null, Validators.required],
         fecha_inicio_gerencia: [null, Validators.required],
         
       });
     } else {
       this.formType = 'editar';
       this.title = 'Editar sucursal';
       const fechaAperturaSucursal = new Date(this.params.fecha_apertura);
       const fechaInicioGerencia = new Date(this.params.fecha_inicio_gerencia);
       this.sucursalForm = this.formBuilder.group({
         nombre_sucursal: [this.params.nombre_sucursal, Validators.required],
         telefono: [this.params.telefono, Validators.required],
         cedula_trabajador_gerente: [this.params.cedula_trabajador_gerente, Validators.required],
         provincia: [this.params.provincia, Validators.required],
         canton: [this.params.canton, Validators.required],
         distrito: [this.params.distrito, Validators.required],
         fecha_apertura: [
           {
             year: fechaAperturaSucursal.getFullYear(), 
             month: fechaAperturaSucursal.getMonth() + 1,
             day: fechaAperturaSucursal.getDate(),
           },
           Validators.required,
         ],
         fecha_inicio_gerencia: [
           {
             year: fechaInicioGerencia.getFullYear(), 
             month: fechaInicioGerencia.getMonth() + 1,
             day: fechaInicioGerencia.getDate(),
           },
           Validators.required,
         ],
       });
     }

     
   }

  

  ngOnInit(): void {
    // Obteniendo opciones de localidades
    
    this.localidadService.ObtenerProvincias().subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_provincias = localidadesResponse.data;

        
      }
    });
  }

  seleccionarProvincia(provincia:string): void {
    this.id_provincia = provincia;
    var index = Number(this.id_provincia) - 1;
    this.nombre_provincia = this.lista_provincias[index].nombre;
    this.localidadService.ObtenerCantones(this.id_provincia).subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_cantones = localidadesResponse.data;
        
      }  
    })
  }

  seleccionarCanton(canton:string): void {
    this.id_canton = canton;
    var index = Number(this.id_canton) - 1;
    this.nombre_canton = this.lista_cantones[index].nombre;
    this.localidadService.ObtenerDistritos(this.id_provincia,this.id_canton).subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_distritos = localidadesResponse.data;
      }
    })
  }

  seleccionarDistrito(distrito:string): void {
    this.id_distrito = distrito;
    var index = Number(this.id_distrito) - 1;
    this.nombre_distrito = this.lista_distritos[index].nombre;
  }

  

  // Getter para acceder facilmente a los form fields
  get trabajadorFormControls() {
    return this.sucursalForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.sucursalForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.formType == 'crear') {
      this.sucursalesService
        .crearSucursal(this.formatoSucursal(this.sucursalForm.value))
        .subscribe({
          next: (sucursalResponse: SucursalResponse) => {
            alert(sucursalResponse.mensaje);
            this.router.navigate(['gestion-sucursales']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} sucursal.`);
            console.log(error);
            this.loading = false;
          },
        });
    } else {
      this.sucursalesService
        .editarSucursal(this.formatoSucursal(this.sucursalForm.value))
        .subscribe({
          next: (sucursalResponse: SucursalResponse) => {
            alert(sucursalResponse.mensaje);
            this.router.navigate(['gestion-sucursales']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} sucursal.`);
            console.log(error);
            this.loading = false;
          },
        });
    }
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un trabajador
   * con el formato respectivo.
   * @param trabajadorFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Trabajador.
   */
   formatoSucursal(sucursalFormValues: any) {
    return this.formType === 'editar'
      ? ({
          nombre_sucursal: sucursalFormValues.nombre_sucursal,
          telefono: sucursalFormValues.telefono,
          cedula_trabajador_gerente: sucursalFormValues.cedula_trabajador_gerente,
          provincia: sucursalFormValues.provincia,
          canton: sucursalFormValues.canton,
          distrito: sucursalFormValues.distrito,
          fecha_apertura: (new Date(sucursalFormValues.fechaAperturaSucursal.year, sucursalFormValues.fechaAperturaSucursal.month - 1, sucursalFormValues.fechaAperturaSucursal.day)).toISOString(),
          fecha_inicio_gerencia: (new Date(sucursalFormValues.fechaInicioGerencia.year, sucursalFormValues.fechaInicioGerencia.month - 1, sucursalFormValues.fechaInicioGerencia.day)).toISOString(),
        } as Sucursal)
      : ({
        nombre_sucursal: sucursalFormValues.nombre_sucursal,
        telefono: sucursalFormValues.telefono,
        cedula_trabajador_gerente: sucursalFormValues.cedula_trabajador_gerente,
        provincia: sucursalFormValues.provincia,
        canton: sucursalFormValues.canton,
        distrito: sucursalFormValues.distrito,
        fecha_apertura: (new Date(sucursalFormValues.fecha_apertura.year, sucursalFormValues.fecha_apertura.month - 1, sucursalFormValues.fecha_apertura.day)).toISOString(),
          fecha_inicio_gerencia: (new Date(sucursalFormValues.fecha_inicio_gerencia.year, sucursalFormValues.fecha_inicio_gerencia.month - 1, sucursalFormValues.fecha_inicio_gerencia.day)).toISOString(),
        } as Sucursal);
  }
}
