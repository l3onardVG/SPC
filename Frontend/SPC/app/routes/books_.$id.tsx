import { useParams } from "@remix-run/react";
import { useBookDetail, revalidateBookDetail, revalidateBookReviews } from "../hooks/useApi";
import { BookDetail } from "../interfaces/BookInterfaces";
import PageWrapper from "../components/PageWrapper";
import RatingModal from "../components/RatingModal";
import Notification from "../components/Notification";
import BookReviews from "../components/BookReviews";
import { useState } from "react";

export default function BookDetailPage() {
  const { id } = useParams();
  const bookId = id ? parseInt(id) : null;
  const { data, error, isLoading } = useBookDetail(bookId);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium">Error al cargar el libro</h3>
            <p className="text-red-600 mt-1">{error.message}</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!data || !data.responseElements || data.responseElements.length === 0) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-yellow-800 font-medium">Libro no encontrado</h3>
            <p className="text-yellow-600 mt-1">El libro que buscas no existe.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const book = data.responseElements[0] as BookDetail;

  const handleRatingSuccess = async () => {
    // Revalidar los datos del libro y las reseñas para obtener la información actualizada
    if (bookId) {
      await Promise.all([
        revalidateBookDetail(bookId),
        revalidateBookReviews(bookId)
      ]);
    }
    
    // Mostrar notificación de éxito
    setNotification({
      message: "¡Libro calificado exitosamente!",
      type: "success",
      isVisible: true,
    });
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-2 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column - Fixed/Sticky */}
              <div className="lg:col-span-1">
                <div className="sticky top-40">
                  {/* Breadcrumb */}
                  <nav className="mb-4">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                      <li>
                        <a href="/books" className="hover:text-blue-600">Libros</a>
                      </li>
                      <li>
                        <span className="mx-2">/</span>
                      </li>
                      <li className="text-gray-900">{book.name}</li>
                    </ol>
                  </nav>
                  {/* Book Cover */}
                  <div className="bg-white rounded-r-lg shadow-lg overflow-hidden mb-6 backdrop-blur-sm">
                    {book.cover ? (
                      <img
                        src={`data:image/jpeg;base64,${book.cover}`}
                        alt={book.name}
                        className="w-full h-96 object-cover"
                      />
                    ) : (
                      <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No hay portada disponible</span>
                      </div>
                    )}
                  </div>

                                    {/* Rating Section */}
                  <div className="bg-transparent flex flex-col items-center">
                   <button
                       onClick={() => !book.isCurrentUserRated && setIsRatingModalOpen(true)}
                       disabled={book.isCurrentUserRated}
                       className={`w-full py-3 px-6 rounded-full transition-colors mb-6 ${
                         book.isCurrentUserRated
                           ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                           : 'bg-orange-500 text-white hover:bg-orange-600'
                       }`}
                     >
                       {book.isCurrentUserRated ? 'Ya calificaste este libro' : 'Calificar'}
                     </button>                    
                      {/* Current Rating Display */}
                                            <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-2xl">
                                {i < Math.floor(book.averageRating || 0) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">
                            {book.averageRating ? book.averageRating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {book.averageRating ? 'Basado en las calificaciones de los usuarios' : 'No hay calificaciones todavía'}
                        </p>
                      </div>

                    {/* Rating Button */}

                  </div>
                </div>
              </div>

              {/* Right Column - Scrollable Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Book Information Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  {/* Title */}
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {book.name}
                  </h1>

                  {/* Author */}
                  <div className="mb-6">
                    <h2 className="text-xl text-gray-700 mb-2">Autor</h2>
                    <p className="text-lg text-gray-900">
                      {book.author?.name} {book.author?.surname}
                    </p>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="mb-6">
                    <h2 className="text-xl text-gray-700 mb-2">Calificación</h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-xl">
                              {i < Math.floor(book.averageRating || 0) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {book.averageRating ? book.averageRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        ({book.averageRating ? 'Basado en las calificaciones de los usuarios' : 'No hay calificaciones todavía'})
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {book.summary && (
                    <div className="mb-6">
                      <h2 className="text-xl text-gray-700 mb-2">Descripción</h2>
                      <p className="text-gray-600 leading-relaxed">{book.summary}</p>
                    </div>
                  )}

                  {/* Genre */}
                  <div className="mb-6">
                    <h2 className="text-xl text-gray-700 mb-2">Género</h2>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {book.format === 1 ? 'Audiolibro' : 'Libro'}
                    </span>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xl text-gray-700 mb-2">Editorial</h2>
                      <p className="text-gray-600">{book.editorial}</p>
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-700 mb-2">Año de publicación</h2>
                      <p className="text-gray-600">{book.yearOfPubliction}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4">
                      <button className="text-blue-600 px-6 py-3 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                        Leer en línea
                      </button>
                      <button className="text-green-600 px-6 py-3 rounded-md hover:bg-green-600 hover:text-white transition-colors">
                        Descargar PDF
                      </button>
                      {book.format === 1 && (
                        <button className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors">
                          Escuchar audio
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <BookReviews bookId={book.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        bookId={book.id}
        bookName={book.name}
        onRatingSuccess={handleRatingSuccess}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleNotificationClose}
      />
    </PageWrapper>
  );
} 