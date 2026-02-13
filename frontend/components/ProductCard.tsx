'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: string | number;
    stock?: number; // <--- O ESTOQUE ESTÁ AQUI
}

export default function ProductCard({ id, name, price, stock }: ProductCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        setLoading(true);
        try {
            await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
            window.location.reload();
        } catch (error) {
            alert('Erro ao excluir');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between h-full relative overflow-hidden">

            {/* --- AQUI É O CÓDIGO QUE MOSTRA A ETIQUETA AZUL --- */}
            {stock !== undefined && (
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${stock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    Estoque: {stock}
                </div>
            )}
            {/* -------------------------------------------------- */}

            <div>
                <h2 className="text-xl font-bold text-slate-800 mt-4">{name}</h2>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">
                    R$ {Number(price).toFixed(2)}
                </p>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={() => router.push(`/edit/${id}`)}
                    className="flex-1 bg-blue-50 text-blue-700 font-bold py-2 px-4 rounded hover:bg-blue-100 transition-colors border border-blue-200"
                >
                    Editar
                </button>

                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="bg-red-50 text-red-700 font-bold py-2 px-4 rounded hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50"
                >
                    {loading ? '...' : 'Excluir'}
                </button>
            </div>
        </div>
    );
}