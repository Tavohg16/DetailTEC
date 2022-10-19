export interface Reporte {
    tipo_reporte: number
    cedula_cliente: string
}

export interface ReporteResponse {
    generado: boolean,
    mensaje: string,
}