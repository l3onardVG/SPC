import type { MetaFunction } from "@remix-run/node";

import Hero from "../components/hero";

import DonateButton from "../components/DonateButton";

export const meta: MetaFunction = () => {
  return [
    { title: "Secretos para contar" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <Hero />
      <DonateButton />
    </>
  );
}
