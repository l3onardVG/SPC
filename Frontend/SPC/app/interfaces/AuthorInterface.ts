export interface Author {
  id: number;
  name: string;
  surname: string;
  about: string;
  isAlive: string;
  delete: string;
  }

export interface AuthenticatedAuthor extends Author {
  nombre: string;
}

export interface AuthorResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: Author[];
}