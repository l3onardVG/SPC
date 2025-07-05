import React from 'react';
import useSWR from 'swr';
import { Link } from '@remix-run/react';
import { getBookColor } from '~/utils/colorUtils';

interface Book {
  id: number;
  name: string;
  author: {
    name: string;
    surname: string;
  };
  editorial: string;
  yearOfPubliction: number;
  cover: string;
  summary: string;
}

interface BooksResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: Book[];
}

const BooksList: React.FC = () => {
  const { data, error, isLoading, mutate } = useSWR<BooksResponse>('/Book/GetAllBooks');



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
          <h3 className="text-red-800 font-medium">Error loading books</h3>
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
        <p className="text-gray-500 text-center">No books found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Books Library</h2>
        <button
          onClick={() => mutate()}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
          title="Actualizar lista"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.responseElements.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                {book.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-2">
                By {book.author.name} {book.author.surname}
              </p>
              
              <p className="text-sm text-gray-500 mb-2">
                {book.editorial} • {book.yearOfPubliction}
              </p>
              
              {book.summary && (
                <p className="text-sm text-gray-700 line-clamp-3">
                  {book.summary}
                </p>
              )}
              
              <div className="mt-3 text-blue-600 text-sm font-medium">
                View details →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Total books: {data.totalElements}
      </div>
    </div>
  );
};

export default BooksList; 