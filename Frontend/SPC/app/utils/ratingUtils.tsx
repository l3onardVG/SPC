import React from 'react';

// Función para renderizar el rating basado en averageRating
export const renderRating = (averageRating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isActive = i <= averageRating;
    stars.push(
      <div 
        key={i}
        className={`mask mask-star ${isActive ? 'bg-yellow-400' : 'bg-gray-300'}`} 
        aria-label={`${i} star`}
        aria-current={i === Math.ceil(averageRating) ? 'true' : undefined}
      ></div>
    );
  }
  
  return (
    <div className="rating rating-sm">
      {stars}
    </div>
  );
}; 