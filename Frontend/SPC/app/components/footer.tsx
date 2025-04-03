import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="bg-[#618EB4] text-white p-6 flex justify-between items-center relative">
      <div className="flex flex-col items-center">
        <img
          src="logospc-bn.png"
          alt="Logo blanco/negro"
          className="h-20 w-auto"
        />
        <p className="mt-2 text-sm font-[Be Vietnam Pro] font-normal">
          {new Date().getFullYear()} © Todos los derechos reservados
        </p>
      </div>

      <div className="flex flex-col text-center">
        <h6 className="text-lg font-bold mb-2 font-[Be Vietnam Pro]">
          Contáctenos
        </h6>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="text-right">
            <Link
              to="#"
              className="font-semibold underline font-[BeVietnam Pro]"
            >
              Trabaja con nosotros
            </Link>
            <br />
            <a
              href="mailto:info@secretosparacontar.org"
              className="underline font-semibold font-[BeVietnam Pro]"
            >
              info@secretosparacontar.org
            </a>

            <p className="font-semibold underline font-[BeVietnam Pro]">
              (57) 604 322 06 90
            </p>
          </div>

          <div className="text-left">
            <p>
              <span className="font-semibold font-[BeVietnam Pro]">
                Calle 11A #43B-41
              </span>
            </p>
            <p>
              {" "}
              <span className="font-semibold font-[BeVietnam Pro]">
                Barrio Manila{" "}
              </span>
            </p>
            <p>
              <span className="font-semibold font-[BeVietnam Pro]">
                Medellín, Colombia
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 text-lg gap-2">
        <Link to="#" className="hover:text-gray-300">
          <i className="fab fa-facebook"></i>
        </Link>
        <Link to="#" className="hover:text-gray-300">
          <i className="fab fa-x"></i>
        </Link>
        <Link to="#" className="hover:text-gray-300">
          <i className="fab fa-instagram"></i>
        </Link>
        <Link to="#" className="hover:text-gray-300">
          <i className="fab fa-linkedin"></i>
        </Link>
        <Link to="#" className="hover:text-gray-300">
          <i className="fab fa-youtube"></i>
        </Link>
      </div>
    </footer>
  );
}
