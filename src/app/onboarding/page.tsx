'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ArrowRight, ArrowLeft, DollarSign, Heart, Target, Loader2, Check } from 'lucide-react';
import styles from './page.module.css';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Form States
    const [income, setIncome] = useState('');
    const [goalDate, setGoalDate] = useState('');
    const [coupleName, setCoupleName] = useState('');

    useEffect(() => {
        // Check session
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUserId(user.id);
            }
        };
        checkUser();
    }, []);

    const handleNext = async () => {
        setLoading(true);
        try {
            if (step === 1) {
                // Save Income
                const { error } = await supabase
                    .from('profiles')
                    .update({ income: parseFloat(income.replace(/[^0-9.]/g, '')) || 0 })
                    .eq('id', userId);

                if (error) throw error;
                setStep(2);
            } else if (step === 2) {
                setStep(3);
            } else if (step === 3) {
                // Create Couple & Goal
                // 1. Create Couple
                const { data: couple, error: coupleError } = await supabase
                    .from('couples')
                    .insert({ name: coupleName || 'Casal Milionário' })
                    .select()
                    .single();

                if (coupleError) throw coupleError;

                // 2. Link User to Couple
                const { error: memberError } = await supabase
                    .from('couple_members')
                    .insert({
                        couple_id: couple.id,
                        profile_id: userId,
                        role: 'admin'
                    });

                if (memberError) throw memberError;

                // 3. Create Goal
                const { error: goalError } = await supabase
                    .from('financial_goals')
                    .insert({
                        couple_id: couple.id,
                        target_amount: 1000000,
                        deadline: goalDate
                    });

                if (goalError) throw goalError;

                // Finish
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error(error);
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.wizardCard}>
                {/* Progress Bar */}
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />

                {/* Step 1: Income */}
                {step === 1 && (
                    <div className={styles.stepContainer}>
                        <div className={styles.stepHeader}>
                            <div className="flex justify-center mb-4 text-emerald-500">
                                <DollarSign size={48} />
                            </div>
                            <h1 className={styles.stepTitle}>Qual sua renda mensal?</h1>
                            <p className={styles.stepSubtitle}>Para calcularmos quanto tempo falta para o milhão.</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Renda Líquida Mensal (R$)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    placeholder="Ex: 5000"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Goal Date */}
                {step === 2 && (
                    <div className={styles.stepContainer}>
                        <div className={styles.stepHeader}>
                            <div className="flex justify-center mb-4 text-emerald-500">
                                <Target size={48} />
                            </div>
                            <h1 className={styles.stepTitle}>Quando querem chegar lá?</h1>
                            <p className={styles.stepSubtitle}>Defina uma meta realista para o primeiro milhão.</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Data Alvo</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={goalDate}
                                    onChange={(e) => setGoalDate(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Couple Name */}
                {step === 3 && (
                    <div className={styles.stepContainer}>
                        <div className={styles.stepHeader}>
                            <div className="flex justify-center mb-4 text-emerald-500">
                                <Heart size={48} />
                            </div>
                            <h1 className={styles.stepTitle}>Nome do Casal</h1>
                            <p className={styles.stepSubtitle}>Como vocês querem chamar o time?</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Nome do Casal</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Ex: Gabriel & Maria"
                                    value={coupleName}
                                    onChange={(e) => setCoupleName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className={styles.actions}>
                    {step > 1 ? (
                        <button className={styles.btnBack} onClick={() => setStep(step - 1)} disabled={loading}>
                            <ArrowLeft size={20} /> Voltar
                        </button>
                    ) : (
                        <div /> // Spacer
                    )}

                    <button className={styles.btnNext} onClick={handleNext} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                {step === totalSteps ? 'Finalizar' : 'Continuar'} <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
