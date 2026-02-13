// frontend/app/sales/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectRoute } from '@/app/context/ProtectRoute';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
    };
}

interface Order {
    id: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

export default function SalesHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`)
            .then((res) => res.json())
            .then((data) => {
                // --- PROTEÇÃO CONTRA ERRO ---
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("Backend não devolveu lista de vendas:", data);
                    setOrders([]); // Garante que é uma lista vazia
                }
                // ----------------------------
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setOrders([]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-500">Carregando histórico...</div>;

    return (
        <ProtectRoute>
        <div className="min-h-screen bg-slate-50">
        <main className="p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Histórico de Vendas</h1>
                </div>

                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center p-10 bg-white rounded border border-slate-200 text-slate-500">
                            Nenhuma venda registrada.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                                    <div>
                                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                                            #{order.id.slice(0, 8)}
                                        </span>
                                        <span className="ml-3 text-sm text-slate-400">
                                            {new Date(order.createdAt).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="text-xl font-black text-green-600">
                                        R$ {Number(order.total).toFixed(2)}
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded p-3 text-sm">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                                            <span className="text-slate-700">
                                                {item.quantity}x <strong>{item.product?.name || 'Produto Apagado'}</strong>
                                            </span>
                                            <span className="text-slate-500">R$ {Number(item.price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
        </div>
        </ProtectRoute>
    );
}