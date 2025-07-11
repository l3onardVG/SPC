export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  documentType: string;
  documentNumber: string;
  termsAceptance: boolean;
  userType: string;
  phoneNumber: string | null;
  password?: string;
}

export interface UserResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: User[];
}

// Interfaz para compatibilidad con el código existente
export interface AuthenticatedUser {
  id: string;
  nombre: string;
  correo: string;
  documento: number;
  tipoUsuario: string;
  habilitado: boolean;
}
