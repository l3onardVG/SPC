import React from "react";

interface Opcion {
  nombre: string;
  contenido: string;
}

interface SidebarProps {
  opciones: Opcion[];
  setContenido: (contenido: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ opciones, setContenido }) => {
  return (
    <div className="w-64 h-auto bg-[#EB704B] text-white flex flex-col items-center justify-center mt-6">
      <h2 className="text-lg font-bold text-white text-center self-center mt-6 pb-5">
        Panel de Administración
      </h2>
      <nav className="flex flex-col space-y-6 pb-6">
        {opciones.map((opcion, index) => (
          <button
            key={index}
            className="w-full text-center px-4 py-3 rounded-md bg-[#EB704B] text-white hover:bg-[#F5A891] transition "
            onClick={() => setContenido(opcion.contenido)}
          >
            {opcion.nombre}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
