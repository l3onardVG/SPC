export interface Autor {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  pais: string;
  idiomas: string;
  generos: string;
  galardones: string;
  pseudonimo?: string;
  estaVivo: boolean;
  fechaMuerte?: string;
  nacionalidad: string;
  activo: boolean;
}
