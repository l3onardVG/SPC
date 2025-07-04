import { useParams } from "@remix-run/react";
import { useBook } from "../hooks/useApi";

export default function BookDetailPage() {
  const { id } = useParams();
  const bookId = id ? parseInt(id) : null;
  const { data, error, isLoading } = useBook(bookId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Error loading book</h3>
          <p className="text-red-600 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.responseElements || data.responseElements.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-yellow-800 font-medium">Book not found</h3>
          <p className="text-yellow-600 mt-1">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const book = data.responseElements[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="/books" className="hover:text-blue-600">Books</a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-900">{book.name}</li>
            </ol>
          </nav>

          {/* Book Details */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Book Cover */}
              <div className="md:w-1/3">
                {book.cover ? (
                  <img
                    src={`data:image/jpeg;base64,${book.cover}`}
                    alt={book.name}
                    className="w-full h-96 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-96 md:h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No cover available</span>
                  </div>
                )}
              </div>

              {/* Book Information */}
              <div className="md:w-2/3 p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {book.name}
                </h1>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Author</h3>
                    <p className="text-gray-600">
                      {book.author?.name} {book.author?.surname}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Publisher</h3>
                    <p className="text-gray-600">{book.editorial}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Publication Year</h3>
                    <p className="text-gray-600">{book.yearOfPubliction}</p>
                  </div>

                  {book.summary && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
                      <p className="text-gray-600 leading-relaxed">{book.summary}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex space-x-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Read Online
                  </button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Download PDF
                  </button>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Audio Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 