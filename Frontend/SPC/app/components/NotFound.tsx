import { Link } from "@remix-run/react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icono de error */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500"></i>
          </div>
        </div>

        {/* Título y mensaje */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 tracking-wide uppercase">
          ¡Oops! Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          La página que buscas no existe o ha sido movida. 
          No te preocupes, puedes volver al inicio y continuar explorando nuestra biblioteca digital.
        </p>

        {/* Botones de acción */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-[#618EB4] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#4A769D] transition-colors duration-200"
          >
            <i className="fas fa-home mr-2"></i>
            Volver al inicio
          </Link>
          
          <Link
            to="/books"
            className="inline-block w-full bg-white text-[#618EB4] font-semibold py-3 px-6 rounded-lg border-2 border-[#618EB4] hover:bg-[#618EB4] hover:text-white transition-colors duration-200"
          >
            <i className="fas fa-book mr-2"></i>
            Explorar biblioteca
          </Link>
        </div>

        {/* Información adicional */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contacta con nuestro equipo de soporte
          </p>
          <Link
            to="/aboutUs"
            className="text-[#618EB4] hover:underline text-sm font-medium"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  );
} 