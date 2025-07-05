import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar bg-[#618EB4] px-6 h-24 shadow-md flex justify-between items-center fixed top-0 w-full z-50">
      <div className="navbar-start flex items-center">
        <Link to="/" className="flex items-center">
          <img src="\LogoSPC.png" alt="Logo" className="h-20 w-auto px-20" />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex ml-[-350px]">
        <ul className="menu menu-horizontal px-1 text-white text-lg font-[Be Vietnam Pro] font-bold space-x-1">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="aboutUs">Nosotros</Link>
          </li>
          <li>
            <details>
              <summary>Biblioteca</summary>
              <ul className="p-2 bg-[#618EB4] text-white rounded-md font-[Be Vietnam Pro] font-bold">
                <li>
                  <Link to="/books">Libros</Link>
                </li>
                <li>
                  <Link to="#">Audiolibros</Link>
                </li>
                <li>
                  <Link to="#">Autores</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link to="/listBookShop">Tienda</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end space-x-20">
        <div className="text-white flex items-center gap-2 text-lg font-[Be Vietnam Pro] font-bold">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Cargando...</span>
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span>Hola, {user.userName}</span>
              <button
                onClick={handleLogout}
                className="btn btn-ghost text-white hover:bg-white hover:text-[#618EB4]"
              >
                <i className="fas fa-sign-out-alt text-lg"></i>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/login">
              <i className="fas fa-user-circle text-lg"></i>
              Mi cuenta
            </Link>
          )}
        </div>
        <DarkModeToggle />
      </div>

      <div className="lg:hidden">
        <button
          tabIndex={0}
          className="btn btn-ghost"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="fas fa-bars text-white text-2xl"></i>
        </button>
        {isOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-[#618EB4] text-white rounded-md shadow-lg">
            <li className="p-2 hover:bg-[#4A769D]">
              <Link to="/">Inicio</Link>
            </li>
            <li className="p-2 hover:bg-[#4A769D]">
              <Link to="aboutUs">Nosotros</Link>
            </li>
            <li>
              <details>
                <summary>Biblioteca</summary>
                <ul className="p-2 bg-[#618EB4] text-white rounded-md font-[Be Vietnam Pro] font-bold">
                  <li>
                    <Link to="/books">Libros</Link>
                  </li>
                  <li>
                    <Link to="#">Audiolibros</Link>
                  </li>
                  <li>
                    <Link to="#">Autores</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li className="p-2 hover:bg-[#4A769D]">
              <Link to="#">Tienda</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
