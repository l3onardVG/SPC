import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { BookService } from '~/services/BookService';
import api from '~/utils/axios';

interface Autor {
  id: number;
  name: string;
  surname: string;
  about: string;
  isAlive: boolean;
  deleted: boolean;
}

export default function CreateBookPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [backendValidationErrors, setBackendValidationErrors] = useState<string[]>([]);
  const [authors, setAuthors] = useState<Autor[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    isbN13: '',
    editorial: '',
    yearOfPubliction: new Date().getFullYear(),
    format: 0, // 0 = libro, 1 = audiolibro
    genrre: 1, // Género por defecto
    language: 'Español',
    edition: '1',
    summary: '',
    cover: '',
    filePath: '',
    authorId: 0 // ID del autor seleccionado
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchAuthors = async () => {
      setAuthorsLoading(true);
      try {
        const response = await api.get('/author/getallauthors');
        setAuthors(response.data.responseElements || []);
      } catch (err) {
        setAuthors([]);
      } finally {
        setAuthorsLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
    
    // Limpiar errores cuando el usuario modifique cualquier campo
    if (backendError) {
      setBackendError(null);
    }
    if (backendValidationErrors.length > 0) {
      setBackendValidationErrors([]);
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remover el prefijo data:image/...
        setFormData(prev => ({
          ...prev,
          cover: base64Data
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validar autor
    if (!formData.authorId || formData.authorId === 0) {
      newErrors.authorId = 'Debe seleccionar un autor para el libro';
    }
    
    // Validar título
    if (!formData.name.trim()) {
      newErrors.name = 'El título del libro es obligatorio';
    }
    
    // Validar editorial
    if (!formData.editorial.trim()) {
      newErrors.editorial = 'La editorial es obligatoria';
    }
    
    // Validar año de publicación
    if (!formData.yearOfPubliction || formData.yearOfPubliction < 1900 || formData.yearOfPubliction > new Date().getFullYear() + 1) {
      newErrors.yearOfPubliction = 'El año de publicación debe ser válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsCreating(true);
      setBackendError(null);
      setBackendValidationErrors([]);
      
      // Preparar datos para el servicio
      const bookData = {
        ...formData,
        deleted: false,
        long: 0, // Por defecto
        averageRating: 0 // Por defecto
      };

      const result = await BookService.createBook(bookData);
      
      if (result.success) {
        // Navegar de vuelta a la lista de libros
        navigate('/admin/libros');
      } else {
        // Manejar errores de validación del backend
        if (result.validationErrors && result.validationErrors.length > 0) {
          setBackendValidationErrors(result.validationErrors);
        } else {
          setBackendError(result.message);
        }
      }
    } catch (err) {
      console.error('Error al crear libro:', err);
      setBackendError('Error inesperado al crear el libro');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/libros');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002847]">Crear Nuevo Libro</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Error del backend */}
        {backendError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-red-600 text-sm">{backendError}</p>
          </div>
        )}

        {/* Errores de validación del backend */}
        {backendValidationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-red-600 text-sm font-medium mb-2">Errores de validación:</p>
            <ul className="list-disc list-inside space-y-1">
              {backendValidationErrors.map((error, index) => (
                <li key={index} className="text-red-600 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Autor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autor *
            </label>
            <select
              name="authorId"
              value={formData.authorId}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] ${
                errors.authorId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={authorsLoading}
            >
              <option value={0} disabled>
                {authorsLoading ? 'Cargando autores...' : 'Seleccione un autor'}
              </option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} {author.surname}
                </option>
              ))}
            </select>
            {errors.authorId && (
              <p className="mt-1 text-sm text-red-600">{errors.authorId}</p>
            )}
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Libro *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingrese el título del libro"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN-13
              </label>
              <input
                type="text"
                name="isbN13"
                value={formData.isbN13}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847]"
                placeholder="978-0-000000-0-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editorial *
              </label>
              <input
                type="text"
                name="editorial"
                value={formData.editorial}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] ${
                  errors.editorial ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre de la editorial"
              />
              {errors.editorial && (
                <p className="mt-1 text-sm text-red-600">{errors.editorial}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año de Publicación *
              </label>
              <input
                type="number"
                name="yearOfPubliction"
                value={formData.yearOfPubliction}
                onChange={handleInputChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847] ${
                  errors.yearOfPubliction ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.yearOfPubliction && (
                <p className="mt-1 text-sm text-red-600">{errors.yearOfPubliction}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edición
              </label>
              <input
                type="text"
                name="edition"
                value={formData.edition}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847]"
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato *
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847]"
              >
                <option value={0}>Libro</option>
                <option value={1}>Audiolibro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género *
              </label>
              <select
                name="genrre"
                value={formData.genrre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847]"
              >
                <option value={1}>Ficción</option>
                <option value={2}>No Ficción</option>
                <option value={3}>Ciencia Ficción</option>
                <option value={4}>Fantasía</option>
                <option value={5}>Misterio</option>
                <option value={6}>Romance</option>
                <option value={7}>Terror</option>
                <option value={8}>Histórico</option>
                <option value={9}>Biografía</option>
                <option value={10}>Educativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847]"
              >
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
                <option value="Alemán">Alemán</option>
                <option value="Portugués">Portugués</option>
              </select>
            </div>
          </div>

          {/* Resumen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002847]"
              placeholder="Ingrese una breve descripción del libro..."
            />
          </div>

          {/* Portada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portada del Libro
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="cover-file"
                />
                <label
                  htmlFor="cover-file"
                  className="block w-full px-4 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                >
                  <span className="text-gray-500">Seleccionar archivo</span>
                </label>
              </div>
              {formData.cover && (
                <div className="w-16 h-20 border border-gray-300 rounded overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${formData.cover}`}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Archivo (para audiolibros) */}
          {formData.format === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo de Audio
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  name="filePath"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({
                        ...prev,
                        filePath: file.name
                      }));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="audio-file"
                />
                <label
                  htmlFor="audio-file"
                  className="block w-full px-4 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-gray-500">Seleccionar archivo de audio</span>
                </label>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creando...
                </span>
              ) : (
                'Crear Libro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 