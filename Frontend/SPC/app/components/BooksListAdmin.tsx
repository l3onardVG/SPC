import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useBooks } from '../hooks/useApi';
import { Book } from '../interfaces/BookInterfaces';

export default function BooksListAdmin() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useBooks();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (data && typeof data === 'object' && 'responseElements' in data && Array.isArray((data as any).responseElements)) {
      setBooks((data as any).responseElements);
    }
  }, [data]);

  const handleEdit = (bookId: number) => {
    navigate(`/admin/book/edit/${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-full mx-auto bg-white rounded-lg">
        <h3 className="text-2xl font-bold text-[#002847] mb-6">
          Gestión de Libros
        </h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002847]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full mx-auto bg-white rounded-lg">
        <h3 className="text-2xl font-bold text-[#002847] mb-6">
          Gestión de Libros
        </h3>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar los libros</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#002847]">
          Gestión de Libros
        </h3>
        <button 
          onClick={() => navigate('/admin/book/create')}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          Agregar Nuevo Libro
        </button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500">No hay libros registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {book.cover && book.cover.trim() !== '' ? (
                        <img 
                          className="h-10 w-8 object-cover rounded mr-3" 
                          src={`data:image/jpeg;base64,${book.cover}`}
                          alt={book.name}
                          onError={(e) => {
                            // Si la imagen falla, ocultar el elemento
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="h-10 w-8 bg-gray-200 rounded mr-3 flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {book.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {book.editorial}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.format === 0 ? 'Libro' : 'Audiolibro'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.yearOfPubliction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(book.id)}
                      className="text-[#002847] hover:text-[#001a2e] font-medium mr-3"
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 