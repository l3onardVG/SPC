import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState("");

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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-4">
        <div className="card w-full max-w-3xl bg-white shadow-lg p-8">
          <div className="w-full lg:w-2/3 flex flex-col justify-center p-8" />
          <h2 className="text-3xl font-bold text-center text-[#002847] mb-8 font-[Be Vietnam Pro]">
            Restablecer contraseña
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
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
            </div>
            <button
              type="submit"
              className="btn bg-[#EB704B] border-none shadow-none w-1/2 text-white font-bold font-[Be Vietnam Pro] mx-auto flex justify-center"
            >
              Restablecer contraseña
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
