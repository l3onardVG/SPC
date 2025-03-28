import { useState } from "react";
import { Autor } from "../interfaces/AuthorInterface";

export default function Autores() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [nuevoAutor, setNuevoAutor] = useState<Autor>({
    id: 0,
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    pais: "",
    idiomas: "",
    generos: "",
    galardones: "",
    pseudonimo: "",
    estaVivo: true,
    fechaMuerte: "",
    nacionalidad: "",
    activo: true,
  });

  const agregarAutor = () => {
    if (!nuevoAutor.nombre || !nuevoAutor.apellido) {
      alert("Nombre y apellido son obligatorios.");
      return;
    }
    const autorExistente = autores.some(
      (autor) =>
        autor.nombre.toLowerCase() === nuevoAutor.nombre.toLowerCase() &&
        autor.apellido.toLowerCase() === nuevoAutor.apellido.toLowerCase()
    );
    if (autorExistente) {
      alert("Este autor ya está registrado.");
      return;
    }
    const nuevoId = autores.length + 1;
    setAutores([...autores, { ...nuevoAutor, id: nuevoId }]);
    setNuevoAutor({
      id: 0,
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      pais: "",
      idiomas: "",
      generos: "",
      galardones: "",
      pseudonimo: "",
      estaVivo: true,
      fechaMuerte: "",
      nacionalidad: "",
      activo: true,
    });
  };

  // Función para habilitar/deshabilitar autores
  const toggleAutor = (id: number) => {
    setAutores(
      autores.map((autor) =>
        autor.id === id ? { ...autor, activo: !autor.activo } : autor
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg">
      <h3 className="text-2xl font-bold text-[#002847] mb-4">
        Gestión de Autores
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoAutor.nombre}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, nombre: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={nuevoAutor.apellido}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, apellido: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="date"
          placeholder="Fecha de Nacimiento"
          value={nuevoAutor.fechaNacimiento}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, fechaNacimiento: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
          style={{ colorScheme: "light" }}
        />
        <input
          type="text"
          placeholder="País"
          value={nuevoAutor.pais}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, pais: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Idiomas"
          value={nuevoAutor.idiomas}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, idiomas: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Géneros"
          value={nuevoAutor.generos}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, generos: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Galardones"
          value={nuevoAutor.galardones}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, galardones: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Pseudónimo (opcional)"
          value={nuevoAutor.pseudonimo}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, pseudonimo: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <select
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
          value={nuevoAutor.estaVivo ? "vivo" : "fallecido"}
          onChange={(e) =>
            setNuevoAutor({
              ...nuevoAutor,
              estaVivo: e.target.value === "vivo",
            })
          }
        >
          <option value="vivo">Vivo</option>
          <option value="fallecido">Fallecido</option>
        </select>
        {!nuevoAutor.estaVivo && (
          <input
            type="date"
            placeholder="Fecha de Muerte"
            value={nuevoAutor.fechaMuerte}
            onChange={(e) =>
              setNuevoAutor({ ...nuevoAutor, fechaMuerte: e.target.value })
            }
            className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
            style={{ colorScheme: "light" }}
          />
        )}
        <input
          type="text"
          placeholder="Nacionalidad"
          value={nuevoAutor.nacionalidad}
          onChange={(e) =>
            setNuevoAutor({ ...nuevoAutor, nacionalidad: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
      </div>
      <button
        className="bg-[#002847] text-white px-4 py-2 rounded mb-6"
        onClick={agregarAutor}
      >
        Agregar Autor
      </button>

      <div>
        {autores.map((autor) => (
          <div
            key={autor.id}
            className={`border p-4 rounded-md mb-4 ${
              autor.activo ? "text-black" : "text-gray-500 opacity-50"
            }`}
          >
            <h4 className="text-xl font-bold">
              {autor.nombre} {autor.apellido}
            </h4>
            <p>Fecha de nacimiento: {autor.fechaNacimiento}</p>
            <p>País: {autor.pais}</p>
            <p>Idiomas: {autor.idiomas}</p>
            <p>Géneros: {autor.generos}</p>
            <p>Galardones: {autor.galardones}</p>
            {autor.pseudonimo && <p>Pseudónimo: {autor.pseudonimo}</p>}
            <p>
              {autor.estaVivo ? "Vivo" : `Fallecido (📅 ${autor.fechaMuerte})`}
            </p>
            <p>Nacionalidad: {autor.nacionalidad}</p>
            <button
              className="mt-2 bg-[#002847] text-white px-4 py-1 rounded"
              onClick={() => toggleAutor(autor.id)}
            >
              {autor.activo ? "Deshabilitar" : "Habilitar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
