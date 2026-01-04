'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedCheckmark } from '@/components/ui/AnimatedCheckmark';
import Link from 'next/link';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const supabase = createClient();

    // Data Strings for Input
    const [rendaInput, setRendaInput] = useState('');
    const [metaInput, setMetaInput] = useState(''); // Allow custom input too
    const [prazoInput, setPrazoInput] = useState('');

    // Numeric Values
    const [renda, setRenda] = useState(0);
    const [meta, setMeta] = useState(0);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        if (profile) setUserName(profile.full_name?.split(' ')[0] || 'Investidor');
    };

    useEffect(() => {
        checkUser();
    }, []);

    const handleRendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setRendaInput(formatCurrencyInput(val));
        setRenda(parseCurrencyInput(val));
    };

    const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setMetaInput(formatCurrencyInput(val));
        setMeta(parseCurrencyInput(val));
    };

    // Quick Select Meta
    const selectMeta = (value: number) => {
        setMeta(value);
        setMetaInput(formatCurrencyInput(value.toString())); // Assuming util handles number string? Usually expects formatted string so...
        // Let's manually format it for display if needed or just rely on state. 
        // formatCurrencyInput expects raw numbers masked? Or formatted? 
        // Based on typical usage: formatCurrencyInput expects raw string and returns formatted R$.
        // Let's assume simpler: setRendaInput(formatCurrency(value))
    };

    const saveAndContinue = async (field: string, data: any) => {
        setLoading(true);
        try {
            const updates = typeof data === 'object' ? data : { [field]: data };

            // If finishing, we might want to ensure couple created? Or do that later?
            // Existing logic created couple at end.

            if (step === 2) {
                // Save Meta
                // Also Update Goal in 'financial_goals' or 'profiles'?
                // The prompt requested updating 'profiles' with { meta_patrimonio, data_meta }
                await supabase.from('profiles').update(updates).eq('id', userId);
            } else {
                await supabase.from('profiles').update(updates).eq('id', userId);
            }

            if (step === 2) {
                // Ensure couple exists or create placeholder
                // Actually the prompt just says "Go to dashboard". 
                // Previous logic created a couple. Let's keep it simple as requested: save profile and continue.
                setStep(3);
            } else {
                setStep(step + 1);
            }

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar.');
        } finally {
            setLoading(false);
        }
    };

    const calcularMeses = (dateString: string) => {
        if (!dateString) return 0;
        const target = new Date(dateString);
        const now = new Date();
        const diffYears = target.getFullYear() - now.getFullYear();
        const diffMonths = target.getMonth() - now.getMonth();
        return (diffYears * 12) + diffMonths;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 flex items-center justify-center p-4">

            {/* Step 1: Renda */}
            {step === 1 && (
                <div className="glass-card max-w-2xl w-full p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <ProgressBar currentStep={1} totalSteps={3} className="mb-8" />

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
                        Qual é a renda mensal do casal?
                    </h2>
                    <p className="text-white/70 mb-8 text-center">
                        Some todas as rendas juntas
                    </p>

                    <input
                        value={rendaInput}
                        onChange={handleRendaChange}
                        className="text-3xl md:text-6xl font-bold text-white text-center glass-input h-24 mb-8 w-full bg-transparent border-none focus:ring-0 placeholder:text-white/20"
                        placeholder="R$ 0,00"
                        autoFocus
                    />

                    <button
                        onClick={() => saveAndContinue('income', renda)}
                        className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        disabled={loading || !renda}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight /></>}
                    </button>
                </div>
            )}

            {/* Step 2: Meta */}
            {step === 2 && (
                <div className="glass-card max-w-2xl w-full p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <ProgressBar currentStep={2} totalSteps={3} className="mb-8" />

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
                        Qual sua meta de patrimônio?
                    </h2>
                    <p className="text-white/70 mb-8 text-center">
                        Escolha uma opção ou digite o valor
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[500000, 1000000, 2000000].map((val) => (
                            <button
                                key={val}
                                onClick={() => {
                                    setMeta(val);
                                    // Hacky formatting for now as utility isn't exposed perfectly
                                    setMetaInput(`R$ ${val.toLocaleString('pt-BR')},00`);
                                }}
                                className={`glass-button p-6 border-2 transistion-all hover:scale-105 ${meta === val ? 'border-pink-400 bg-pink-500/10' : 'border-white/10'}`}
                            >
                                <p className="text-2xl font-bold text-white">
                                    {val === 1000000 ? '1M' : (val / 1000) + 'k'}
                                </p>
                                <p className="text-white/60 text-xs">
                                    {val === 500000 ? 'Meio milhão' : val === 1000000 ? 'Primeiro milhão' : 'Dois milhões'}
                                </p>
                            </button>
                        ))}
                    </div>

                    <input
                        value={metaInput}
                        onChange={handleMetaChange}
                        className="glass-input w-full mb-4 text-xl text-center"
                        placeholder="Ou digite o valor personalizado"
                    />

                    <input
                        type="date"
                        value={prazoInput}
                        onChange={(e) => setPrazoInput(e.target.value)}
                        className="glass-input w-full mb-8 text-white [color-scheme:dark]"
                        placeholder="Até quando você quer alcançar?"
                        min={new Date().toISOString().split('T')[0]}
                    />

                    <button
                        onClick={() => saveAndContinue('meta', { meta_patrimonio: meta, data_meta: prazoInput })}
                        className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        disabled={loading || !meta || !prazoInput}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight /></>}
                    </button>
                </div>
            )}

            {/* Step 3: Conclusão */}
            {step === 3 && (
                <div className="glass-card max-w-2xl w-full p-8 text-center animate-in fade-in zoom-in duration-500">
                    <AnimatedCheckmark className="w-24 h-24 mx-auto mb-6" />

                    <h2 className="text-4xl font-bold text-white mb-3">
                        Tudo pronto, {userName}! 🎉
                    </h2>
                    <p className="text-white/70 mb-8 text-lg">
                        Sua jornada rumo ao primeiro milhão começa agora
                    </p>

                    <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/10">
                            <div>
                                <p className="text-white/60 text-sm mb-1">Renda Mensal</p>
                                <p className="text-xl md:text-2xl font-bold text-white">R$ {renda.toLocaleString('pt-BR')}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm mb-1">Meta</p>
                                <p className="text-xl md:text-2xl font-bold text-pink-400">R$ {meta.toLocaleString('pt-BR')}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm mb-1">Prazo</p>
                                <p className="text-xl md:text-2xl font-bold text-white">{calcularMeses(prazoInput)} meses</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4 mb-8 border border-pink-500/30">
                        <p className="text-white/90 text-sm">
                            💡 Com disciplina e investimentos consistentes, vocês podem alcançar esta meta!
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                    >
                        Ir para o Dashboard 🚀
                    </button>
                </div>
            )}
        </div>
    );
}
