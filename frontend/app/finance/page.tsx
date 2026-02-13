'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectRoute } from '@/app/context/ProtectRoute';

export default function Finance() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [salesTotal, setSalesTotal] = useState(0);

    // Formulario Nova Despesa
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('FIXO');

    // Carregar Dados
    useEffect(() => {
        // 1. Carregar Despesas
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/expenses`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setExpenses(data); });

        // 2. Carregar Total de Vendas (Pegamos do endpoint de pedidos)
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`)
            .then(res => res.json())
            .then((data: any[]) => {
                if (Array.isArray(data)) {
                    const total = data.reduce((acc, order) => acc + Number(order.total), 0);
                    setSalesTotal(total);
                }
            });
    }, []);

    async function handleAddExpense(e: React.FormEvent) {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: desc, amount: parseFloat(amount), category }),
        });
        window.location.reload();
    }

    async function handleDelete(id: string) {
        if (!confirm('Apagar despesa?')) return;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/expenses/${id}`, { method: 'DELETE' });
        window.location.reload();
    }

    const expensesTotal = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
    const profit = salesTotal - expensesTotal;

    return (
        <ProtectRoute>
        <div className="min-h-screen bg-slate-50">
        <main className="p-8">
            <div className="max-w-5xl mx-auto">

                {/* CABEÇALHO */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Financeiro</h1>
                </div>

                {/* INDICADORES (DASHBOARD) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-green-100 p-6 rounded-xl border border-green-200">
                        <p className="text-green-700 font-bold text-sm uppercase">Receitas (Vendas)</p>
                        <p className="text-3xl font-black text-green-800">R$ {salesTotal.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-100 p-6 rounded-xl border border-red-200">
                        <p className="text-red-700 font-bold text-sm uppercase">Despesas (Contas)</p>
                        <p className="text-3xl font-black text-red-800">R$ {expensesTotal.toFixed(2)}</p>
                    </div>
                    <div className={`p-6 rounded-xl border ${profit >= 0 ? 'bg-blue-100 border-blue-200' : 'bg-orange-100 border-orange-200'}`}>
                        <p className="text-slate-700 font-bold text-sm uppercase">Lucro Líquido</p>
                        <p className={`text-3xl font-black ${profit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                            R$ {profit.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* FORMULÁRIO DE DESPESA */}
                    <div className="bg-white p-6 rounded-lg shadow h-fit">
                        <h2 className="text-xl font-bold mb-4">Lançar Conta a Pagar</h2>
                        <form onSubmit={handleAddExpense} className="flex flex-col gap-3">
                            <input type="text" placeholder="Descrição (Ex: Luz)" required value={desc} onChange={e => setDesc(e.target.value)} className="border p-2 rounded" />
                            <input type="number" placeholder="Valor (R$)" required value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 rounded" />
                            <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded">
                                <option value="FIXO">Custo Fixo</option>
                                <option value="VARIAVEL">Custo Variável</option>
                                <option value="FORNECEDOR">Fornecedor</option>
                            </select>
                            <button type="submit" className="bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700">LANÇAR SAÍDA</button>
                        </form>
                    </div>

                    {/* LISTA DE DESPESAS */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="p-4">Descrição</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Valor</th>
                                    <th className="p-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {expenses.map(item => (
                                    <tr key={item.id}>
                                        <td className="p-4 font-bold">{item.description}</td>
                                        <td className="p-4 text-xs"><span className="bg-slate-100 px-2 py-1 rounded">{item.category}</span></td>
                                        <td className="p-4 text-red-600 font-bold">- R$ {Number(item.amount).toFixed(2)}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {expenses.length === 0 && <div className="p-8 text-center text-slate-400">Nenhuma despesa lançada.</div>}
                    </div>
                </div>
            </div>
        </main>
        </div>
        </ProtectRoute>
    );
}