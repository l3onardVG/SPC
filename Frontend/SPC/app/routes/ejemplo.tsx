import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Book, BookService } from "../services/BookService";

export default function Ejemplo() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await BookService.getAllBooks();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los libros");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando libros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
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
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-black mb-2">
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