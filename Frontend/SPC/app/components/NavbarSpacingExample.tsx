import React from 'react';

const NavbarSpacingExample: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Visual indicator for navbar space */}
      <div className="bg-blue-100 border-b-2 border-blue-300 p-2 text-center text-blue-800 text-sm">
        🔵 Esta área representa el espacio del navbar (96px de altura)
      </div>
      
      {/* Main content */}
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Contenido Principal
          </h1>
          <p className="text-gray-600 mb-4">
            Este contenido ya no se tapa con el navbar. El navbar está fijo en la parte superior
            de la página con <code className="bg-gray-100 px-1 rounded">fixed top-0</code>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Configuración actual:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Navbar: <code>fixed top-0 h-24</code></li>
                <li>• Body: <code>pt-24</code></li>
                <li>• PageWrapper: <code>pt-24</code></li>
                <li>• Z-index: <code>z-50</code></li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-semibold text-blue-800 mb-2">📏 Medidas:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Altura navbar: 96px (h-24)</li>
                <li>• Padding-top: 96px (pt-24)</li>
                <li>• Posición: top-0 (parte superior)</li>
                <li>• Ancho: w-full (100%)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSpacingExample; 