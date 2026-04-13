"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanText,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "OCR", href: "/ocr", icon: ScanText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0F1225] border-r border-white/10 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#A965FF] flex items-center justify-center">
            <span className="text-white font-bold text-sm">AX</span>
          </div>
          <span className="text-white text-lg font-bold tracking-tight">
            Auto<span className="text-[#A965FF]">X</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#A965FF] text-white shadow-md shadow-[#A965FF]/25"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#A965FF] to-[#F79ACC] flex items-center justify-center">
            <span className="text-white text-xs font-semibold">N</span>
          </div>
          <div>
            <p className="text-sm text-white font-medium">Admin</p>
            <p className="text-xs text-gray-400">n8n connected</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
    </aside>
  );
}
