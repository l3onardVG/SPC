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

// Interfaz para el detalle del libro con información del usuario
export interface BookDetail {
  authorId: number;
  name: string;
  isbN13: string;
  editorial: string;
  yearOfPubliction: number;
  format: number;
  genrre: number;
  language: string;
  cover: string;
  edition: string;
  summary: string;
  deleted: boolean;
  long: number;
  averageRating: number;
  filePath: string;
  author: {
    name: string;
    surname: string;
  } | null;
  id: number;
  isCurrentUserRated: boolean;
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