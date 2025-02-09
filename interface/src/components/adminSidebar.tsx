import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul className="space-y-3">
        <li>
          <Link href="/admin/users" className="block hover:bg-gray-700 p-2 rounded">Utilisateurs</Link>
        </li>
      </ul>
    </aside>
  );
}
