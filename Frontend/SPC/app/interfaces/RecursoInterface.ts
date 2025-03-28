export interface Recurso {
  id: number;
  titulo: string;
  autor: string;
  narrador: string;
  genero: string;
  anoPublicacion: string;
  idioma: string;
  formato: string;
  duracion: string;
  descripcion: string;
  disponible: boolean;
  archivo?: File | null;
}
