import { useState } from "react";
import api from "../utils/axios";

interface RegisterData {
  Name: string;
  Surname: string;
  documentType: string;
  documentNumber: string;
  userType: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterData>({
    Name: "",
    Surname: "",
    documentType: "",
    documentNumber: "",
    userType: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      return "El correo electrónico no es válido.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    if (!formData.termsAccepted) {
      return "Debes aceptar el tratamiento de datos personales.";
    }
    return "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      console.log("Datos a enviar:", formData);
      const response = await api.post("/user/adduser", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setTimeout(() => {
        setShowModal(true); // Mostrar modal de éxito
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al registrar usuario";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-4">
      <div className="card w-full max-w-3xl bg-white shadow-lg p-8">
        <div className="w-full lg:w-2/3 flex flex-col justify-center p-8" />
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-8 font-[Be Vietnam Pro] tracking-wide uppercase">
          Crea tu cuenta
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="Name" className="text-black mb-0">
                Nombres
              </label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 border-black bg-transparent text-black"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="Surname" className="text-black mb-0">
                Apellidos
              </label>
              <input
                type="text"
                name="Surname"
                value={formData.Surname}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 border-black bg-transparent text-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="documentType" className="text-black mb-0">
                Tipo de documento
              </label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="select select-bordered w-full mt-1 border-black bg-transparent text-black"
                required
              >
                <option value="">Selecciona alguno</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="RC">Registro Civil</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="PPT">PPT</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="documentNumber" className="text-black mb-0">
                Número de documento
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 border-black bg-transparent text-black"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="userType" className="text-black mb-0">
                Tipo de usuario
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="select select-bordered w-full mt-1 border-black bg-transparent text-black"
                required
              >
                <option value="">Selecciona alguno</option>
                <option value="docente">Docente</option>
                <option value="estudiante">Estudiante</option>
                <option value="administrador/fundacion">
                  Administrador/Fundación
                </option>
                <option value="otro/externo">Otro/Externo</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-black mb-0">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 border-black bg-transparent text-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="password" className="text-black mb-0">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 border-black bg-transparent text-black"
                required
                minLength={6}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$"
                title="La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, una letra minúscula y un carácter no alfanumérico."
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-black mb-0">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full mt-1 border-black bg-transparent text-black"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="cursor-pointer flex items-center">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="checkbox-xl border-2 border-black rounded-sm mr-2 bg-white"
              />
              <span className="ml-2 text-black">
                Acepto el tratamiento de datos personales
              </span>
            </label>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-center text-[#002847]">
                  ¡Registro exitoso!
                </h3>
                <p className="text-sm text-[#002847] hover:underline text-center mt-4">
                  Tu cuenta ha sido creada correctamente. Redirigiendo a la
                  página de inicio de sesión...
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="btn bg-[#EB704B] w-2/5 text-white font-bold shadow-none border-none"
            >
              Registrarse
            </button>
          </div>

          <p className="text-sm text-[#002847] hover:underline text-center">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/login"
              className="text-sm text-[#002847] hover:underline text-center underline"
            >
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
