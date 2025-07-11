export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  documentType: number;
  documentNumber: string;
  termsAceptance: boolean;
  userType:
    | "Estudiante"
    | "Docente"
    | "Administrador/Fundación"
    | "Otro/Externo";
  phoneNumber: null;
}

export interface AuthenticatedUser extends User {
  nombre: string;
}

export interface UserResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: User[];
}