"use client";

import { useEffect, useState, useMemo } from 'react';
// Removi useRouter pois não é mais necessário aqui
import { Header } from '@/components/Header';
import { ProtectRoute } from '@/app/context/ProtectRoute';
import { useAuth } from '@/app/context/AuthContext';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Home() {
  // Limpei: não precisamos mais do signOut nem do user aqui especificamente para o header
  const { user } = useAuth();

  const [kpis, setKpis] = useState({ salesToday: 0, openOrders: 0, avgTicket: 0, profitToday: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [salesByHour, setSalesByHour] = useState<number[]>([]);

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Removi handleLogout daqui

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${api}/orders`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data.slice(0, 8) : []);

        const today = new Date().toISOString().slice(0, 10);
        let sales = 0;
        let tickets: number[] = [];
        let open = 0;

        (data || []).forEach((o: any) => {
          const created = o.createdAt ? o.createdAt.slice(0, 10) : today;
          if (o.status && o.status !== 'CLOSED' && o.status !== 'DONE') open++;
          if (created === today) {
            const total = o.total || o.amount || 0;
            sales += Number(total || 0);
            if (total) tickets.push(Number(total));
          }
        });

        const avg = tickets.length ? (tickets.reduce((a, b) => a + b, 0) / tickets.length) : 0;
        setKpis({ salesToday: sales, openOrders: open, avgTicket: Math.round(avg), profitToday: Math.round(sales * 0.35) });

        const hours = Array.from({ length: 12 }).map((_, i) => Math.round(Math.random() * 100 + (i * 10)));
        setSalesByHour(hours);
      } catch (e) {
        console.error('Erro ao carregar pedidos', e);
      }
    }
    load();
  }, [api]);

  const chartData = useMemo(() => {
    return {
      labels: salesByHour.map((_, i) => `${i + 1}h`),
      datasets: [
        {
          label: 'Vendas',
          data: salesByHour,
          fill: true,
          backgroundColor: 'rgba(37,99,235,0.12)',
          borderColor: '#2563EB',
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
        },
      ],
    } as ChartData<'line'>;
  }, [salesByHour]);

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-slate-50 pt-20"> {/* Adicionei pt-20 porque o Header é 'fixed' */}
        <Header />

        <main className="max-w-7xl mx-auto p-6 md:p-12">
          {/* Topo: Título e quick actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Como está meu restaurante agora?</h1>
              <p className="text-sm text-slate-500">Visão operacional rápida — métricas, vendas e pedidos recentes.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Removi o botão Sair daqui */}

              <button className="px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 text-sm font-medium rounded-lg shadow-sm transition-colors">
                Novo Pedido
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                Fechar Caixa
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="text-sm font-medium text-slate-500">Vendas Hoje</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">R$ {kpis.salesToday.toFixed(2)}</div>
              <div className="text-xs text-green-600 font-medium mt-1">Últimas 24h</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="text-sm font-medium text-slate-500">Pedidos em Aberto</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">{kpis.openOrders}</div>
              <div className="text-xs text-slate-400 mt-1">Aguardando preparo</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="text-sm font-medium text-slate-500">Ticket Médio</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">R$ {kpis.avgTicket}</div>
              <div className="text-xs text-slate-400 mt-1">Por pedido</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="text-sm font-medium text-slate-500">Lucro do Dia</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">R$ {kpis.profitToday}</div>
              <div className="text-xs text-slate-400 mt-1">Estimativa (35%)</div>
            </div>
          </div>

          {/* Main visualization area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Vendas x Hora</h3>
              </div>
              <div style={{ height: 300 }} className="w-full">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index' as const, intersect: false },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                          label: (ctx: any) => {
                            const v = ctx.parsed.y ?? ctx.raw;
                            return `R$ ${Number(v || 0).toFixed(2)}`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: '#64748B' } },
                      y: { grid: { color: '#F1F5F9' }, ticks: { color: '#64748B' } },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Últimos Pedidos</h3>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-800">Ver todos</button>
              </div>
              <ul className="space-y-0 divide-y divide-gray-100">
                {orders.length === 0 && <li className="text-sm text-slate-500 py-4">Nenhum pedido recente</li>}
                {orders.map((o: any) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {o.customerName || `Pedido ${o.id.substring(0, 8)}...`}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        {o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        <span>•</span>
                        <span className="uppercase text-[10px] tracking-wide">{o.status}</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                      R$ {Number(o.total || o.amount || 0).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectRoute>
  );
}