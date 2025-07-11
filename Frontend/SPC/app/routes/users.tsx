import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import useSWR from 'swr';
import { UserResponse } from '~/interfaces/UserInterface';
import { useNavigate } from "@remix-run/react";

export default function UserPage() {
  const { data, error, isLoading, mutate } = useSWR<UserResponse>('/user/getallusers');
  const navigate = useNavigate();

  const handleAddUser = () => {
    console.log('Agregar nuevo usuario');
  };

  const handleEditUser = (user) => {
    console.log('Editar usuario', user);
  };

  const handleDeleteUser = (userId) => {
    console.log('Eliminar usuario con ID', userId);
  };

  const handleDetailUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error cargando usuarios</h3>
          <p className="text-red-600 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.responseElements) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-500 text-center">No se encontraron usuarios.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-700 tracking-wide uppercase text-center mb-2">
        Usuarios
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Agregar nuevo usuario
        </button>
      </div>
      <div className="space-y-4">
        {data.responseElements.map(user => (
          <div
            key={user.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow transition flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">{user.name} {user.surname}</h3>
              <p className="text-gray-600">Correo electrónico: {user.email}</p>
              <p className="text-gray-600">{user.userType}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDetailUser(user)}
                className="bg-white text-gray-700 p-2 rounded shadow hover:shadow-md transition"
                title="Ver detalles"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleEditUser(user)}
                className="bg-white text-gray-700 p-2 rounded shadow hover:shadow-md transition"
                title="Editar"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-white text-gray-700 p-2 rounded shadow hover:shadow-md transition"
                title="Eliminar"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
