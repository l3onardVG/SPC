import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();



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

      <div className="navbar-end flex items-center gap-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-white text-lg font-[Be Vietnam Pro] font-bold">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Cargando...</span>
          </div>
        ) : isAuthenticated && user ? (
          <span className="text-white text-lg font-[Be Vietnam Pro] font-bold">
            Hola, {user.name && user.surname ? `${user.name} ${user.surname}` : user.userName}
          </span>
        ) : (
          <Link to="/login" className="text-white text-lg font-[Be Vietnam Pro] font-bold flex items-center gap-2">
            <i className="fas fa-user-circle text-lg"></i>
            Mi cuenta
          </Link>
        )}
        <Avatar />
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
