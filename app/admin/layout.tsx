"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/publish", label: "Publicar" }
];

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-surface text-text-primary">
      <aside className="w-64 border-r border-border bg-card px-4 py-6">
        <div className="mb-6 text-lg font-bold">Admin</div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
