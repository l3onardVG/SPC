import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import DarkModeToggle from "~/components/DarkModeToggle";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // setRole(sessionStorage.getItem("userRole"));
    setRole("admin");
  }, []);

  return (
    <nav className="navbar bg-[#618EB4] px-6 h-24 shadow-md flex justify-between items-center fixed w-full z-50">
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
                  <Link
                   to="/listLibros">Libros</Link>
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
          {role === "admin" && (
            <li>
              <Link to="/admin" className="text-white px-4 py-2 rounded">
                Panel Admin
              </Link>
            </li>
          )}
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
