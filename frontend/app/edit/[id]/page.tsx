// frontend/app/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(''); // <--- NOVO CAMPO
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // 1. Carregar os dados atuais
    useEffect(() => {
        const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        fetch(`${api}/products/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Produto não encontrado');
                return res.json();
            })
            .then((data) => {
                setName(data.name);
                setPrice(data.price);
                setStock(data.stock); // <--- CARREGA O ESTOQUE ATUAL
                if (data.imageUrl) {
                    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                    setPreview(data.imageUrl.startsWith('/uploads') ? `${api}${data.imageUrl}` : data.imageUrl);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                alert('Erro ao carregar produto.');
                router.push('/');
            });
    }, [id, router]);

    // 2. Salvar as alterações
    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${api}/products/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    price: parseFloat(price),
                    stock: parseInt(stock), // <--- ENVIA O NOVO ESTOQUE
                }),
            });

            if (res.ok) {
                // Se o usuário selecionou nova imagem, enviar após o PATCH
                if (image) {
                    const form = new FormData();
                    form.append('image', image);
                    await fetch(`${api}/products/${id}/image`, {
                        method: 'POST',
                        body: form,
                    });
                }

                alert('✅ Produto e Estoque atualizados!');
                router.push('/');
                router.refresh();
            } else {
                alert('Erro ao atualizar produto.');
            }
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-10 text-center">Carregando...</div>;

    return (
        <main className="min-h-screen p-8 bg-slate-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 w-full max-w-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Editar Produto</h1>

                <form onSubmit={handleUpdate} className="flex flex-col gap-4">

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nome</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Preço (R$)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* --- CAMPO DE ESTOQUE NOVO --- */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Estoque</label>
                            <input
                                type="number"
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 font-bold text-blue-900"
                            />
                        </div>
                        {/* ----------------------------- */}
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
                            }}
                            className="w-full"
                        />

                        {preview && (
                            // preview pode ser path público (/uploads/...) ou object URL
                            <img src={preview} alt="preview" className="mt-2 h-28 object-contain rounded" />
                        )}
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded hover:bg-slate-300"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            Salvar
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}