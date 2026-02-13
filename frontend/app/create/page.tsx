// frontend/app/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProduct() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Evita que a página recarregue sozinha
        setLoading(true);

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${api}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    price: parseFloat(price), // Converte texto para número decimal
                }),
            });

            if (res.ok) {
                const created = await res.json();
                // Se tem imagem, faz upload separado
                if (image) {
                    const form = new FormData();
                    form.append('image', image);
                    await fetch(`${api}/products/${created.id}/image`, {
                        method: 'POST',
                        body: form,
                    });
                }
                // Se deu certo, volta para a lista de produtos
                router.push('/');
                router.refresh();
            } else {
                alert('Erro ao criar produto');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen p-8 bg-slate-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 w-full max-w-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Novo Produto</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Campo NOME */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Produto</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Coca-Cola Lata"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    {/* Campo PREÇO */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Preço (R$)</label>
                        <input
                            type="number"
                            required
                            step="0.01" // Permite centavos
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>

                    {/* Campo IMAGEM */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Imagem</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const f = e.target.files?.[0] ?? null;
                                setImage(f);
                                if (f) setPreview(URL.createObjectURL(f));
                                else setPreview(null);
                            }}
                            className="w-full"
                        />

                        {preview && (
                            <img src={preview} alt="preview" className="mt-2 h-28 object-contain rounded" />
                        )}
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded hover:bg-slate-300 transition-colors"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Cadastrar'}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}