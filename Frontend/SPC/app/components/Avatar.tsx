import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "./UserDropdown";

export default function Avatar() {
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, isLoading, user }: { isAuthenticated: boolean; isLoading: boolean; user: any } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Función para obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name && user.surname) {
      return (user.name[0] + user.surname[0]).toUpperCase();
    } else if (user.name) {
      return user.name[0].toUpperCase();
    } else if (user.userName) {
      const nameParts = user.userName.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else if (nameParts.length === 1) {
        return nameParts[0][0].toUpperCase();
      }
    }
    return "U";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // No renderizar hasta que esté montado para evitar diferencias de hidratación
  if (!mounted || isLoading) {
    return null;
  }

  // Solo mostrar el placeholder si el usuario está autenticado
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="avatar avatar-placeholder cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="bg-orange-600 text-neutral-content w-12 rounded-full">
          <span>{getUserInitials()}</span>
        </div>
      </button>
      
      <UserDropdown 
        isOpen={isDropdownOpen} 
        onToggle={toggleDropdown} 
      />
    </div>
  );
}
