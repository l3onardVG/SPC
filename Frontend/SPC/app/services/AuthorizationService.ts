import {
  AuthenticatedUser,
  LoginData,
  LoginResponse,
} from "../interfaces/AuthorizationInterface";
import { API_URL } from "../utils/config";

export const AuthService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/Authentication/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    return response.json();
  },

  async getUserData(): Promise<AuthenticatedUser> {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No hay token disponible");

    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Aquí enviamos el token en la cabecera
      },
    });

    if (!response.ok) {
      throw new Error("Error obteniendo datos del usuario");
    }

    return response.json();
  },
};
