import { useState } from "react";
import { Libro } from "../interfaces/BooksInterface";

export default function Libros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [nuevoLibro, setNuevoLibro] = useState<Libro>({
    id: 0,
    titulo: "",
    autor: "",
    anoPublicacion: "",
    genero: "",
    idioma: "",
    isbn: "",
    formato: "",
    editorial: "",
    paginas: "",
    descripcion: "",
    disponible: true,
    archivo: null,
  });

  const agregarLibro = () => {
    if (!nuevoLibro.titulo || !nuevoLibro.autor) {
      alert("Título y autor son obligatorios.");
      return;
    }
    const libroExistente = libros.some(
      (libro) =>
        libro.titulo.toLowerCase() === nuevoLibro.titulo.toLowerCase() ||
        libro.isbn === nuevoLibro.isbn
    );
    if (libroExistente) {
      alert("Este libro ya está registrado.");
      return;
    }
    const nuevoId = libros.length + 1;
    setLibros([...libros, { ...nuevoLibro, id: nuevoId }]);
    setNuevoLibro({
      id: 0,
      titulo: "",
      autor: "",
      anoPublicacion: "",
      genero: "",
      idioma: "",
      isbn: "",
      formato: "",
      editorial: "",
      paginas: "",
      descripcion: "",
      disponible: true,
      archivo: null,
    });
  };

  const toggleDisponibilidad = (id: number) => {
    setLibros(
      libros.map((libro) =>
        libro.id === id ? { ...libro, disponible: !libro.disponible } : libro
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg">
      <h3 className="text-2xl font-bold text-[#002847] mb-4">
        Gestión de Libros
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <input
          type="text"
          placeholder="Título"
          value={nuevoLibro.titulo}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Autor"
          value={nuevoLibro.autor}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, autor: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Año de Publicación"
          value={nuevoLibro.anoPublicacion}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, anoPublicacion: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Género"
          value={nuevoLibro.genero}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, genero: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Idioma"
          value={nuevoLibro.idioma}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, idioma: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="ISBN"
          value={nuevoLibro.isbn}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, isbn: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Formato"
          value={nuevoLibro.formato}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, formato: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Editorial"
          value={nuevoLibro.editorial}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, editorial: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Número de Páginas"
          value={nuevoLibro.paginas}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, paginas: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <textarea
          placeholder="Descripción"
          value={nuevoLibro.descripcion}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, descripcion: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md col-span-2 h-24 resize-none"
        />
        <input
          type="file"
          accept=".pdf"
          className="border p-2 rounded-md bg-white text-[#002847] col-span-3 border-[#002847]"
          onChange={(e) =>
            setNuevoLibro({
              ...nuevoLibro,
              archivo: e.target.files?.[0] || null,
            })
          }
        />
      </div>
      <button
        className="bg-[#002847] text-white px-4 py-2 rounded mb-6"
        onClick={agregarLibro}
      >
        Agregar Libro
      </button>

      <div>
        {libros.map((libro) => (
          <div key={libro.id} className="border p-4 rounded-md mb-4 text-black">
            <h4 className="text-xl font-bold">{libro.titulo}</h4>
            <p>Autor: {libro.autor}</p>
            <p>{libro.disponible ? "Disponible" : "No disponible"}</p>
            <button
              className="mt-2 bg-[#002847] text-white px-4 py-1 rounded"
              onClick={() => toggleDisponibilidad(libro.id)}
            >
              {libro.disponible ? "Deshabilitar" : "Habilitar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
