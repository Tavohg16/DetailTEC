export interface ClientesResponse {
    exito: boolean;
    clientes: Cliente[];
}

export interface Cliente {
    cedula_cliente: string;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    correo_cliente: string;
    usuario: string;
    password_cliente: string;
    puntos_acum: number;
    puntos_obt: number;
    puntos_redim: number;
    direcciones: Direccion[];
    telefonos: string[];
}

export interface ClienteResponse {
    actualizado: boolean;
    mensaje: string;
}

export interface Direccion {
    provincia: string;
    canton: string;
    distrito: string;
}
