import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { SWRConfig } from "swr";
import api from "./utils/axios";
import { AuthProvider } from "./context/AuthContext";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./tailwind.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
  },
  { rel: "stylesheet", href: "./tailwind.css" },
  { rel: "icon", type: "image/png", href: "/LogoSPC.png" },
];

// Custom fetcher function using our configured Axios instance
const fetcher = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    // If it's an authentication error, let the axios interceptor handle it
    if (error.response?.status === 401) {
      throw error;
    }
    
    // For other errors, throw a more descriptive error
    throw new Error(error.response?.data?.message || 'An error occurred while fetching data');
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="pt-13">
        <AuthProvider>
          <SWRConfig
            value={{
              fetcher,
              revalidateOnFocus: false,
              revalidateOnReconnect: true,
              dedupingInterval: 2000,
              errorRetryCount: 3,
              errorRetryInterval: 5000,
              onError: (error) => {
                console.error('SWR Error:', error);
              },
              onSuccess: (data, key) => {
                console.log('SWR Success:', key, data);
              },
            }}
          >
            <Navbar />
            {children}
            <Footer />
                      </SWRConfig>
          </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
