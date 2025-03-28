import { useState } from "react";

export default function RecoverPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [error, setError] = useState("");

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
    if (!formData.email) {
      return "El correo electrónico es obligatorio.";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    console.log("Usuario registrado:", formData);
    setError("");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-4">
        <div className="card w-full max-w-3xl bg-white shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-[#002847] mb-8 font-[Be Vietnam Pro]">
            Recuperar contraseña
          </h2>
          <p className="text-center text-gray-600 mb-8 font-[Be Vietnam Pro]">
            Ingresa tu dirección de correo electrónico y te enviaremos un mail
            con las instrucciones para recuperar tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {" "}
              {/* Corrected div tag */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-black font-normal font-[Be Vietnam Pro] mb-0"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email" // Changed from "password" to "email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-1 border-black bg-transparent placeholder-black text-black"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn bg-[#EB704B] border-none shadow-none w-1/2 text-white font-bold font-[Be Vietnam Pro] mx-auto block"
            >
              Recuperar contraseña
            </button>

            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
