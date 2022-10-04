export interface SucursalesResponse {
    exito: boolean;
    sucursales: Sucursal[];
}

export interface Sucursal {
    nombre_sucursal: string;
    telefono: string;
    cedula_trabajador_gerente: string;
    provincia: string;
    canton: string;
    distrito: string;
    fecha_apertura: string;
    fecha_inicio_gerencia: string;
}

export interface SucursalResponse {
    actualizado: boolean;
    mensaje: string;
}

