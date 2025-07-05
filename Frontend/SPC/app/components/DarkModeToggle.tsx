import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", (!prev).toString());
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  // No renderizar hasta que esté montado para evitar diferencias de hidratación
  if (!mounted) {
    return (
      <button className="p-2 rounded-full bg-gray-200 transition-all">
        <FontAwesomeIcon
          icon={faSun}
          className="text-white"
          size="lg"
        />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 transition-all"
    >
      <FontAwesomeIcon
        icon={darkMode ? faMoon : faSun}
        className={darkMode ? "text-white" : "text-white"}
        size="lg"
      />
    </button>
  );
}
