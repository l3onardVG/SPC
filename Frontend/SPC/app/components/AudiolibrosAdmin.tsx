import { useState } from "react";
import { Recurso } from "../interfaces/RecursoInterface";

export default function AudiolibrosVideos() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [nuevoRecurso, setNuevoRecurso] = useState<Recurso>({
    id: 0,
    titulo: "",
    autor: "",
    narrador: "",
    genero: "",
    anoPublicacion: "",
    idioma: "",
    formato: "",
    duracion: "",
    descripcion: "",
    disponible: true,
    archivo: null,
  });

  const agregarRecurso = () => {
    if (!nuevoRecurso.titulo || !nuevoRecurso.autor) {
      alert("Título y autor son obligatorios.");
      return;
    }
    const recursoExistente = recursos.some(
      (recurso) =>
        recurso.titulo.toLowerCase() === nuevoRecurso.titulo.toLowerCase()
    );
    if (recursoExistente) {
      alert("Este recurso ya está registrado.");
      return;
    }
    const nuevoId = recursos.length + 1;
    setRecursos([...recursos, { ...nuevoRecurso, id: nuevoId }]);
    setNuevoRecurso({
      id: 0,
      titulo: "",
      autor: "",
      narrador: "",
      genero: "",
      anoPublicacion: "",
      idioma: "",
      formato: "",
      duracion: "",
      descripcion: "",
      disponible: true,
      archivo: null,
    });
  };

  const toggleDisponibilidad = (id: number) => {
    setRecursos(
      recursos.map((recurso) =>
        recurso.id === id
          ? { ...recurso, disponible: !recurso.disponible }
          : recurso
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg">
      <h3 className="text-2xl font-bold text-[#002847] mb-4">
        Gestión de Audiolibros/Videos
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Título"
          value={nuevoRecurso.titulo}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, titulo: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Autor"
          value={nuevoRecurso.autor}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, autor: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Narrador"
          value={nuevoRecurso.narrador}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, narrador: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Género"
          value={nuevoRecurso.genero}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, genero: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Año de Publicación"
          value={nuevoRecurso.anoPublicacion}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, anoPublicacion: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Idioma"
          value={nuevoRecurso.idioma}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, idioma: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Formato"
          value={nuevoRecurso.formato}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, formato: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Duración (min)"
          value={nuevoRecurso.duracion}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, duracion: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md"
        />
        <textarea
          placeholder="Descripción"
          value={nuevoRecurso.descripcion}
          onChange={(e) =>
            setNuevoRecurso({ ...nuevoRecurso, descripcion: e.target.value })
          }
          className="border border-[#002847] text-[#002847] placeholder-[#002847] bg-white p-2 rounded-md col-span-2 h-24 resize-none"
        />
        <input
          type="file"
          accept=".mp3,.mp4"
          className="border p-2 rounded-md bg-white text-[#002847] col-span-2 border-[#002847]"
          onChange={(e) =>
            setNuevoRecurso({
              ...nuevoRecurso,
              archivo: e.target.files?.[0] || null,
            })
          }
        />
      </div>
      <button
        className="bg-[#002847] text-white px-4 py-2 rounded mb-6"
        onClick={agregarRecurso}
      >
        Agregar Recurso
      </button>

      <div>
        {recursos.map((recurso) => (
          <div
            key={recurso.id}
            className="border p-4 rounded-md mb-4 text-black"
          >
            <h4 className="text-xl font-bold">{recurso.titulo}</h4>
            <p>Autor: {recurso.autor}</p>
            <p>Narrador: {recurso.narrador}</p>
            <p>Género: {recurso.genero}</p>
            <p>{recurso.disponible ? "Disponible" : "No disponible"}</p>
            <button
              className="mt-2 bg-[#002847] text-white px-4 py-1 rounded"
              onClick={() => toggleDisponibilidad(recurso.id)}
            >
              {recurso.disponible ? "Deshabilitar" : "Habilitar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
