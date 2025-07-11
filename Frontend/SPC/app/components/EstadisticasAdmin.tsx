export default function EstadisticasAdmin() {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-[#002847] mb-6">
        Estadísticas de la biblioteca digital
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 tracking-wide uppercase">
            Usuarios activos vs inactivos
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#58B0A8]">80%</div>
              <div className="text-sm text-gray-600">Usuarios Activos</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 tracking-wide uppercase">
            Descargas por mes
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#58B0A8]">1,260</div>
              <div className="text-sm text-gray-600">Total Descargas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 tracking-wide uppercase">
            Comparativa de formatos
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#58B0A8]">280</div>
              <div className="text-sm text-gray-600">Recursos Disponibles</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 tracking-wide uppercase">
            Actividad semanal
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#58B0A8]">490</div>
              <div className="text-sm text-gray-600">Sesiones Esta Semana</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
