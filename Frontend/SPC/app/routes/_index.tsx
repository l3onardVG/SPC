import type { MetaFunction } from "@remix-run/node";

import Hero from "../components/hero";

import DonateButton from "../components/DonateButton";
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
      <Hero />
      <DonateButton />
    </>
  );
}
