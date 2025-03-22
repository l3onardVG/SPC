import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import Hero from "~/components/hero";
import Footer from "~/components/footer";
import DonateButton from "~/components/DonateButton";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Secretos para contar" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  useEffect(() => {
    localStorage.setItem("username", "Angie@angie");
    localStorage.setItem("password", "12345");
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
      <DonateButton />
    </>
  );
}
