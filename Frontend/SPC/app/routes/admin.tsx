import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function PanelAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const opciones = [
    { nombre: "Estadísticas", contenido: "Estadísticas", path: "/admin/estadisticas" },
    { nombre: "Libros", contenido: "Libros", path: "/admin/libros" },
    { nombre: "Audiolibros", contenido: "Audiolibros", path: "/admin/audiolibros" },
    { nombre: "Autores", contenido: "Autores", path: "/admin/autores" },
    { nombre: "Usuarios", contenido: "Usuarios", path: "/admin/usuarios" },
  ];

  // Redirigir a estadísticas si estamos en /admin sin subruta
  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/estadisticas");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar opciones={opciones} />
      <div className="ml-64 flex flex-col items-center justify-center p-6 min-h-screen">
        <div className="w-[70%] max-w-4xl bg-white shadow-lg rounded-lg p-14 text-center border border-gray-300 h-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
