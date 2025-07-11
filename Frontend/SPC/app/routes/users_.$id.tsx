import { useParams } from "@remix-run/react";
import { useUser } from "../hooks/useApi";
import { User } from "../interfaces/UserInterfaces";
import PageWrapper from "../components/PageWrapper";

export default function UserDetailPage() {
  const { id } = useParams();
  const userId = id ?? null;
  const { data, error, isLoading } = useUser(userId);
  // Función para obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name && user.surname) {
      return (user.name[0] + user.surname[0]).toUpperCase();
    } else if (user.name) {
      return user.name[0].toUpperCase();
    } else if (user.userName) {
      const nameParts = user.userName.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else if (nameParts.length === 1) {
        return nameParts[0][0].toUpperCase();
      }
    }
    return "U";
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !data || !data.responseElements || data.responseElements.length === 0) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium">Usuario no encontrado</h3>
            <p className="text-red-600 mt-1">{error?.message || "No existe el usuario solicitado."}</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const user = data.responseElements[0] as User;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-700 tracking-wide uppercase mb-4">
              Detalles del Usuario
            </h1>
            {/* Avatar y nombre */}
      <div className="px-4 py-3 flex items-center space-x-3">
        <div className="avatar avatar-placeholder">
          <div className="w-12 h-12 bg-orange-600 text-neutral-content rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold flex items-center justify-center">{getUserInitials()}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {user?.name && user?.surname 
              ? `${user.name} ${user.surname}`
              : user?.userName || 'Usuario'
            }
          </p>
          <p className="text-sm text-gray-500">
            {user?.roles?.join(', ') || 'Usuario'}
          </p>
        </div>
      </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow transition flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-600">Nombre: {user.name} {user.surname}</p>
                <p className="text-gray-600">Correo electrónico: {user.email}</p>
                <p className="text-gray-600">Tipo de documento: {user.documentType}</p>
                <p className="text-gray-600">Número de documento: {user.documentNumber}</p>
                <p className="text-gray-600">{user.userType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
