import "../utils/chartConfig";
import { Pie, Bar, Radar, Line } from "react-chartjs-2";
import { ChartData } from "chart.js";

export default function EstadisticasAdmin() {
  const dataUsuariosActivos: ChartData<"pie", number[], string> = {
    labels: ["Activos", "Inactivos"],
    datasets: [
      {
        label: "Usuarios",
        data: [80, 20],
        backgroundColor: ["#58B0A8", "#EB704B"],
      },
    ],
  };

  const dataDescargasMes: ChartData<"bar", number[], string> = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Libros",
        data: [120, 90, 150, 130, 170, 200],
        backgroundColor: "#58B0A8",
      },
      {
        label: "Audiolibros",
        data: [80, 100, 130, 120, 160, 190],
        backgroundColor: "#EB704B",
      },
    ],
  };

  const dataComparativaFormatos: ChartData<"radar", number[], string> = {
    labels: ["Libros", "Audiolibros", "Videos"],
    datasets: [
      {
        label: "Disponibles",
        data: [120, 90, 70],
        backgroundColor: "rgba(88, 176, 168, 0.4)",
        borderColor: "#58B0A8",
        borderWidth: 2,
        pointBackgroundColor: "#58B0A8",
      },
    ],
  };

  const dataActividad: ChartData<"line", number[], string> = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Sesiones",
        data: [50, 60, 40, 70, 90, 80, 100],
        borderColor: "#58B0A8",
        backgroundColor: "rgba(88, 176, 168, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-[#002847] mb-6">
        Estadísticas de la biblioteca digital
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-[#002847]">
            Usuarios activos vs inactivos
          </h2>
          <Pie data={dataUsuariosActivos} />
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-[#002847]">
            Descargas por mes
          </h2>
          <Bar data={dataDescargasMes} />
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-[#002847]">
            Comparativa de formatos
          </h2>
          <Radar data={dataComparativaFormatos} />
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-[#002847]">
            Actividad semanal
          </h2>
          <Line data={dataActividad} />
        </div>
      </div>
    </div>
  );
}
