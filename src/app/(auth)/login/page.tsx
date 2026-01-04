'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import styles from './page.module.css';

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
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <TrendingUp size={24} color="#111827" />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                            Casal Milionário
                        </span>
                    </div>
                    <h1 className={styles.title}>Bem-vindo de volta</h1>
                    <p className={styles.subtitle}>Entre para continuar sua jornada rumo ao milhão.</p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Senha</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Entrar'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className={styles.footer}>
                    Não tem uma conta?
                    <Link href="/register" className={styles.link}>
                        Criar conta
                    </Link>
                </div>
            </div>
        </div>
    );
}
