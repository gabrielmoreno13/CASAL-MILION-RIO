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
    const [partnerRendaInput, setPartnerRendaInput] = useState('');
    const [metaInput, setMetaInput] = useState('');
    const [prazoInput, setPrazoInput] = useState('');

    // Numeric Values
    const [userRenda, setUserRenda] = useState(0);
    const [partnerRenda, setPartnerRenda] = useState(0);
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

    const handleUserRendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setRendaInput(formatCurrencyInput(val));
        setUserRenda(parseCurrencyInput(val));
    };

    const handlePartnerRendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPartnerRendaInput(formatCurrencyInput(val));
        setPartnerRenda(parseCurrencyInput(val));
    };

    const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setMetaInput(formatCurrencyInput(val));
        setMeta(parseCurrencyInput(val));
    };

    // Total Income Calculation
    const totalRenda = userRenda + partnerRenda;

    const handleContinue = async (currentStep: number) => {
        setLoading(true);
        try {
            // Step 1: User Income (Just local state or save?)
            // We'll save just local state for now until Step 2 completes total income
            if (currentStep === 1) {
                setStep(2);
                setLoading(false);
                return;
            }

            // Step 2: Partner Income -> Save Total Income
            if (currentStep === 2) {
                await supabase.from('profiles').update({ income: totalRenda }).eq('id', userId);
                setStep(3);
                setLoading(false);
                return;
            }

            // Step 3: Meta -> Save Meta
            if (currentStep === 3) {
                await supabase.from('profiles').update({
                    meta_patrimonio: meta,
                    data_meta: prazoInput
                }).eq('id', userId);
                setStep(4);
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

            {/* Step 1: User Renda */}
            {step === 1 && (
                <div className="glass-card max-w-2xl w-full p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <ProgressBar currentStep={1} totalSteps={4} className="mb-8" />

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
                        Qual é a <span className="text-emerald-400">sua</span> renda mensal?
                    </h2>
                    <p className="text-white/70 mb-8 text-center">
                        Seu salário ou ganhos mensais aproximados
                    </p>

                    <input
                        value={rendaInput}
                        onChange={handleUserRendaChange}
                        className="text-3xl md:text-6xl font-bold text-white text-center glass-input h-24 mb-8 w-full bg-transparent border-none focus:ring-0 placeholder:text-white/20"
                        placeholder="R$ 0,00"
                        autoFocus
                    />

                    <button
                        onClick={() => handleContinue(1)}
                        className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        disabled={loading || !userRenda}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight /></>}
                    </button>
                </div>
            )}

            {/* Step 2: Partner Renda */}
            {step === 2 && (
                <div className="glass-card max-w-2xl w-full p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <ProgressBar currentStep={2} totalSteps={4} className="mb-8" />

                    <button
                        onClick={() => setStep(1)}
                        className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowLeft />
                    </button>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
                        E a renda do seu <span className="text-pink-400">amor</span>?
                    </h2>
                    <p className="text-white/70 mb-8 text-center">
                        Se não tiver ou não souber agora, pode deixar zerado
                    </p>

                    <input
                        value={partnerRendaInput}
                        onChange={handlePartnerRendaChange}
                        className="text-3xl md:text-6xl font-bold text-white text-center glass-input h-24 mb-8 w-full bg-transparent border-none focus:ring-0 placeholder:text-white/20"
                        placeholder="R$ 0,00"
                        autoFocus
                    />

                    <div className="space-y-4">
                        <button
                            onClick={() => handleContinue(2)}
                            className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Somar Rendas <ArrowRight /></>}
                        </button>

                        {!partnerRenda && (
                            <button
                                onClick={() => handleContinue(2)}
                                className="w-full text-white/50 hover:text-white py-2 text-sm transition-colors"
                            >
                                Pular / Não tenho parceiro(a)
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Step 3: Meta */}
            {step === 3 && (
                <div className="glass-card max-w-2xl w-full p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <ProgressBar currentStep={3} totalSteps={4} className="mb-8" />

                    <button
                        onClick={() => setStep(2)}
                        className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowLeft />
                    </button>

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
                        onClick={() => handleContinue(3)}
                        className="btn-gradient-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        disabled={loading || !meta || !prazoInput}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight /></>}
                    </button>
                </div>
            )}

            {/* Step 4: Conclusão */}
            {step === 4 && (
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
                                <p className="text-white/60 text-sm mb-1">Renda Casal</p>
                                <p className="text-xl md:text-2xl font-bold text-white">R$ {totalRenda.toLocaleString('pt-BR')}</p>
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
