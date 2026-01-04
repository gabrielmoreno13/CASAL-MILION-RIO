'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/onboarding');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Erro ao entrar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <h1 className="text-4xl font-bold text-white mb-2">Entrar</h1>
                    </Link>
                    <p className="text-white/70">Continue sua jornada rumo ao milhão</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-sm flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            className="glass-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Sua senha"
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Link
                        href="/recuperar-senha"
                        className="text-pink-400 text-sm hover:text-pink-300 hover:underline mb-8 block text-right transition-colors"
                    >
                        Esqueceu a senha?
                    </Link>

                    <button
                        type="submit"
                        className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                    </button>
                </form>

                <p className="text-white/80 text-sm mt-8 text-center">
                    Não tem conta?{' '}
                    <Link href="/register" className="text-pink-400 hover:text-pink-300 font-bold hover:underline transition-colors">
                        Criar conta grátis
                    </Link>
                </p>
            </div>
        </div>
    );
}
