import { useState } from 'react';
import { RatingService, BookRating } from '../services/RatingService';
import { mutate } from 'swr';

export const useRating = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rateBook = async (bookId: number, rating: BookRating) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await RatingService.rateBook(bookId, rating);
      
      // Revalidate book data to show updated rating
      await mutate(`/Book/GetBookById/${bookId}`);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al calificar el libro';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    rateBook,
    isLoading,
    error,
    clearError,
  };
}; 