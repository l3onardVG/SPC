export default function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[#CFD5C8]"></div>

      <div
        className="hero min-h-[85vh] bg-cover bg-center bg-[#CFD5C8] relative"
        style={{
          backgroundImage: "url('public/inicio.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 80%",
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 90%, 90% 95%, 80% 88%, 70% 92%, 60% 85%, 50% 95%, 40% 87%, 30% 93%, 20% 85%, 10% 92%, 0% 88%)",
        }}
      >
        <div className="hero-overlay bg-black/60"></div>
        <div className="hero-content text-white text-center relative z-10 flex flex-col justify-center h-full mt-24">
          <div className="max-w-lg">
            <h1 className="mb-5 h-7 text-3xl  text-white rounded-md font-[Be Vietnam Pro] font-bold">
              Lectura y educación para el campo
            </h1>
            <p className="mb-5 h-24 text-white text-l rounded-md font-[Literata] font-normal">
              Llegamos hasta los pliegues más apartados de las montañas y los
              recodos escondidos de los ríos, para compartir sonrisas, alegrías
              y nuevas experiencias con las familias del campo.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-32 h-32">
        <button className="btn btn-primary bg-[#FA4616] px-6 py-2 text-white font-bold rounded-md border-none outline-none hover:bg-[#d63c10]">
          Biblioteca digital
        </button>
        <button className="btn btn-secondary bg-[#FA4616] px-6 py-2 text-white font-bold rounded-md border-none outline-none hover:bg-[#d63c10]">
          Material recomendado
        </button>
      </div>
    </div>
  );
}
