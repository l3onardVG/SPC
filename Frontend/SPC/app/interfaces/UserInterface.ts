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
