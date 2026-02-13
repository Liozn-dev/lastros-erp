'use client';

import { ProtectRoute } from '@/app/context/ProtectRoute';

export default function IntegrationsPage() {
  return (
    <ProtectRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 p-6 md:p-12">
        <main className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">
              🔗 Integrações
            </h1>
            <p className="text-xl text-slate-600">
              Conecte com apps externos e gerenciar suas integrações.
            </p>
          </div>

          {/* INTEGRAÇÕES DISPONÍVEIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

            {/* IFOOD */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">iFood</h3>
                <span className="text-2xl">🍕</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">Integre com a plataforma iFood para receber pedidos automaticamente</p>
              <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold">
                Conectar
              </button>
            </div>

            {/* WHATSAPP */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">WhatsApp</h3>
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">Receba pedidos e se comunique com clientes via WhatsApp</p>
              <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold">
                Conectar
              </button>
            </div>

            {/* UBER EATS */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Uber Eats</h3>
                <span className="text-2xl">🚗</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">Conecte com Uber Eats e receba pedidos de entrega</p>
              <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                Conectar
              </button>
            </div>

          </div>

          {/* SEÇÃO DE INTEGRAÇÕES ATIVAS */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Integrações Ativas</h2>
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">Nenhuma integração conectada</p>
              <p className="text-sm mt-2">Clique em "Conectar" em uma das integrações acima para começar</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectRoute>
  );
}
