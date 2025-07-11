import React, { useState } from 'react';
import useSWR from 'swr';
import { AuthorResponse } from '~/interfaces/AuthorInterface';

export default function AuthorPage() {
  const { data, error, isLoading, mutate } = useSWR<AuthorResponse>('/author/getallauthors');
  const [showSearch, setShowSearch] = useState(false);
  const toggleSearch = () => setShowSearch(prev => !prev);

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
          <h3 className="text-red-800 font-medium">Error cargando autores</h3>
          <p className="text-red-600 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.responseElements) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-500 text-center">Autores no encontrados</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-700 tracking-wide uppercase">Autores</h2>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 space-y-3">
          {data.responseElements.map((author) => (
            <div key={author.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-gray-800 font-bold">Nombre: {author.name} {author.surname}</p>
                  <p className="text-gray-600">Acerca del autor: {author.about}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
