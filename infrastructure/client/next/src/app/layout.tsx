import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar.tsx";

export const metadata: Metadata = {
  title: "Triumph KSL",
  description: "Gestion de motos et incidents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
