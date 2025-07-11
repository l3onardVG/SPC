import api from '../utils/axios';
import { UserResponse, User } from '../interfaces/UserInterface';

export const UserService = {
  // Obtener todos los usuarios
  async getAllUsers(): Promise<UserResponse> {
    const response = await api.get('/user/getallusers');
    return response.data;
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/user/getuserbyid/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await api.post('/user/adduser', user);
    return response.data;
  },

  // Actualizar usuario
  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await api.put(`/user/updateuser/${id}`, user);
    return response.data;
  },

  // Eliminar usuario
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/user/deleteuser/${id}`);
  }
};
