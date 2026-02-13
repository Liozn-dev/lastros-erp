"use client";

import { usePathname } from "next/navigation";
// IMPORTANTE: Usando chaves { } para corrigir o erro "Export default doesn't exist"
import { Sidebar } from "./Sidebar"; 
import { Header } from "./Header";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const pathname = usePathname();

  // Se for Login, mostra tela limpa
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* O Sidebar geralmente tem 'fixed w-64' dentro dele ou colocamos aqui */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 hidden md:block">
        <Sidebar />
      </div>

      {/* Margem na esquerda (ml-64) para empurrar o conteúdo e não ficar embaixo do menu */}
      <div className="flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        
        {/* Header */}
        <Header />

        {/* Conteúdo da página */}
        {/* Se o Header for 'fixed', talvez precise de 'pt-20' aqui também */}
        <main className="flex-1 p-6 pt-24"> 
          {children}
        </main>
      </div>

    </div>
  );
}