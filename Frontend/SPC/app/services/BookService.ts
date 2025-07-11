import api from '../utils/axios';

export interface UpdateBookRequest {
  id: number;
  name: string;
  authorId: number;
  isbN13: string;
  editorial: string;
  yearOfPubliction: number;
  format: number;
  genrre: number;
  language: string;
  edition: string;
  summary: string;
  deleted: boolean;
  long: number;
  averageRating: number;
  filePath: string;
  isCurrentUserRated: boolean;
  cover: string;
}

export const BookService = {
  async updateBook(bookData: UpdateBookRequest) {
    try {
      const response = await api.put('/Book/UpdateBook', bookData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el libro');
    }
  }
}; 