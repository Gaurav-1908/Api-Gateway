"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
//   { href: "/", label: "Home" },       // ✅ New Landing Page
  { href: "/config", label: "Configure Services" },
  { href: "/logs", label: "Log Viewer" },  // ✅ moved here
  { href: "/settings", label: "Settings" },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-slate-700">
        <Link href={"/"}>
            Gateway Dashboard
        </Link>
       
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block w-full text-left px-3 py-2 rounded hover:bg-slate-700 ${
              pathname === item.href ? "bg-slate-700" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 mt-auto space-y-2">
        <Link
          href="/profile"
          className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700"
        >
          👤 Account
        </Link>
        <button
          onClick={() => alert("Logging out...")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700 text-red-400"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
