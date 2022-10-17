export interface ProductosResponse {
    exito: boolean;
    productos: Producto[];
}

export interface Producto {
    nombre_insumo: string;
    costo: Number;
    marca: string;
    cedula_juridica_proveedor: string;
    nombre_proveedor?: string;
    asignado?: boolean;
}

export interface ProductoResponse {
    actualizado: boolean;
    mensaje: string;
}