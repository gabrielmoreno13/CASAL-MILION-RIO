'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { Target, Trophy, Plus, Wallet } from 'lucide-react';
import { AddGoalModal } from '@/components/goals/AddGoalModal';
import styles from './Goals.module.css';

export default function GoalsPage() {
    const supabase = createClient();
    const [goals, setGoals] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    useEffect(() => {
        async function fetchGoals() {
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
                    .from('financial_goals')
                    .select('*')
                    .eq('couple_id', member.couple_id)
                    .order('created_at', { ascending: true });
                setGoals(data || []);
            }
        }
        fetchGoals();
    }, [refreshTrigger]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    // Identify the "Meta do Milhão" (assuming it's the one with the biggest target or specific name, for now simply the first one or logic)
    // For MVP, if multiple goals exist, we can treat the first one as MAIN (Million) and others as secondary.
    const mainGoal = goals.find(g => g.target_amount >= 1000000) || goals[0];
    const subGoals = goals.filter(g => g !== mainGoal);

    const progress = mainGoal ? (mainGoal.current_amount / mainGoal.target_amount) * 100 : 0;

    return (
        <div className="fade-in">
            <Header title="Metas do Casal" action={
                <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Novo Pote
                </button>
            } />

            <div className={styles.container}>
                {mainGoal ? (
                    <div className={styles.mainGoalCard}>
                        <div className={styles.iconWrapper}>
                            <Trophy size={32} color="#F59E0B" />
                        </div>
                        <div className={styles.goalInfo}>
                            <h2 className={styles.goalTitle}>{mainGoal.goal_type || 'Meta Principal'}</h2>
                            <p className={styles.goalSubtitle}>O objetivo principal da jornada.</p>
                        </div>

                        <div className={styles.progressContainer}>
                            <div className={styles.progressLabels}>
                                <span>{formatCurrency(mainGoal.current_amount)}</span>
                                <span>{formatCurrency(mainGoal.target_amount)}</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                            </div>
                            <div className={styles.progressText}>{progress.toFixed(1)}% Concluído</div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.emptyState}>Carregando Meta Principal...</div>
                )}

                <div className={styles.subGoals}>
                    <h3>Outros Potes & Objetivos</h3>
                    <div className={styles.placeholders} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {subGoals.map(goal => {
                            const p = (goal.current_amount / goal.target_amount) * 100;
                            return (
                                <div key={goal.id} className={styles.subGoalCard}>
                                    <div className={styles.subGoalIcon}><Wallet size={20} color="var(--primary)" /></div>
                                    <div className={styles.subGoalName}>{goal.goal_type}</div>
                                    <div className={styles.subGoalValue}>{formatCurrency(goal.current_amount)}</div>
                                    <div className={styles.miniProgBar}>
                                        <div className={styles.miniProgFill} style={{ width: `${Math.min(p, 100)}%` }}></div>
                                    </div>
                                    <div className={styles.subGoalTarget}>de {formatCurrency(goal.target_amount)}</div>
                                </div>
                            )
                        })}

                        <div className={styles.addCard} onClick={() => setIsModalOpen(true)}>
                            <Plus size={24} />
                            <span>Criar Novo Pote</span>
                        </div>
                    </div>
                </div>
            </div>

            {user && (
                <AddGoalModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                    user={user}
                />
            )}
        </div>
    );
}
