import axios from "axios";

export const registerUser = async (userData) => {
  try {
    console.log("Datos a enviar:", userData);
    const response = await axios.post(
      "http://localhost:5197/api/user/adduser",
      userData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};
