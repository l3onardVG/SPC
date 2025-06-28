import { Link } from "@remix-run/react";
import { useState } from "react";

interface Audiobook {
  id: string;
  title: string;
  unit: string;
  guide: string;
  audio: string;
  author: string;
}

const audiobooks: Audiobook[] = [
  {
    id: "1",
    title: "Cuentos y pasatiempos",
    unit: "Unidad 1",
    guide: "Guía 1",
    audio: "Audio 3",
    author: "Secretos para contar",
  },
  {
    id: "2",
    title: "Entre cuento y cuento",
    unit: "Unidad 1",
    guide: "Guía 2",
    audio: "",
    author: "Secretos para contar",
  },
  {
    id: "3",
    title: "Érase una vez en Colombia",
    unit: "Unidad 1",
    guide: "Guía 5",
    audio: "Audio 3",
    author: "Secretos para contar",
  },
  {
    id: "4",
    title: "Otras historias",
    unit: "Unidad 1",
    guide: "Guía 6",
    audio: "Audio 3",
    author: "Secretos para contar",
  },
];

export default function Audiobooks() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can implement search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="bg-white min-h-screen w-full px-5 pt-24 overflow-x-hidden">
      {/* HEADER */}
      <header className="transparent text-black px-10 py-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center w-full">
          Biblioteca Audiolibro
        </h1>
      </header>
      {/* Formulario de búsqueda */}
      <form
        onSubmit={handleSearchSubmit}
        className="w-full max-w-4xl mx-auto flex flex-col items-center mb-6"
      >
        <div className="w-full mb-4">
          <label className="input input-bordered w-full flex items-center bg-transparent border border-black">
            <svg
              className="h-6 opacity-50 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </g>
            </svg>
            <input
              type="search"
              placeholder="Título, Autor o ISBN"
              className="input w-full bg-white border-none text-black"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>
        </div>
        {/* Filtros y orden */}
        <div className="flex justify-end w-full gap-4 mb-4">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-white text-black border border-black"
            >
              Filtrar
            </div>
            <ul className="dropdown-content menu bg-white text-black rounded-box z-10 w-52 p-2 shadow-sm border border-black">
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>PDF</a>
              </li>
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Audiolibro</a>
              </li>
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Video</a>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-white text-black border border-black"
            >
              Ordenar
            </div>
            <ul className="dropdown-content menu bg-white text-black rounded-box z-10 w-52 p-2 shadow-sm border border-black">
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Más reciente</a>
              </li>
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Más antiguo</a>
              </li>
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Título (A-Z)</a>
              </li>
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Título (Z-A)</a>
              </li>
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Autor (A-Z)</a>
              </li>
              <li className="hover:bg-gray-100 hover:shadow-md transition duration-200">
                <a>Autor (Z-A)</a>
              </li>
            </ul>
          </div>
        </div>
      </form>
      {/* GRID */}
      <main className="flex-1 px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-transparent text-black">
          {audiobooks.map((book) => (
            <div
              key={book.id}
              className="border rounded-lg p-4 flex flex-col justify-between shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <span role="img" aria-label="auriculares">
                  🎧
                </span>
                <h2 className="font-bold text-lg">{book.title}</h2>
              </div>
              <p className="text-sm text-black">
                {book.unit} - {book.guide}
                {book.audio ? ` - ${book.audio}` : ""}
              </p>
              <p className="text-sm font-semibold mt-1">Autor: {book.author}</p>

              <Link
                to={`/audiobooks/${book.id}`}
                className="mt-4 inline-block bg-orange-500 text-black text-center px-4 py-2 rounded hover:bg-orange-600"
              >
                Ver más
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
