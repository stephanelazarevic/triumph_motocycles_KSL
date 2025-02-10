"use client";

import { useState } from "react";
import Link from "next/link";
import { Warehouse, Construction, RotateCcw, ChevronLeft, ChevronRight, Bell  } from "lucide-react";

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? "w-24" : "w-64"
      } bg-[#112434] text-white min-h-screen p-4 transition-all duration-300 relative`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-4 bg-[#112434] border border-gray-600 rounded-full p-1 hover:bg-gray-700 transition"
      >
        {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>

      <Link href="/" passHref>
        <h2 className="text-xl font-bold mb-4 text-center cursor-pointer hover:text-gray-400">
          {isCollapsed ? "KSL" : "KSL Admin Panel"}
        </h2>
      </Link>

      <ul className="space-y-3 mt-8">
        <li>
          <Link
            href="/admin/essai"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <RotateCcw className="w-4 h-4" />
            {!isCollapsed && <span>Gestion des essais</span>}
          </Link>
          <Link
            href="/admin/stock"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <Warehouse className="w-4 h-4" />
            {!isCollapsed && <span>Gestion des stock</span>}
          </Link>
          <Link
            href="/admin/entretien"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <Construction className="w-4 h-4" />
            {!isCollapsed && <span>Gestion des entretiens</span>}
          </Link>
          <Link
            href="/admin/notification"
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"
          >
            <Bell  className="w-4 h-4" />
            {!isCollapsed && <span>Gestion des notifications</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
}
