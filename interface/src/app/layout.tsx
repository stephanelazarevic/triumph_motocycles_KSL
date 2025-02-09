import type { Metadata } from "next";
import "../app/globals.css";
import Navbar from "../components/navbar"; // Importation du composant

export const metadata: Metadata = {
  title: "Triumph KSL",
  description: "Gestion de motos et incidents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main className="max-w-9xl mx-auto p-6 bg-white shadow-lg rounded-lg">{children}</main>
      </body>
    </html>
  );
}
