import type { MetaFunction } from "@remix-run/node";
import NotFound from "../components/NotFound";

export const meta: MetaFunction = () => {
  return [
    { title: "404 - Página no encontrada | Secretos para Contar" },
    { name: "description", content: "La página que buscas no existe. Volver al inicio de Secretos para Contar." },
  ];
};

export default function NotFoundPage() {
  return <NotFound />;
} 