import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Link } from '@remix-run/react';
import { getBookColor } from '~/utils/colorUtils';
import { renderRating } from '~/utils/ratingUtils';
import BookSearch from './BookSearch';
import { Book, BooksResponse, BookFilters } from '~/interfaces/BookInterfaces';

const BooksList: React.FC = () => {
  const { data, error, isLoading, mutate } = useSWR<BooksResponse>('/Book/GetAllBooks');
  const [filters, setFilters] = useState<BookFilters>({});
  const [showSearch, setShowSearch] = useState(false);

  // Filtrar libros basado en los criterios de búsqueda
  const filteredBooks = useMemo(() => {
    if (!data?.responseElements) return [];
    
    return data.responseElements.filter(book => {
      // Filtro por título
      if (filters.title && !book.name.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }
      
      // Filtro por autor
      if (filters.author) {
        const authorFullName = `${book.author.name} ${book.author.surname}`.toLowerCase();
        if (!authorFullName.includes(filters.author.toLowerCase())) {
          return false;
        }
      }
      
      // Filtro por año
      if (filters.year && book.yearOfPubliction !== filters.year) {
        return false;
      }
      
      return true;
    });
  }, [data?.responseElements, filters]);

  const handleSearch = (searchFilters: BookFilters) => {
    setFilters(searchFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    // Si se oculta el buscador, también limpiamos los filtros
    if (showSearch) {
      setFilters({});
    }
  };

  // Función para renderizar el icono de formato
  const renderFormatIcon = (format: number) => {
    if (format === 1) {
      return (
        <div className="flex items-center gap-1">
          <i className="fas fa-book text-sm text-blue-600"></i>
          <i className="fas fa-headphones text-sm text-purple-600"></i>
        </div>
      );
    }
    return <i className="fas fa-book text-sm text-blue-600"></i>;
  };





  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error cargando libros</h3>
          <p className="text-red-600 mt-1">{error.message}</p>
          <button
            onClick={() => mutate()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.responseElements) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-500 text-center">Libros no encontrados</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-700 tracking-wide uppercase">Biblioteca</h2>
          <button
            onClick={toggleSearch}
            className={`p-2 rounded-md transition-colors ${
              showSearch 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={showSearch ? "Ocultar búsqueda" : "Mostrar búsqueda"}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button
          onClick={() => mutate()}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
          title="Actualizar lista"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* Componente de búsqueda - condicional */}
      {showSearch && (
        <BookSearch onSearch={handleSearch} onClear={handleClearFilters} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
          >
            <div className={`h-48 flex items-center justify-center ${book.cover ? 'bg-gray-200' : getBookColor(book.name).bg}`}>
              {book.cover ? (
                <img
                  src={`data:image/jpeg;base64,${book.cover}`}
                  alt={book.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 flex items-center justify-center">
                  <i className={`fas fa-book text-4xl ${getBookColor(book.name).text}`}></i>
                </div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                {book.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-2">
                By {book.author.name} {book.author.surname}
              </p>
              
              <p className="text-sm text-gray-500 mb-2">
                {book.editorial} • {book.yearOfPubliction}
              </p>
              
              {/* Rating */}
              <div className="mb-2">
                {renderRating(book.averageRating)}
              </div>
              
              {book.summary && (
                <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                  {book.summary}
                </p>
              )}
              
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <div className="text-orange-600 text-sm font-medium flex-1">
                  Ver detalles →
                </div>
                {renderFormatIcon(book.format)}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        {Object.keys(filters).length > 0 ? (
          <span>
            Mostrando {filteredBooks.length} de {data.totalElements} libros
            {filteredBooks.length === 0 && ' - No se encontraron resultados'}
          </span>
        ) : (
          <span>Total libros: {data.totalElements}</span>
        )}
      </div>
    </div>
  );
};

export default BooksList; 