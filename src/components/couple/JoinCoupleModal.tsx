'use client';

import { useState } from 'react';
import { X, ArrowRight, Loader2, HeartHandshake } from 'lucide-react';
import { useCouple } from '@/contexts/CoupleContext';
import { motion, AnimatePresence } from 'framer-motion';

interface JoinCoupleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function JoinCoupleModal({ isOpen, onClose }: JoinCoupleModalProps) {
    const { joinCouple } = useCouple();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (code.length < 6) {
            setError('Código inválido');
            return;
        }

        setLoading(true);
        const success = await joinCouple(code.toUpperCase());

        if (success) {
            onClose();
        } else {
            setError('Código inválido ou expirado. Verifique com seu parceiro(a).');
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#0F1115] border border-white/10 rounded-3xl p-6 w-full max-w-md relative z-10 overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                            <HeartHandshake size={32} className="text-purple-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Entrar no Time</h2>
                        <p className="text-gray-400 text-sm">
                            Insira o código enviado pelo seu parceiro(a) para conectar as contas.
                        </p>
                    </div>

                    <form onSubmit={handleJoin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Código de Convite</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="Digite o código (ex: AB12CD)"
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center tracking-widest text-lg focus:border-purple-500 focus:outline-none transition-colors"
                                maxLength={8}
                            />
                            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || code.length < 3}
                            className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Conectando...
                                </>
                            ) : (
                                <>
                                    Conectar Contas <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
