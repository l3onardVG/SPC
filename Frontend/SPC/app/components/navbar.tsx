import { Link } from "@remix-run/react";
import DarkModeToggle from "~/components/DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="navbar bg-[#618EB4] px-6 h-24 shadow-md flex justify-between items-center fixed w-full z-50">
      <div className="navbar-start flex items-center">
        <a href="/" className="flex items-center">
          <img src="\LogoSPC.png" alt="Logo" className="h-20 w-auto px-16" />
        </a>
      </div>

      <div className="navbar-center hidden lg:flex ml-[-350px]">
        <ul className="menu menu-horizontal px-1 text-white text-lg font-[Be Vietnam Pro] font-bold space-x-10">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="#">Nosotros</Link>
          </li>
          <li>
            <details>
              <summary>Biblioteca</summary>
              <ul className="p-2 bg-[#618EB4] text-white rounded-md font-[Be Vietnam Pro] font-bold">
                <li>
                  <Link to="#">Libros</Link>
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
            <Link to="#">Tienda</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end  space-x-20 ">
        <Link
          to="/login"
          className="text-white flex items-center gap-2 text-lg font-[Be Vietnam Pro] font-bold"
        >
          <i className="fas fa-user-circle text-lg font-[Be Vietnam Pro] font-bold"></i>
          Mi cuenta
        </Link>
        <DarkModeToggle />

        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost"></button>
        </div>
      </div>
    </nav>
  );
}
