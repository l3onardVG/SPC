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
            <a href="#">Inicio</a>
          </li>
          <li>
            <a href="#">Nosotros</a>
          </li>
          <li>
            <details>
              <summary>Biblioteca</summary>
              <ul className="p-2 bg-[#618EB4] text-white rounded-md font-[Be Vietnam Pro] font-bold">
                <li>
                  <a href="#">Libros</a>
                </li>
                <li>
                  <a href="#">Audiolibros</a>
                </li>
                <li>
                  <a href="#">Autores</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a href="#">Tienda</a>
          </li>
        </ul>
      </div>

      <div className="navbar-end  space-x-20 ">
        <a
          href="#"
          className="text-white flex items-center gap-2 text-lg font-[Be Vietnam Pro] font-bold"
        >
          <i className="fas fa-user-circle text-lg font-[Be Vietnam Pro] font-bold"></i>
          Mi cuenta
        </a>
        <button className="text-white">
          <i className="fas fa-moon"></i>
        </button>

        <div className="dropdown">
          <div tabIndex={0} className="btn btn-ghost"></div>
        </div>
      </div>
    </nav>
  );
}
