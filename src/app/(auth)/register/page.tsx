'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';


export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) throw signUpError;

            // Optional: Check if session was created immediately (auto-confirm)
            const { data: { session } } = await supabase.auth.getSession();

            // Force refresh to update middleware/auth state
            router.push('/onboarding');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo(a)</h1>
                    </Link>
                    <p className="text-white/70">Construa seu primeiro milhão juntos</p>
                </div>

                <form onSubmit={handleRegister}>
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-sm flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <input
                            type="text"
                            placeholder="Seu nome completo"
                            className="glass-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            className="glass-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Senha segura (mín. 8 caracteres)"
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Criar Conta Grátis'}
                    </button>
                </form>

                <p className="text-white/60 text-sm mt-4 text-center">
                    Você receberá um e-mail de confirmação
                </p>

                <p className="text-white/80 text-sm mt-6 text-center">
                    Já tem conta? <Link href="/login" className="text-pink-400 hover:text-pink-300 font-bold hover:underline transition-colors">Entrar</Link>
                </p>
            </div>
        </div>
    );
}
