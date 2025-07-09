import React, { useState } from "react";
import { BookRating } from "../services/RatingService";
import { useRating } from "../hooks/useRating";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: number;
  bookName: string;
  onRatingSuccess: () => void;
}

export default function RatingModal({ 
  isOpen, 
  onClose, 
  bookId, 
  bookName, 
  onRatingSuccess 
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { rateBook, isLoading, error, clearError } = useRating();

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredRating: number) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    try {
      const ratingData: BookRating = {
        rating,
        comment: comment.trim() || undefined,
      };

      await rateBook(bookId, ratingData);
      
      // Reset form
      setRating(0);
      setComment("");
      clearError();
      
      // Close modal and notify parent
      onClose();
      onRatingSuccess();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRating(0);
      setComment("");
      clearError();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Calificar libro
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Book Name */}
        <p className="text-gray-600 mb-4">{bookName}</p>

        {/* Rating Stars */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu calificación:
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                disabled={isLoading}
                className="text-3xl transition-colors disabled:opacity-50"
              >
                <span className={`
                  ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}
                  hover:text-yellow-400
                `}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rating > 0 ? `${rating} estrella${rating > 1 ? 's' : ''}` : 'Selecciona una calificación'}
          </p>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentario (opcional):
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            placeholder="Escribe tu opinión sobre el libro..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || rating === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              'Calificar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 