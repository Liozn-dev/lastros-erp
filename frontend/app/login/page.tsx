// frontend/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function Login() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirecionar se já autenticado
    if (isAuthenticated) {
        router.push('/');
        return null;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">

            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in">

                {/* LADO ESQUERDO: Branding do Software (Lastros) */}
                <div className="hidden md:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                    {/* Círculos decorativos de fundo */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-slate-800 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900 rounded-full opacity-30 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            {/* LOGO CONCEITUAL: Quadrado com L (Minimalista) */}
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
                                <span className="text-white font-black text-xl">L</span>
                            </div>
                            <span className="text-white text-2xl font-bold tracking-tight">Lastros <span className="text-blue-400 font-light">ERP</span></span>
                        </div>

                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Gestão inteligente para o seu restaurante.
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Controle pedidos, estoque e financeiro em um único lugar. Simples, rápido e eficiente.
                        </p>
                    </div>

                    <div className="relative z-10 text-slate-500 text-xs mt-8">
                        © 2024 Lastros Tecnologia. Todos os direitos reservados.
                    </div>
                </div>

                {/* LADO DIREITO: Formulário de Acesso */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">

                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Acesse sua conta</h3>
                        <p className="text-slate-500">Digite suas credenciais para gerenciar sua loja.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-700"
                                placeholder="exemplo@restaurante.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Senha</label>
                                <a href="/forgot" className="text-xs text-blue-600 hover:underline">Esqueceu?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-700"
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                                >
                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                'ENTRAR NO SISTEMA'
                            )}
                        </button>

                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500">
                            Ainda não é parceiro? <a href="#" className="text-blue-600 font-bold hover:underline">Criar conta grátis</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}