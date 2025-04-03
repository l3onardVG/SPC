export interface User {
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

export interface AuthenticatedUser extends User {
  nombre: string;
}
