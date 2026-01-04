'use client';

import { formatCurrency } from '@/lib/utils';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { DollarSign, TrendingUp, Target, CreditCard, ShoppingBag, ArrowUpRight } from 'lucide-react';
import styles from './Overview.module.css';
import { NetWorthCard } from './NetWorthCard';
import { EvolutionChart } from './EvolutionChart';
import { LevelProgress } from '../gamification/LevelProgress';
import { StreakCard } from '../gamification/StreakCard';
import { AchievementsGrid } from '../gamification/Achievements';
import { ViewToggle } from '../couple/ViewToggle';
import { ContributionCard } from '../couple/ContributionCard';
import { ActivityItem } from './ActivityItem';
import { Bell } from 'lucide-react';
import { useCouple } from '@/contexts/CoupleContext';
import { ApprovalModal } from '../couple/ApprovalModal';
import { DailySpendWidget } from '../investment-first/DailySpendWidget';
import { InvestmentCalculator } from '../investment-first/InvestmentCalculator';
import { InsightCard } from '../insights/InsightCard';

export function DashboardOverview() {
    const supabase = createClient();
    const { pendingApprovals } = useCouple();
    const [selectedApproval, setSelectedApproval] = useState<any>(null);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

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
            } catch (error: any) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);



    const percentToGoal = ((metrics.netWorth / metrics.goal) * 100).toFixed(1);

    return (
        <div className={styles.container}>
            {/* Header V3: Couple Toggle & Notifications */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
                    <p className="text-gray-500 text-sm capitalize">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Mock Notification for Pending Approvals */}
                    <div className="relative">
                        <button
                            className="p-2 text-gray-400 hover:text-gray-600 relative"
                            onClick={() => {
                                // For MVP demo: if pending exists, show first. 
                                // Or use useCouple to trigger mock.
                                if (pendingApprovals.length > 0) {
                                    setSelectedApproval(pendingApprovals[0]);
                                } else {
                                    // Mock one for demo purposes if empty
                                    setSelectedApproval({
                                        id: 'demo-1',
                                        amount: 3500,
                                        category: 'Eletrônicos',
                                        description: 'Novo PlayStation 6',
                                        requestedBy: 'Parceiro',
                                        status: 'pending'
                                    });
                                }
                            }}
                        >
                            <Bell size={20} />
                            {(pendingApprovals.length > 0 || true) && ( // Always show dot for demo
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                    </div>
                    <ViewToggle />
                </div>
            </div>

            <InsightCard />

            {/* Level Bar (Gamification) */}
            <LevelProgress />

            <div className="mb-8">
                <DailySpendWidget onClick={() => setIsCalculatorOpen(true)} />
            </div>

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
                <StreakCard />
            </div>

            {/* Couple Contribution (Conditional) */}
            <ContributionCard />

            <AchievementsGrid />

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
                                    amount={(activity as any).amount}
                                    logoUrl={(activity as any).logo_url}
                                    userName="Você" // Mock, needs DB update to store who made the transaction
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedApproval && (
                <ApprovalModal
                    approval={selectedApproval}
                    onClose={() => setSelectedApproval(null)}
                />
            )}

            {isCalculatorOpen && (
                <InvestmentCalculator onClose={() => setIsCalculatorOpen(false)} />
            )}
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


