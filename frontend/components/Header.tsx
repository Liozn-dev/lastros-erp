'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  // Verifique se no seu Context o nome é 'logout' ou 'signOut' e ajuste aqui se precisar
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (logout) logout();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-6 md:px-8 py-4 flex items-center justify-between">
        {/* LOGO E NOME */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Lastros</p>
            <p className="text-xs text-slate-500">Sistema de Gestão</p>
          </div>
        </Link>

        {/* INFORMAÇÕES DO USUÁRIO */}
        <div className="flex items-center gap-6">
          {user && (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>

              {/* AVATAR COM DROPDOWN */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 relative group cursor-pointer">
                <span className="text-sm font-bold text-blue-600">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>

                {/* DROPDOWN MENU */}
                {/* Ajustei o posicionamento e adicionei o botão de Sair */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">

                  {/* Link Perfil */}
                  <Link href="/profile" className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-gray-100">
                    Meu Perfil
                  </Link>

                  {/* Botão Sair - Agora vive aqui! */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                  >
                    Sair do Sistema
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}