import React from 'react';
import { useBookReviews } from '../hooks/useApi';
import { getBookColor } from '../utils/colorUtils';

interface BookReview {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  userSurname: string;
  timestamp: string;
  isCurrentUserReview: boolean;
}

interface BookReviewsProps {
  bookId: number;
}

export default function BookReviews({ bookId }: BookReviewsProps) {
  const { data, error, isLoading } = useBookReviews(bookId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reseñas</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reseñas</h2>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar las reseñas</p>
        </div>
      </div>
    );
  }

  const reviews = data?.responseElements || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reseñas</h2>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500">No hay reseñas todavía</p>
          <p className="text-sm text-gray-400 mt-1">Sé el primero en compartir tu opinión</p>
        </div>
      ) : (
        <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-6 w-full max-w-4xl">
          {reviews.map((review: BookReview) => {
            const initials = `${review.userName.charAt(0)}${review.userSurname.charAt(0)}`.toUpperCase();
            const avatarColors = getBookColor(`${review.userName} ${review.userSurname}`);
            
            return (
              <React.Fragment key={review.id}>
                {/* Avatar y nombre del usuario */}
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColors.bg} ${avatarColors.text}`}>
                    {initials}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {review.userName} {review.userSurname}
                    </p>
                    {review.isCurrentUserReview && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        Tu reseña
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Contenido de la reseña */}
                <div className="min-w-0 pb-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">
                            {i < review.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.timestamp).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
} 