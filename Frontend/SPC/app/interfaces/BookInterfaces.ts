// Interfaz para un libro individual
export interface Book {
  id: number;
  name: string;
  author: {
    name: string;
    surname: string;
  };
  editorial: string;
  yearOfPubliction: number;
  cover: string;
  summary: string;
  format: number; // 0 = libro, 1 = audiolibro
  averageRating: number; // Rating promedio del libro
}

// Interfaz para la respuesta de la API de libros
export interface BooksResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: Book[];
}

// Interfaz para los filtros de búsqueda
export interface BookFilters {
  title?: string;
  author?: string;
  year?: number;
} 