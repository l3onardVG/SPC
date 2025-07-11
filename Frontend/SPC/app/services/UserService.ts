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
  async createUser(user: Omit<User, 'id'> & { password: string }): Promise<{ success: boolean; message: string; data?: any }> {
    const payload = {
      name: user.name,
      surname: user.surname,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      userType: user.userType,
      termsAceptance: user.termsAceptance,
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber
    };
    
    try {
      const response = await api.post('/user/adduser', payload);
      return {
        success: true,
        message: response.data.message || 'Usuario creado exitosamente',
        data: response.data
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      return {
        success: false,
        message: 'Error al crear usuario. Intente nuevamente.'
      };
    }
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
