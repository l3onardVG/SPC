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
  async createBook(bookData: Omit<UpdateBookRequest, 'id' | 'averageRating' | 'isCurrentUserRated'>) {
    try {
      // Preparar el payload con la estructura correcta
      const payload = {
        authorId: parseInt(bookData.authorId.toString()),
        name: bookData.name,
        isbN13: bookData.isbN13,
        editorial: bookData.editorial,
        yearOfPubliction: parseInt(bookData.yearOfPubliction.toString()),
        format: parseInt(bookData.format.toString()),
        genrre: parseInt(bookData.genrre.toString()),
        language: bookData.language,
        cover: bookData.cover,
        edition: bookData.edition,
        summary: bookData.summary,
        deleted: bookData.deleted,
        long: parseInt(bookData.long.toString())
      };

      const response = await api.post('/Book/AddBook', payload);
      
      // Verificar si la respuesta indica éxito
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        return {
          success: true,
          message: response.data.message || 'Libro creado exitosamente',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al crear el libro'
        };
      }
    } catch (error: any) {
      // Procesar errores de validación del backend
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Error de validación';
        return {
          success: false,
          message: errorMessage,
          validationErrors: errorMessage.split('; ').filter((msg: string) => msg.trim() !== '')
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear el libro'
      };
    }
  },

  async updateBook(bookData: UpdateBookRequest) {
    try {
      const response = await api.put('/Book/UpdateBook', bookData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el libro');
    }
  }
}; 