import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#112434] text-[#D5DBE1] py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Triumph KSL</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-[#5A8EA4] transition">Accueil</Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-[#5A8EA4] transition">Connexion</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
