export interface Factura {
    id_cita: number;
    cantidad_bebidas: number;
    cantidad_snacks: number;
    pago_puntos: boolean;
}

export interface FacturaResponse {
    facturada: boolean;
    mensaje: string;
}