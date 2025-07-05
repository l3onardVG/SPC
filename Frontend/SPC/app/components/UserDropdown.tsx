import { useState, useRef, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useAuth } from "../context/AuthContext";

interface UserDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function UserDropdown({ isOpen, onToggle }: UserDropdownProps) {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      {/* Header con correo */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-600 font-medium">{user?.userEmail}</p>
      </div>

      {/* Avatar y nombre */}
      <div className="px-4 py-3 flex items-center space-x-3">
        <div className="avatar">
          <div className="w-12 h-12 bg-neutral text-neutral-content rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold flex items-center justify-center">{getUserInitials()}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {user?.name && user?.surname 
              ? `${user.name} ${user.surname}`
              : user?.userName || 'Usuario'
            }
          </p>
          <p className="text-sm text-gray-500">
            {user?.roles?.join(', ') || 'Usuario'}
          </p>
        </div>
      </div>

      {/* Opciones del menú */}
      <div className="py-2">
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={onToggle}
        >
          <i className="fas fa-user-circle mr-3 text-gray-400"></i>
          Detalles de mi cuenta
        </Link>

        {hasRole('Admin') && (
          <Link
            to="/admin"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={onToggle}
          >
            <i className="fas fa-cog mr-3 text-gray-400"></i>
            Panel de administración
          </Link>
        )}

        <button
          onClick={() => {
            logout();
            onToggle();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-3 text-red-400"></i>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
} 