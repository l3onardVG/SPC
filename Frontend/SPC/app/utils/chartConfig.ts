import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  Title,
} from "chart.js";

// Registrar todos los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  Title
);

// Configuración global de Chart.js
ChartJS.defaults.font.family = "'Inter', 'system-ui', 'sans-serif'";
ChartJS.defaults.color = '#6B7280';
