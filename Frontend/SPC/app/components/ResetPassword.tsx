import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });


  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/usuarios/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: formData.password }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al restablecer la contraseña");
      }

      console.log("Contraseña restablecida con éxito");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        setError(error.message);
      } else {
        console.error("Error desconocido");
        setError("Error desconocido al restablecer la contraseña");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-4">
      <div className="card w-full max-w-3xl bg-white shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#002847] mb-8 font-[Be Vietnam Pro]">
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
    </div>
  );
}
