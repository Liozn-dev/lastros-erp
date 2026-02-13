// frontend/components/ProductForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price }),
      });

      setName('');
      setPrice('');
      router.refresh(); 
    } catch (error) {
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 mb-8">
      <h2 className="text-lg font-bold text-slate-700 mb-4">Adicionar Novo Produto</h2>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">Nome</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900" 
            placeholder="Ex: Hambúrguer"
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-slate-600 mb-1">Preço</label>
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900"
            placeholder="0.00"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          {loading ? '...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}