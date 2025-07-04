import { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/AuthService";
import { AuthResponse, LoginRequest } from "../types/auth";
import { useNavigate } from "@remix-run/react";

// Interfaz para el usuario en el contexto
interface User {
  userId: string;
  userName: string;
  userEmail: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Inicializar el estado de autenticación
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authenticated = AuthService.isAuthenticated();
        const currentUser = AuthService.getCurrentUser();

        setIsAuthenticated(authenticated);
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Limpiar datos corruptos
        AuthService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const credentials: LoginRequest = { email, password };
      const authResponse: AuthResponse = await AuthService.login(credentials);
      
      // Crear objeto usuario para el contexto
      const userData: User = {
        userId: authResponse.userId,
        userName: authResponse.userName,
        userEmail: authResponse.userEmail,
        roles: authResponse.roles,
      };

      setUser(userData);
      setIsAuthenticated(true);
      
      // Navegar a la página principal
      navigate("/");
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Intentar revocar el token en el servidor
      await AuthService.logout();
      
      // Limpiar estado local
      setUser(null);
      setIsAuthenticated(false);
      
      // Navegar a login
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Aún así limpiar el estado local
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    return AuthService.hasRole(role);
  };

  const isAdmin = (): boolean => {
    return AuthService.isAdmin();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}; 