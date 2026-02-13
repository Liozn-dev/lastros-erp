'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, updateUser, isAuthenticated, loading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, isAuthenticated, authLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (password && password !== confirm) {
      setMessage('As senhas não batem');
      return;
    }

    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${api}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessage(err.message || 'Erro ao atualizar perfil');
      } else {
        const data = await res.json();
        const newUser = data.user || data;
        updateUser(newUser);
        setMessage('Perfil atualizado com sucesso');
      }
    } catch (e) {
      console.error(e);
      setMessage('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 bg-slate-50 flex justify-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

        {message && (
          <div className="mb-4 text-sm text-center text-slate-700">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Nova senha (opcional)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Confirmar nova senha</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-slate-200 rounded">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
