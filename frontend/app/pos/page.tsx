'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { ProtectRoute } from '@/app/context/ProtectRoute';

// Interfaces
interface Product {
    id: string;
    name: string;
    price: number;
}

interface CartItem extends Product {
    cartId: string;
}

export default function POS() {
    const router = useRouter();

    // Dados
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Controle do Modal de Pagamento
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'DINHEIRO' | 'PIX' | 'CREDITO' | 'DEBITO'>('DINHEIRO');
    const [cashReceived, setCashReceived] = useState(''); // Para calcular troco
    const [processing, setProcessing] = useState(false); // Efeito de carregamento na venda

    // 1. Carregar Produtos
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const productsNumber = data.map((p: any) => ({ ...p, price: Number(p.price) }));
                    setProducts(productsNumber);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // --- FUNÇÕES DO CARRINHO ---
    function addToCart(product: Product) {
        const newItem: CartItem = { ...product, cartId: Math.random().toString(36).substr(2, 9) };
        setCart([...cart, newItem]);
    }

    function removeFromCart(cartIdToRemove: string) {
        setCart(cart.filter((item) => item.cartId !== cartIdToRemove));
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);

    // --- FUNÇÕES DE VENDA ---
    async function handleFinishSale() {
        setProcessing(true);

        const itemsPayload = cart.map(item => ({
            productId: item.id,
            quantity: 1,
            price: item.price
        }));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total: total,
                    items: itemsPayload,
                    paymentMethod: paymentMethod
                })
            });

            if (res.ok) {
                alert(`✅ VENDA REALIZADA COM SUCESSO!`);
                setCart([]);
                setIsModalOpen(false);
                setCashReceived('');
            } else {
                alert('❌ Erro ao processar venda. Verifique o estoque.');
            }
        } catch (error) {
            alert('Erro de conexão com o servidor.');
        } finally {
            setProcessing(false);
        }
    }

    // --- GERADOR DE QR CODE PIX REAL (API QRServer) ---
    // Gera um texto de PIX simulado (com valor real) e cria a imagem
    const pixCode = `00020126330014BR.GOV.BCB.PIX0114+5511999999999520400005303986540${total.toFixed(2).replace('.', '')}5802BR5913LASTROS BURGER6008SAO PAULO62070503***6304`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`;

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Carregando Sistema...</div>;

    return (
        <ProtectRoute>
        <main className="flex h-screen bg-slate-100 overflow-hidden font-sans">

            {/* =======================
          LADO ESQUERDO (VITRINE) 
         ======================= */}
            <div className="flex-1 flex flex-col">

                {/* HEADER SUPERIOR */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">L</div>
                        <h1 className="font-bold text-slate-700">Lastros PDV <span className="text-xs font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">Online</span></h1>
                    </div>

                    {/* 'Sair do Caixa' removed per UI update */}
                </header>

                {/* GRID DE PRODUTOS */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all flex flex-col justify-between h-40 relative overflow-hidden active:scale-95"
                            >
                                <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 text-xs px-2 py-1 rounded-bl-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    Adicionar
                                </div>
                                <div className="font-bold text-slate-700 text-left line-clamp-2 mt-2">
                                    {product.name}
                                </div>
                                <div className="text-left">
                                    <span className="text-xs text-slate-400">Preço Un.</span>
                                    <div className="text-blue-600 font-black text-xl">R$ {product.price.toFixed(2)}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* =======================
          LADO DIREITO (CAIXA) 
         ======================= */}
            <div className="w-[400px] bg-white border-l border-slate-300 flex flex-col shadow-2xl z-20 relative">

                <div className="p-5 bg-slate-900 text-white shadow-lg">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-lg font-bold">Cupom Fiscal</h2>
                            <p className="text-slate-400 text-xs">Venda #{(Math.random() * 1000).toFixed(0)}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-400">Itens</div>
                            <div className="font-bold text-xl">{cart.length}</div>
                        </div>
                    </div>
                </div>

                {/* LISTA DE ITENS */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                            <span className="text-4xl mb-2">🛒</span>
                            <p>Caixa Livre</p>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={item.cartId} className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 shadow-sm hover:bg-red-50 group transition-colors">
                                <div className="flex gap-3 overflow-hidden">
                                    <span className="text-slate-300 font-mono text-xs w-4 pt-1">{index + 1}</span>
                                    <div>
                                        <div className="font-medium text-slate-700 text-sm truncate w-40">{item.name}</div>
                                        <div className="text-xs text-slate-500">1 x R$ {item.price.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800 text-sm">R$ {item.price.toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.cartId)} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RODAPÉ DO TOTAL */}
                <div className="p-6 bg-white border-t border-slate-200">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-slate-500 font-medium text-sm">TOTAL A PAGAR</span>
                        <span className="text-4xl font-black text-slate-800">R$ {total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={cart.length === 0}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-lg tracking-wide flex justify-center items-center gap-2"
                    >
                        <span>PAGAR</span> ➔
                    </button>
                </div>
            </div>

            {/* =================================
          MODAL DE PAGAMENTO (PROFISSIONAL)
         ================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden">

                        {/* COLUNA ESQUERDA: RESUMO */}
                        <div className="w-1/3 bg-slate-100 p-8 border-r border-slate-200 flex flex-col justify-between">
                            <div>
                                <h3 className="text-slate-500 font-bold uppercase text-xs mb-1">Resumo da Venda</h3>
                                <div className="text-4xl font-black text-slate-800 mb-6">R$ {total.toFixed(2)}</div>

                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                                        <p className="text-xs text-slate-400 mb-1">Itens</p>
                                        <p className="font-bold text-slate-700">{cart.length} produtos</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-sm font-bold underline">
                                Cancelar
                            </button>
                        </div>

                        {/* COLUNA DIREITA: FORMAS DE PAGAMENTO */}
                        <div className="w-2/3 p-8 flex flex-col">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Como o cliente vai pagar?</h2>

                            {/* ABAS DE PAGAMENTO */}
                            <div className="grid grid-cols-4 gap-2 mb-8">
                                {['DINHEIRO', 'PIX', 'CREDITO', 'DEBITO'].map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method as any)}
                                        className={`py-3 rounded-lg font-bold text-sm border-2 transition-all ${paymentMethod === method ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>

                            {/* CONTEÚDO DINÂMICO DO PAGAMENTO */}
                            <div className="flex-1 flex flex-col justify-center items-center border rounded-xl p-6 bg-slate-50 mb-6 relative overflow-hidden">

                                {/* --- TELA DO PIX REAL --- */}
                                {paymentMethod === 'PIX' && (
                                    <div className="text-center animate-pulse-once">
                                        {/* AQUI ESTÁ A MÁGICA DO QR CODE */}
                                        <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 mx-auto mb-4 border-4 border-white shadow-sm rounded-lg" />
                                        <p className="font-bold text-slate-700 mb-1">Escaneie para pagar</p>
                                        <p className="text-xs text-slate-400">Aguardando confirmação do banco...</p>
                                    </div>
                                )}

                                {/* --- TELA DO DINHEIRO (TROCO) --- */}
                                {paymentMethod === 'DINHEIRO' && (
                                    <div className="w-full max-w-xs">
                                        <label className="block text-sm font-bold text-slate-600 mb-2">Valor Recebido (R$)</label>
                                        <input
                                            type="number"
                                            autoFocus
                                            value={cashReceived}
                                            onChange={(e) => setCashReceived(e.target.value)}
                                            className="w-full text-3xl font-black p-4 border rounded-lg mb-4 text-center focus:ring-2 focus:ring-green-500 outline-none bg-white shadow-inner"
                                            placeholder="0,00"
                                        />
                                        {Number(cashReceived) > total ? (
                                            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center border border-green-200">
                                                <p className="text-xs font-bold uppercase opacity-70">Troco a Devolver</p>
                                                <p className="text-4xl font-black mt-1">R$ {(Number(cashReceived) - total).toFixed(2)}</p>
                                            </div>
                                        ) : (
                                            <div className="text-center text-slate-400 text-sm">
                                                Digite quanto o cliente entregou para calcular o troco.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* --- TELA DE CARTÃO --- */}
                                {(paymentMethod === 'CREDITO' || paymentMethod === 'DEBITO') && (
                                    <div className="text-center">
                                        <div className="text-6xl mb-4 animate-bounce">💳</div>
                                        <p className="font-bold text-slate-700">Aguardando Maquininha...</p>
                                        <p className="text-sm text-slate-400">Solicite o pagamento na máquina.</p>
                                    </div>
                                )}
                            </div>

                            {/* BOTÃO FINALIZAR GIGANTE */}
                            <button
                                onClick={handleFinishSale}
                                disabled={processing}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-xl disabled:opacity-50 flex justify-center items-center"
                            >
                                {processing ? 'PROCESSANDO...' : `CONFIRMAR PAGAMENTO (${paymentMethod})`}
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </main>
        </ProtectRoute>
    );
}