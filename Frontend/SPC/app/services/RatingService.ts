import api from "../utils/axios";

export interface BookRating {
  rating: number;
  comment?: string;
}

export interface RatingResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: any[];
}

export const RatingService = {
  async rateBook(bookId: number, rating: BookRating): Promise<RatingResponse> {
    try {
      const response = await api.post(`/BookLog/RateBook/${bookId}`, rating);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al calificar el libro";
      throw new Error(errorMessage);
    }
  },
}; 