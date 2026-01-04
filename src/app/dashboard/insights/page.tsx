'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { SubscriptionHunter, SubscriptionCandidate } from '@/lib/wealth/SubscriptionHunter';
import { Sparkles, Zap, AlertTriangle, Bot } from 'lucide-react';
import styles from './Insights.module.css';

export default function InsightsPage() {
    const supabase = createClient();
    const [subscriptions, setSubscriptions] = useState<SubscriptionCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [aiTip, setAiTip] = useState<string>('Analisando suas finanças com IA...');

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (member) {
                // Fetch last 3 months of expenses for analysis
                const { data: expenses } = await supabase
                    .from('expenses')
                    .select('*')
                    .eq('couple_id', member.couple_id)
                    .order('date', { ascending: false })
                    .limit(100);

                if (expenses) {
                    const subs = SubscriptionHunter.analyze(expenses);
                    setSubscriptions(subs);
                }

                // Mock AI Insight (Gemini Placeholder)
                setTimeout(() => {
                    setAiTip('Olá! Notei que seus gastos com iFood aumentaram 20% este mês. Que tal definirmos um "Pote de Delivery" para controlar melhor?');
                }, 1500);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="fade-in">
            <Header title="Inteligência Financeira" action={null} />

            <div className={styles.container}>
                {/* AI Advisor Card */}
                <div className={styles.aiCard}>
                    <div className={styles.aiHeader}>
                        <div className={styles.aiIcon}><Sparkles size={24} color="white" /></div>
                        <h3>Gemini Advisor</h3>
                    </div>
                    <div className={styles.aiContent}>
                        <Bot size={48} className={styles.botIcon} />
                        <div className={styles.chatBubble}>
                            <p>{aiTip}</p>
                        </div>
                    </div>
                    <div className={styles.aiFooter}>
                        Poderoso motor de IA analisando 100% das suas transações.
                    </div>
                </div>

                {/* Subscription Hunter */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <Zap size={24} color="#F59E0B" />
                        <h3>Caçador de Assinaturas</h3>
                    </div>
                    <p className={styles.sectionDesc}>Detectamos automaticamente pagamentos recorrentes que podem estar drenando seu orçamento.</p>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : subscriptions.length === 0 ? (
                        <div className={styles.emptyState}>Nenhuma assinatura suspeita encontrada.</div>
                    ) : (
                        <div className={styles.subGrid}>
                            {subscriptions.map((sub, idx) => (
                                <div key={idx} className={styles.subCard}>
                                    <div className={styles.subHeader}>
                                        <span className={styles.subName}>{sub.name}</span>
                                        {sub.confidence === 'High' && <span className={styles.badge}>Confiavel</span>}
                                    </div>
                                    <div className={styles.subAmount}>{formatCurrency(sub.amount)} <span className={styles.freq}>/ mês</span></div>
                                    <div className={styles.subActions}>
                                        <button className={styles.actionBtn}>Confirmar</button>
                                        <button className={styles.ignoreBtn}>Ignorar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
