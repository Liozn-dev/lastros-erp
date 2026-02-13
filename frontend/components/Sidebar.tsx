'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const path = usePathname();

  const items = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/pos', label: 'Frente de Caixa', icon: '🛒' },
    { href: '/stock', label: 'Estoque', icon: '📦' },
    { href: '/kitchen', label: 'Cozinha', icon: '👨‍🍳' },
    { href: '/sales', label: 'Vendas', icon: '📊' },
    { href: '/finance', label: 'Financeiro', icon: '💰' },
    { href: '/integrations', label: 'Integrações', icon: '🔗' },
  ];

  return (
    <aside className="w-56 fixed left-0 top-16 bottom-0 bg-white border-r border-slate-100 shadow-sm overflow-auto">
      <div className="p-4">
        <div className="mb-6 px-2 text-xs text-slate-400">Menu</div>
        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const active = path === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
              >
                <span className="w-6 text-center">{it.icon}</span>
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
