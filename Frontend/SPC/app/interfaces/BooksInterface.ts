export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anoPublicacion: string;
  genero: string;
  idioma: string;
  isbn: string;
  formato: string;
  editorial: string;
  paginas: string;
  descripcion: string;
  disponible: boolean;
  archivo?: File | null;
}
