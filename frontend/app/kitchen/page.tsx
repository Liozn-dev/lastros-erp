'use client';

import Link from 'next/link';
import { ProtectRoute } from '@/app/context/ProtectRoute';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 3000); // polling cada 3s
    return () => clearInterval(id);
  }, []);

  const pendentes = orders.filter(o => o.status === 'PENDING').length;
  const preparando = orders.filter(o => o.status === 'PREPARING' || o.status === 'IN_PROGRESS').length;
  const prontos = orders.filter(o => o.status === 'COMPLETED' || o.status === 'READY').length;

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-6 md:p-12">
        <div className="mb-6">
          <h1 className="text-4xl font-black text-slate-900 mb-2 mt-4">👨‍🍳 Cozinha</h1>
          <p className="text-slate-600">Comandas em tempo real — atualizando automaticamente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-l-4 border-orange-500 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-2">{pendentes}</h2>
            <p className="text-slate-600">Pedidos Pendentes</p>
          </div>
          <div className="bg-white border-l-4 border-yellow-500 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">{preparando}</h2>
            <p className="text-slate-600">Em Preparo</p>
          </div>
          <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-2">{prontos}</h2>
            <p className="text-slate-600">Prontos</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Comandas Ativas</h2>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Carregando comandas...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhuma comanda no momento</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded p-4 flex justify-between items-start">
                  <div>
                    <div className="text-sm text-slate-500">#{order.id.slice(0,8)} — {new Date(order.createdAt).toLocaleTimeString()}</div>
                    <div className="font-bold text-slate-800">R$ {Number(order.total).toFixed(2)}</div>
                    <div className="text-sm text-slate-600 mt-2">
                      {order.items.map(i => (
                        <div key={i.id} className="flex items-center gap-3">
                          <span className="font-medium">{i.quantity}x</span>
                          <span>{i.product?.name || 'Produto'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-2">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectRoute>
  );
}
