import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@remix-run/react';
import { useBookDetail } from '../hooks/useApi';
import { BookDetail } from '../interfaces/BookInterfaces';
import { BookService } from '../services/BookService';
import Notification from '../components/Notification';

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookId = parseInt(id || '0');
  const { data, error, isLoading } = useBookDetail(bookId);
  const [book, setBook] = useState<BookDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Mapeo de géneros basado en el enum del backend
  const genres = [
    { value: 0, label: 'Ficción Literaria' },
    { value: 1, label: 'Ficción Histórica' },
    { value: 2, label: 'Ciencia Ficción' },
    { value: 3, label: 'Fantasía' },
    { value: 4, label: 'Aventura' },
    { value: 5, label: 'Realismo Mágico' },
    { value: 6, label: 'Otro' }
  ];

  // Mapeo de idiomas
  const languages = [
    { value: 'ES', label: 'Español' },
    { value: 'EN', label: 'English' }
  ];

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
      // Crear objeto para actualizar incluyendo el campo cover
      const updateData = {
        id: book.id,
        name: book.name,
        authorId: book.authorId,
        isbN13: book.isbN13,
        editorial: book.editorial,
        yearOfPubliction: book.yearOfPubliction,
        format: book.format,
        genrre: book.genrre,
        language: book.language,
        edition: book.edition,
        summary: book.summary,
        deleted: book.deleted,
        long: book.long,
        averageRating: book.averageRating,
        filePath: book.filePath,
        isCurrentUserRated: book.isCurrentUserRated,
        cover: book.cover || ''
      };

      await BookService.updateBook(updateData);
      
      // Mostrar notificación de éxito
      setNotification({
        message: "Libro actualizado correctamente",
        type: "success",
        isVisible: true,
      });
      
      // Navegar después de un breve delay para que se vea la notificación
      setTimeout(() => {
        navigate('/admin/libros');
      }, 1500);
    } catch (error: any) {
      console.error('Error al actualizar libro:', error);
      
      // Mostrar notificación de error
      setNotification({
        message: `Error al actualizar el libro: ${error.message}`,
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
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
                <select
                  value={book?.genrre || 0}
                  onChange={(e) => handleInputChange('genrre', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                >
                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select
                  value={book?.language || 'ES'}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] focus:border-transparent"
                >
                  {languages.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Imagen de portada
              </label>
              
              {/* Imagen actual */}
              {book?.cover && book.cover.trim() !== '' ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">Imagen actual:</p>
                  <div className="relative inline-block">
                    <img
                      src={`data:image/jpeg;base64,${book.cover}`}
                      alt="Portada actual"
                      className="h-48 w-auto border border-gray-300 rounded-lg shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('cover', '')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Eliminar imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="h-48 w-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Sin imagen</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Botón para subir/editar imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {book?.cover && book.cover.trim() !== '' ? 'Cambiar imagen' : 'Subir imagen'}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validar tamaño del archivo (máximo 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('El archivo es demasiado grande. Máximo 5MB permitido.');
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const result = event.target?.result as string;
                            // Extraer solo la parte base64 (remover el prefijo data:image/...;base64,)
                            const base64 = result.split(',')[1];
                            if (base64) {
                              handleInputChange('cover', base64);
                              console.log('Imagen convertida a base64 exitosamente');
                            } else {
                              alert('Error al procesar la imagen');
                            }
                          } catch (error) {
                            console.error('Error al convertir imagen:', error);
                            alert('Error al procesar la imagen');
                          }
                        };
                        reader.onerror = () => {
                          alert('Error al leer el archivo');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#002847] file:text-white hover:file:bg-[#001a2e] transition-colors"
                  />
                  <span className="text-xs text-gray-500">
                    Formatos: JPG, PNG, GIF (máx. 5MB)
                  </span>
                </div>
              </div>
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

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleNotificationClose}
      />
    </div>
  );
} 