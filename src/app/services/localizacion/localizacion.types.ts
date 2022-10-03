export interface Localidad{
    numero: number;
    nombre: string;
    codigo_postal: number;
}

export interface LocalidadesResponse{
    data: Localidad[];
}