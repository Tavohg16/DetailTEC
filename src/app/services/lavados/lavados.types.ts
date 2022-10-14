import { Rol } from "../trabajadores/trabajadores.types";

export interface LavadosResponse {
    exito: boolean;
    lavados: Lavado[];
}

export interface Lavado {
    nombre_lavado: string;
    costo_personal: number;
    precio: number;
    duracion: number;
    puntos_otorgados: number;
    costo_puntos: number;
    insumos?: string[];
    roles?: Rol[];

}

export interface LavadoResponse {
    actualizado: boolean;
    mensaje: string;
}



