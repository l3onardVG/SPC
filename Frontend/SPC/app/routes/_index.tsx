import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import Hero from "~/components/hero";
import Footer from "~/components/footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Secretos para contar" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}
