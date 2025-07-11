import { Link } from "@remix-run/react";
import { useBooks } from "../hooks/useApi";
import { Book, BooksResponse } from "../interfaces/BookInterfaces";

export default function Ejemplo() {
  const { data, error, isLoading } = useBooks();
  const books = (data as BooksResponse)?.responseElements || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando libros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">
          Lista de Libros
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: Book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {book.name}
              </h2>
              <p className="text-gray-600 mb-2">
                Autor: {book.author?.name} {book.author?.surname}
              </p>
              <p className="text-gray-600 mb-2">
                Editorial: {book.editorial}
              </p>
              <p className="text-gray-600 mb-2">
                Año: {book.yearOfPubliction}
              </p>
              <p className="text-gray-600 mb-4">
                Calificación: {book.averageRating.toFixed(1)}/5
              </p>
              <p className="text-gray-700 line-clamp-3">
                {book.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="btn bg-[#EB704B] border-none shadow-none text-white font-bold"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 