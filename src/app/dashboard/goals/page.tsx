'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { Target, Trophy, Plus, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AddGoalModal } from '@/components/goals/AddGoalModal';
import styles from './Goals.module.css';
import { formatCurrency } from '@/lib/utils';
import { GoalTimeline } from '@/components/projections/GoalTimeline';

function GoalsContent() {
    const supabase = createClient();
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [user, setUser] = useState<any>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsModalOpen(false);
        router.push('/dashboard/goals');
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    useEffect(() => {
        async function fetchGoals() {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Get Couple ID
                const { data: member } = await supabase
                    .from('couple_members')
                    .select('couple_id')
                    .eq('profile_id', user.id)
                    .single();

                if (member) {
                    const { data } = await supabase
                        .from('goals')
                        .select('*')
                        .eq('couple_id', member.couple_id)
                        .order('target_date', { ascending: true }); // Order by date
                    setGoals(data || []);
                }
            } catch (error) {
                console.error('Error fetching goals:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchGoals();
    }, [refreshTrigger]);

    const totalTarget = goals.reduce((acc, goal) => acc + goal.target_amount, 0);
    const totalCurrent = goals.reduce((acc, goal) => acc + goal.current_amount, 0);
    const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

    return (
        <div className="fade-in">
            <Header title="Metas do Casal" action={<button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}><Plus size={18} /> Nova Meta</button>} />

            <div className={styles.container}>
                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <div className={styles.iconBox} style={{ background: '#ECFDF5', color: '#10B981' }}>
                            <Target size={24} />
                        </div>
                        <div>
                            <p className={styles.label}>Meta Total</p>
                            <p className={styles.value}>{formatCurrency(totalTarget)}</p>
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.iconBox} style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className={styles.label}>Acumulado</p>
                            <p className={styles.value}>{formatCurrency(totalCurrent)}</p>
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.iconBox} style={{ background: '#FFF7ED', color: '#F59E0B' }}>
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className={styles.label}>Conquistas</p>
                            <p className={styles.value}>{goals.filter(g => g.current_amount >= g.target_amount).length} / {goals.length}</p>
                        </div>
                    </div>
                </div>

                {/* PROJECTION TIMELINE (FEATURE 4) */}
                {goals.length > 0 && (
                    <div className="mb-8">
                        <GoalTimeline goals={goals} monthlyContribution={2000} /> {/* Mock contribution for now */}
                    </div>
                )}

                {/* Goals List */}
                <h3 className={styles.sectionTitle}>Seus Potes</h3>
                <div className={styles.goalsGrid}>
                    {loading ? (
                        <p>Carregando metas...</p>
                    ) : goals.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Nenhuma meta criada ainda.</p>
                            <button onClick={() => setIsModalOpen(true)} className={styles.createBtn}>Criar Primeira Meta</button>
                        </div>
                    ) : (
                        goals.map(goal => (
                            <div key={goal.id} className={styles.goalCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.goalIcon}>{goal.icon || '🎯'}</div>
                                    <div className={styles.goalInfo}>
                                        <h4>{goal.title}</h4>
                                        <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className={styles.progressSection}>
                                    <div className={styles.amounts}>
                                        <span className={styles.current}>{formatCurrency(goal.current_amount)}</span>
                                        <span className={styles.target}>de {formatCurrency(goal.target_amount)}</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {user && (
                    <AddGoalModal
                        isOpen={isModalOpen}
                        onClose={handleClose}
                        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                        user={user}
                    />
                )}
            </div>
        </div>
    );
}

export default function GoalsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando metas...</div>}>
            <GoalsContent />
        </Suspense>
    );
}
