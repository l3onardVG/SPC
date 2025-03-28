import { useState } from "react";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-4">
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md flex flex-col items-center">
            <div className="input-group w-full mb-4">
              <label className="input input-bordered w-full flex items-center bg-transparent border-narrow border-black">
                <svg
                  className="h-6 opacity-50 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input
                  type="search"
                  placeholder="Titulo, Autor o ISBN"
                  className="input w-full bg-white border-narrow border-black"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </label>
            </div>

            {/* Button Section */}
            <div className="flex space-x-1 w-auto mb-1">
              <button
                type="button" 
                className="btn bg-[WHITE] border-narrow border-black w-auto text-black font-bold flex items-center"
              >
                Libro digital
              </button>
              <button
                type="button" 
                className="btn bg-[WHITE] border-narrow border-black w-auto text-black font-bold flex items-center"
              >
                Audiolibro
              </button>
              <button
                type="button" 
                className="btn bg-[WHITE] border-narrow border-black w-auto text-black font-bold flex items-center"
              >
                Videolibro
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-wrap justify-center gap-2 bg-white ">
        <div className="card bg-white w-96 text-black font-bold border border-black">
          <figure className="px-10 pt-10">
            <img
              src="/portadas/cuentosypasatiempos.png"
              alt="BookCover"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center text-black">
            <h2 className="card-title">Entre cuento y cuento</h2>
            <p>Autor: Secretos para contar</p>
            <div className="card-actions">
              <button className="btn btn-secondary bg-[#FA4616] px-6 py-2 text-white font-bold rounded-md border-none outline-none hover:bg-[#d63c10]">
                Ver mas
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-white border-narrow border-black w-96 text-black font-bold border border-black">
          <figure className="px-10 pt-10">
            <img
              src="/portadas/entrecuentoycuento.png"
              alt="BookCover"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center text-black">
            <h2 className="card-title">Entre cuento y cuento</h2>
            <p>Autor: Secretos para contar</p>
            <div className="card-actions">
              <button className="btn btn-secondary bg-[#FA4616] px-6 py-2 text-white font-bold rounded-md border-none outline-none hover:bg-[#d63c10]">
                Ver mas
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-white border-narrow border-black w-96 text-black font-bold font-bold border border-black">
          <figure className="px-10 pt-10">
            <img
              src="/portadas/eraseunavezenColombia.png"
              alt="BookCover"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center text-black">
            <h2 className="card-title">Entre cuento y cuento</h2>
            <p>Autor: Secretos para contar</p>
            <div className="card-actions">
              <button className="btn btn-secondary bg-[#FA4616] px-6 py-2 text-white font-bold rounded-md border-none outline-none hover:bg-[#d63c10]">
                Ver mas
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}



