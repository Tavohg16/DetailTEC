export interface CitasResponse {
    exito: boolean;
    citas: Cita[];
}

export interface Cita {
    id_cita: number;
    cedula_cliente?: string;
    nombre_cliente: string;
    apellido_cliente: string;
    placa_vehiculo: string;
    nombre_sucursal: string;
    nombre_lavado: string;
    cedula_trabajador?: number;
    nombre_trabajador: string;
    apellido_trabajador: string;
    hora: string;
    facturada: boolean;
    duracion: number;
}

export interface CitaResponse {
    actualizado: boolean;
    mensaje: string;
}