export interface ProveedoresResponse {
    exito: boolean;
    proveedores: Proveedor[];
}

export interface Proveedor {
    cedula_juridica_proveedor: string;
    nombre: string;
    telefono: string;
    provincia: string;
    canton: string;
    distrito: string;
    correo_electronico: string;
}

export interface ProveedorResponse {
    actualizado: boolean;
    mensaje: string;
}