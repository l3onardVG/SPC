import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@remix-run/react';
import { useBookDetail } from '../hooks/useApi';
import { BookDetail } from '../interfaces/BookInterfaces';

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookId = parseInt(id || '0');
  const { data, error, isLoading } = useBookDetail(bookId);
  const [book, setBook] = useState<BookDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (data) {
      const dataAny = data as any;
      
      if (dataAny.responseElements && Array.isArray(dataAny.responseElements)) {
        // Si responseElements es un array, tomar el primer elemento
        setBook(dataAny.responseElements[0]);
      } else if (dataAny.responseElements) {
        setBook(dataAny.responseElements);
      } else if (dataAny.responseElement) {
        setBook(dataAny.responseElement);
      } else if (dataAny.data) {
        setBook(dataAny.data);
      } else {
        setBook(dataAny);
      }
      
      setIsInitialized(true);
    }
  }, [data]);

  const handleInputChange = (field: keyof BookDetail, value: any) => {
    if (book) {
      setBook({
        ...book,
        [field]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    setIsSubmitting(true);
    try {
      // Aquí iría la llamada a la API para actualizar el libro
      console.log('Actualizando libro:', book);
      alert('Libro actualizado correctamente');
      navigate('/admin');
    } catch (error) {
      console.error('Error al actualizar libro:', error);
      alert('Error al actualizar el libro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002847] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando libro...</p>
        </div>
      </div>
    );
  }

  if (error || (!book && isInitialized)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar el libro</p>
          <button
            onClick={() => navigate('/admin')}
            className="bg-[#002847] text-white px-4 py-2 rounded-md hover:bg-[#001a2e] transition-colors"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  if (!book || !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002847] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#002847]">Editar Libro</h1>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del libro
                </label>
                <input
                  type="text"
                  value={book?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN-13
                </label>
                <input
                  type="text"
                  value={book?.isbN13 || ''}
                  onChange={(e) => handleInputChange('isbN13', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Editorial
                </label>
                <input
                  type="text"
                  value={book?.editorial || ''}
                  onChange={(e) => handleInputChange('editorial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de publicación
                </label>
                <input
                  type="number"
                  value={book?.yearOfPubliction || ''}
                  onChange={(e) => handleInputChange('yearOfPubliction', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato
                </label>
                <select
                  value={book?.format || 0}
                  onChange={(e) => handleInputChange('format', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                >
                  <option value={0}>Libro</option>
                  <option value={1}>Audiolibro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <input
                  type="number"
                  value={book?.genrre || ''}
                  onChange={(e) => handleInputChange('genrre', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <input
                  type="text"
                  value={book?.language || ''}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edición
                </label>
                <input
                  type="text"
                  value={book?.edition || ''}
                  onChange={(e) => handleInputChange('edition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de páginas
                </label>
                <input
                  type="number"
                  value={book?.long || ''}
                  onChange={(e) => handleInputChange('long', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={book?.summary || ''}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent resize-none"
              />
            </div>

            {/* Imagen de portada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de portada (Base64)
              </label>
              <textarea
                value={book?.cover || ''}
                onChange={(e) => handleInputChange('cover', e.target.value)}
                rows={3}
                placeholder="Pega aquí el código base64 de la imagen"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent resize-none font-mono text-sm"
              />
              {book?.cover && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                  <img
                    src={`data:image/jpeg;base64,${book.cover}`}
                    alt="Vista previa"
                    className="h-32 w-auto border border-gray-300 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="flex items-center">
                              <input
                  type="checkbox"
                  id="deleted"
                  checked={book?.deleted || false}
                  onChange={(e) => handleInputChange('deleted', e.target.checked)}
                  className="h-4 w-4 text-[#002847] focus:ring-[#002847] border-gray-300 rounded"
                />
              <label htmlFor="deleted" className="ml-2 block text-sm text-gray-700">
                Libro eliminado (oculto)
              </label>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#002847] text-white rounded-md hover:bg-[#001a2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 