import { API_URL } from "../utils/config";
import axios from "axios";

export interface Book {
  id: number;
  authorId: number;
  name: string;
  isbn13: string;
  editorial: string;
  yearOfPubliction: number;
  format: number;
  genrre: number;
  language: string;
  cover: string;
  edition: string;
  summary: string;
  deleted: boolean;
  long: number;
  averageRating: number;
  filePath: string;
  author?: {
    id: number;
    name: string;
    surname: string;
  };
}

export const BookService = {
  async getAllBooks(): Promise<Book[]> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    try {
      const response = await axios.get(`${API_URL}/book/getallbooks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.responseElements;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener los libros");
      }
      throw new Error("Error al obtener los libros");
    }
  },
}; 