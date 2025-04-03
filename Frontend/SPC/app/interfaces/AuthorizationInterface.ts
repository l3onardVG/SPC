export interface AuthenticatedUser {
  id: number;
  correo: string;
  documento: number;
  tipoUsuario:
    | "Estudiante"
    | "Docente"
    | "Administrador/Fundación"
    | "Otro/Externo";
  habilitado: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
