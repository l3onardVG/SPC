import { useState } from "react";
import Sidebar from "../components/Sidebar";
import EstadisticasAdmin from "../components/EstadisticasAdmin";
import LibrosAdmin from "../components/LibrosAdmin";
import AudiolibrosAdmin from "../components/AudiolibrosAdmin";
import AutoresAdmin from "../components/AutoresAdmin";
import UsersAdmin from "../components/UsersAdmin";

export default function PanelAdmin() {
  const [contenido, setContenido] = useState<string>("Estadísticas");

  const opciones = [
    { nombre: "Estadísticas", contenido: "Estadísticas" },
    { nombre: "Libros", contenido: "Libros" },
    { nombre: "Audiolibros", contenido: "Audiolibros" },
    { nombre: "Autores", contenido: "Autores" },
    { nombre: "Usuarios", contenido: "Usuarios" },
  ];

  const renderizarContenido = () => {
    switch (contenido) {
      case "Estadísticas":
        return <EstadisticasAdmin />;
      case "Libros":
        return <LibrosAdmin />;
      case "Audiolibros":
        return <AudiolibrosAdmin />;
      case "Autores":
        return <AutoresAdmin />;
      case "Usuarios":
        return <UsersAdmin />;
      default:
        return <p className="text-gray-600"></p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar opciones={opciones} setContenido={setContenido} />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-[70%] max-w-4xl bg-white shadow-lg rounded-lg p-14 text-center border border-gray-300 h-auto">
          {renderizarContenido()}
        </div>
      </div>
    </div>
  );
}
