import React from "react";
import { useNavigate, useLocation } from "@remix-run/react";

interface Opcion {
  nombre: string;
  contenido: string;
  path: string;
}

interface SidebarProps {
  opciones: Opcion[];
}

const Sidebar: React.FC<SidebarProps> = ({ opciones }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-[#EB704B] text-white flex flex-col items-center justify-center fixed left-0 top-0">
      <h2 className="text-lg font-bold text-white text-center self-center mt-6 pb-5">
        Panel de Administración
      </h2>
      <nav className="flex flex-col space-y-6 pb-6">
        {opciones.map((opcion, index) => (
          <button
            key={index}
            className={`w-full text-center px-4 py-3 rounded-md transition ${
              location.pathname === opcion.path
                ? 'bg-[#F5A891] text-white'
                : 'bg-[#EB704B] text-white hover:bg-[#F5A891]'
            }`}
            onClick={() => navigate(opcion.path)}
          >
            {opcion.nombre}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
