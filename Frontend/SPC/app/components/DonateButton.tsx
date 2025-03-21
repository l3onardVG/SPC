import { Link } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const DonateButton = () => {
  return (
    <Link
      to="/donation"
      className="fixed bottom-32 right-6 bg-[#002847] text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold font-[Be Vietnam Pro] flex items-center gap-2 transition-transform transform hover:scale-105"
    >
      Dona ahora
      <FontAwesomeIcon icon={faHeart} className="text-[#fa1807]" />
    </Link>
  );
};

export default DonateButton;
