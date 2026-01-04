'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { DollarSign, TrendingUp, Target, CreditCard, ShoppingBag, ArrowUpRight } from 'lucide-react';
import styles from './Overview.module.css';
import { NetWorthCard } from './NetWorthCard';
import { EvolutionChart } from './EvolutionChart';

export function DashboardOverview() {
    const supabase = createClient();
    const [metrics, setMetrics] = useState({
        netWorth: 0,
        invested: 0,
        goal: 1000000,
        monthlyIncome: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Get User/Couple Data
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('income')
                    .eq('id', user.id)
                    .single();

                // 2. Get Goal Data
                const { data: goal } = await supabase
                    .from('financial_goals')
                    .select('*')
                    .limit(1)
                    .single();

                // 3. Get Recent Expenses
                // Need couple_id from member table first
                const { data: member } = await supabase
                    .from('couple_members')
                    .select('couple_id')
                    .eq('profile_id', user.id)
                    .single();

                let expenses = [];
                if (member) {
                    const { data: expenseData } = await supabase
                        .from('expenses')
                        .select('*')
                        .eq('couple_id', member.couple_id)
                        .order('date', { ascending: false })
                        .limit(5);
                    expenses = expenseData || [];
                }

                setMetrics({
                    netWorth: goal?.current_amount || 0,
                    invested: 0,
                    goal: goal?.target_amount || 1000000,
                    monthlyIncome: profile?.income || 0
                });
                setRecentActivity(expenses);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const percentToGoal = ((metrics.netWorth / metrics.goal) * 100).toFixed(1);

    return (
        <div className={styles.container}>
            {/* Net Worth Header (V2) */}
            <NetWorthCard />

            {/* Metrics Grid */}
            <div className={styles.grid}>
                {/* Removido o card de Patrimônio antigo pois agora tem o Header dedicado */}

                <MetricCard
                    label="Total Investido"
                    value={formatCurrency(metrics.invested)}
                    icon={<TrendingUp size={16} />}
                    footer="0% da carteira"
                />
                <MetricCard
                    label="Renda Mensal"
                    value={formatCurrency(metrics.monthlyIncome)}
                    icon={<CreditCard size={16} />}
                    footer="Base familiar"
                />
                <MetricCard
                    label="Meta do Milhão"
                    value={formatCurrency(metrics.goal)}
                    icon={<Target size={16} />}
                    footer="Objetivo Final"
                />
            </div>

            {/* Main Section: Chart & Activity */}
            <div className={styles.mainSection}>
                <div className={styles.chartSection}>
                    <EvolutionChart />
                </div>

                <div className={styles.activitySection}>
                    <h3 className={styles.sectionTitle}>Atividade Recente</h3>
                    {loading ? (
                        <p style={{ color: '#9CA3AF', padding: '1rem' }}>Carregando...</p>
                    ) : recentActivity.length === 0 ? (
                        <div className={styles.emptyActivity}>
                            <p>Nenhuma despesa ainda.</p>
                        </div>
                    ) : (
                        <div className={styles.activityList}>
                            {recentActivity.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    title={activity.description}
                                    date={new Date(activity.date).toLocaleDateString('pt-BR')}
                                    amount={`- ${formatCurrency((activity as any).amount)}`}
                                    logoUrl={(activity as any).logo_url}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, footer }: any) {
    return (
        <div className={styles.card}>
            <div>
                <div className={styles.cardLabel}>{icon} {label}</div>
                <div className={styles.cardValue}>{value}</div>
            </div>
            <div className={styles.cardFooter}>{footer}</div>
        </div>
    );
}

function ActivityItem({ title, date, amount, logoUrl }: any) {
    // Check if it's a URL (old data) or Emoji (new data)
    const isUrl = logoUrl?.startsWith('http');

    return (
        <div className={styles.activityItem}>
            <div className={styles.activityIcon} style={{
                backgroundColor: isUrl ? 'transparent' : '#F3F4F6',
                fontSize: isUrl ? 'inherit' : '1.2rem'
            }}>
                {logoUrl ? (
                    isUrl ? (
                        <img src={logoUrl} alt={title} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <span>{logoUrl}</span>
                    )
                ) : (
                    <ShoppingBag size={18} />
                )}
            </div>
            <div className={styles.activityDetails}>
                <div className={styles.activityTitle}>{title}</div>
                <div className={styles.activityDate}>{date}</div>
            </div>
            <div className={styles.activityAmount} style={{ color: '#111827' }}>
                {amount}
            </div>
        </div>
    );
}
