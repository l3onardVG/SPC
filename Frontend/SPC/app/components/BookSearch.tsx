import React, { useState } from 'react';
import { BookFilters } from '~/interfaces/BookInterfaces';

interface BookSearchProps {
  onSearch: (filters: BookFilters) => void;
  onClear: () => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onSearch, onClear }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: BookFilters = {};

    if (title.trim()) filters.title = title.trim();
    if (author.trim()) filters.author = author.trim();
    if (year.trim()) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) filters.year = yearNum;
    }

    onSearch(filters);
  };

  const handleClear = () => {
    setTitle('');
    setAuthor('');
    setYear('');
    onClear();
  };

  const hasFilters = title.trim() || author.trim() || year.trim();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-in slide-in-from-top-2 duration-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 tracking-wide uppercase">Buscar libros</h3>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda por título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título del libro
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: El Principito"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Búsqueda por autor */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Autor
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej: Antoine de Saint-Exupéry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Búsqueda por año */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Año de publicación
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Ej: 1943"
              min="1800"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <i className="fas fa-search mr-2"></i>
            Buscar
          </button>
          
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <i className="fas fa-times mr-2"></i>
              Limpiar filtros
            </button>
          )}
        </div>
      </form>

      {/* Información de ayuda */}
      <div className="mt-4 text-sm text-gray-600">
        <p className="flex items-center">
          <i className="fas fa-info-circle mr-2 text-blue-500"></i>
          Puedes buscar por uno, dos o los tres criterios a la vez. Deja los campos vacíos para ver todos los libros.
        </p>
      </div>
    </div>
  );
};

export default BookSearch; 