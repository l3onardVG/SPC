import { useState } from "react";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setModalVisible(true);

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-4">
      <div className="card w-full max-w-3xl bg-white shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-8 font-[Be Vietnam Pro]">
          Restablecer contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-black font-normal font-[Be Vietnam Pro] mb-0"
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full mt-1 border-black bg-transparent placeholder-black text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="text-black font-normal font-[Be Vietnam Pro] mb-0"
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full mt-1 border-black bg-transparent placeholder-black text-black"
              required
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="btn bg-[#EB704B] border-none shadow-none w-1/2 text-white font-bold font-[Be Vietnam Pro] mx-auto block"
          >
            Restablecer
          </button>
        </form>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-xl font-bold text-[#002847] mb-4">
              Contraseña restablecida con éxito
            </h3>
            <button
              onClick={closeModal}
              className="btn bg-[#EB704B] border-none shadow-none w-full text-white font-bold font-[Be Vietnam Pro]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
