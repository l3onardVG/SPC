// Interfaz para el historial de acciones de usuarios
export interface History {
  id: number;
  usuarioCorreo: string;
  accion: string;
  fecha: string;
} 