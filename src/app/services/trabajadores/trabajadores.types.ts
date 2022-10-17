export interface TrabajadoresResponse {
    exito: boolean;
    trabajadores: Trabajador[];
}

export interface Trabajador {
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    cedula_trabajador: string;
    password_trabajador: string;
    id_rol: number;
    id_tipo_pago: number;
    fecha_ingreso: string;
    fecha_nacimiento: string;
    tipo_rol?: string;
    tipo_pago?: string;
}

export interface TrabajadorResponse {
    actualizado: boolean;
    mensaje: string;
}

export interface RolesResponse {
    exito: boolean;
    roles: Rol[];
}

export interface Rol {
    id_rol: number;
    tipo_rol: string;
    asignado?: boolean;
}

export interface RolesResponse {
    exito: boolean;
    roles: Rol[];
}

export interface Rol {
    id_rol: number;
    tipo_rol: string;
}

export interface TiposPagoResponse {
    exito: boolean;
    tipos_pago: TipoPago[];
}

export interface TipoPago {
    id_tipo_pago: number;
    tipo_pago: string;
}
