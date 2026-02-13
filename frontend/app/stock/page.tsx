// frontend/app/stock/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectRoute } from '@/app/context/ProtectRoute';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
}

export default function StockManagement() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Função para buscar produtos
    const fetchProducts = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setProducts(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ATUALIZAR ESTOQUE (+ ou -)
    async function updateStock(id: string, currentStock: number, change: number) {
        const newStock = currentStock + change;
        if (newStock < 0) return alert('O estoque não pode ser negativo!');

        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
        );

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock }),
            });
        } catch (error) {
            alert('Erro de conexão');
            fetchProducts();
        }
    }

    // EXCLUIR PRODUTO
    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja EXCLUIR este produto?')) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products/${id}`, { method: 'DELETE' });
            setProducts(products.filter((p) => p.id !== id)); // Remove da tela na hora
        } catch (error) {
            alert('Erro ao excluir');
        }
    }

    if (loading) return <div className="p-10 text-center">Carregando gestão...</div>;

    return (
        <ProtectRoute>
        <div className="min-h-screen bg-slate-50">
        <main className="p-8">
            <div className="max-w-6xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestão de Estoque e Produtos</h1>
                        <p className="text-slate-500 text-sm">Controle total do seu inventário</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="px-4 py-2">
                            {/* Back button intentionally removed per UI update */}
                        </div>
                        <Link href="/create" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 font-bold transition-all flex items-center gap-2">
                            + Novo Produto
                        </Link>
                    </div>
                </div>

                {/* Tabela de Gestão */}
                <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-bold">
                                <th className="p-4 border-b">Produto</th>
                                <th className="p-4 border-b">Preço</th>
                                <th className="p-4 border-b text-center">Situação</th>
                                <th className="p-4 border-b text-center">Qtd. Atual</th>
                                <th className="p-4 border-b text-center">Ajuste Rápido</th>
                                <th className="p-4 border-b text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">

                                    {/* Nome + Miniatura */}
                                    <td className="p-4 font-bold text-slate-700">
                                        <div className="flex items-center gap-3">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${product.imageUrl}` : product.imageUrl}
                                                    alt={product.name}
                                                    className="w-14 h-14 object-cover rounded border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-xs text-slate-400">sem foto</div>
                                            )}

                                            <div className="truncate max-w-xs">
                                                <div className="font-bold text-slate-700 truncate">{product.name}</div>
                                                <div className="text-xs text-slate-500">ID: {product.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Preço */}
                                    <td className="p-4 text-slate-500">R$ {Number(product.price).toFixed(2)}</td>

                                    {/* Status */}
                                    <td className="p-4 text-center">
                                        {product.stock <= 5 ? (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">CRÍTICO</span>
                                        ) : product.stock <= 20 ? (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200">BAIXO</span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">OK</span>
                                        )}
                                    </td>

                                    {/* Quantidade Grande */}
                                    <td className="p-4 text-center">
                                        <span className={`text-xl font-black ${product.stock === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                                            {product.stock}
                                        </span>
                                    </td>

                                    {/* Botões + e - */}
                                    <td className="p-4">
                                        <div className="flex justify-center items-center gap-1">
                                            <button
                                                onClick={() => updateStock(product.id, product.stock, -1)}
                                                className="w-8 h-8 rounded bg-red-50 text-red-600 hover:bg-red-200 font-bold border border-red-100"
                                                title="Quebra / Perda (-1)"
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => updateStock(product.id, product.stock, +1)}
                                                className="w-8 h-8 rounded bg-green-50 text-green-600 hover:bg-green-200 font-bold border border-green-100"
                                                title="Adicionar (+1)"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>

                                    {/* Botões Editar / Excluir */}
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => router.push(`/edit/${product.id}`)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline px-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm underline px-2"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {products.length === 0 && (
                        <div className="p-10 text-center text-slate-400">
                            Nenhum produto encontrado. Clique em <strong>+ Novo Produto</strong>.
                        </div>
                    )}
                </div>
            </div>
        </main>
        </div>
        </ProtectRoute>
    );
}