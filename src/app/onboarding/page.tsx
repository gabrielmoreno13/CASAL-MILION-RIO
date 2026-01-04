'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ArrowRight, ArrowLeft, DollarSign, Heart, Target, Loader2, Check } from 'lucide-react';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';
import styles from './page.module.css';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Form States
    const [userIncome, setUserIncome] = useState('');
    const [partnerIncome, setPartnerIncome] = useState('');
    const [initialBalance, setInitialBalance] = useState(''); // New State
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

    const handleIncomeChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(formatCurrencyInput(e.target.value));
    };

    const handleNext = async () => {
        setLoading(true);
        try {
            if (step === 1) {
                // Save Income
                const totalIncome = parseCurrencyInput(userIncome) + parseCurrencyInput(partnerIncome);

                if (totalIncome <= 0 && (userIncome || partnerIncome)) {
                    // allow 0 but warn?
                }

                const { error } = await supabase
                    .from('profiles')
                    .update({ income: totalIncome })
                    .eq('id', userId);

                if (error) throw error;
                setStep(1.5);
            } else if (step === 1.5) {
                setStep(2);
            } else if (step === 2) {
                setStep(3);
            } else if (step === 3) {
                // ... Couple creation ...
                const { data: couple, error: coupleError } = await supabase
                    .from('couples')
                    .insert({ name: coupleName || 'Casal Milionário' })
                    .select()
                    .single();

                if (coupleError) throw coupleError;

                await supabase.from('couple_members').insert({
                    couple_id: couple.id,
                    profile_id: userId,
                    role: 'admin'
                });

                await supabase.from('financial_goals').insert({
                    couple_id: couple.id,
                    target_amount: 1000000,
                    deadline: goalDate
                });

                // 4. Create Initial Balance Asset
                const balanceValue = parseCurrencyInput(initialBalance);
                if (balanceValue > 0) {
                    await supabase.from('assets').insert({
                        couple_id: couple.id,
                        name: 'Saldo Inicial',
                        type: 'INVESTMENT',
                        value: balanceValue
                    });
                }

                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error(error);
            alert(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const totalSteps = 4;
    let visualStep = step;
    if (step > 1) visualStep = step === 1.5 ? 2 : step + 1;
    const progressMap: any = { 1: 25, 1.5: 50, 2: 75, 3: 100 };
    const progress = progressMap[step] || 25;

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
                            <h1 className={styles.stepTitle}>Qual a renda mensal de vocês?</h1>
                            <p className={styles.stepSubtitle}>Para projetarmos o futuro do casal.</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Sua Renda Líquida</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="R$ 0,00"
                                    value={userIncome}
                                    onChange={handleIncomeChange(setUserIncome)}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Renda do Cônjuge</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="R$ 0,00"
                                    value={partnerIncome}
                                    onChange={handleIncomeChange(setPartnerIncome)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1.5: Initial Balance */}
                {step === 1.5 && (
                    <div className={styles.stepContainer}>
                        <div className={styles.stepHeader}>
                            <div className="flex justify-center mb-4 text-emerald-500">
                                <DollarSign size={48} />
                            </div>
                            <h1 className={styles.stepTitle}>Quanto dinheiro vocês têm HOJE?</h1>
                            <p className={styles.stepSubtitle}>Some contas correntes, poupanças e investimentos.</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Total Acumulado</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="R$ 0,00"
                                    value={initialBalance}
                                    onChange={handleIncomeChange(setInitialBalance)}
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
                                    placeholder="Ex: Gabriel & Izadora"
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
                    {step !== 1 ? (
                        <button className={styles.btnBack} onClick={() => setStep(step === 1.5 ? 1 : (step === 2 ? 1.5 : 2))} disabled={loading}>
                            <ArrowLeft size={20} /> Voltar
                        </button>
                    ) : (
                        <div /> // Spacer
                    )}

                    <button className={styles.btnNext} onClick={handleNext} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                {step === 3 ? 'Finalizar' : 'Continuar'} <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
