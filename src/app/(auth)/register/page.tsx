'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import styles from '../login/page.module.css'; // Reusing styles

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
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) throw error;

            // Assumes auto-confirm is off or handles session created
            router.push('/onboarding');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta. Tente novamente.');
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
                    <h1 className={styles.title}>Começar Agora</h1>
                    <p className={styles.subtitle}>Crie sua conta e comece a investir juntos.</p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Nome Completo</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            className={styles.input}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="Min. 6 caracteres"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Criar Conta'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className={styles.footer}>
                    Já tem uma conta?
                    <Link href="/login" className={styles.link}>
                        Entrar
                    </Link>
                </div>
            </div>
        </div>
    );
}
