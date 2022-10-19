export interface Reporte {
    id: number,
    dia_inicio?: number,
    mes_inicio?: number,
    ano_inicio?: number,
    dia_final?: number,
    mes_final?: number,
    ano_final?: number
}

export interface ReporteResponse {
    actualizado: boolean,
    mensaje: string,
}