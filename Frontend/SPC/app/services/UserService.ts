import axios from "axios";

const API_URL = "http://localhost:5000/api/User";

export const getUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const getHistorial = async () => {
  try {
    const response = await axios.get(`${API_URL}/historial`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial:", error);
    throw error;
  }
};

export const updateUser = async (id: number, newType: string) => {
  try {
    await axios.put(`${API_URL}/update/${id}`, { tipoUsuario: newType });
  } catch (error) {
    console.error("Error al modificar usuario:", error);
    throw error;
  }
};

export const toggleEnabled = async (id: number, enabled: boolean) => {
  try {
    await axios.put(`${API_URL}/toggle/${id}`, { habilitado: enabled });
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    throw error;
  }
};
