'use client';

import { useState } from 'react';
import { X, Copy, Check, Heart, Shield } from 'lucide-react';
import { useCouple } from '@/contexts/CoupleContext';
import { motion, AnimatePresence } from 'framer-motion';

interface InviteSpouseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteSpouseModal({ isOpen, onClose }: InviteSpouseModalProps) {
    const { inviteSpouse } = useCouple();
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        const code = await inviteSpouse();
        setInviteCode(code);
        setLoading(false);
    };

    const copyToClipboard = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
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
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <Heart size={32} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Convidar Parceiro(a)</h2>
                        <p className="text-gray-400 text-sm">
                            Compartilhe suas finanças e conquiste a liberdade financeira juntos. Totalmente seguro e privado.
                        </p>
                    </div>

                    {!inviteCode ? (
                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                                <Shield className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                                <div className="text-xs text-gray-400">
                                    <strong className="text-white block mb-1">Privacidade Garantida</strong>
                                    Seus dados são criptografados de ponta a ponta. Você controla o que compartilha.
                                </div>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Gerando...' : 'Gerar Código de Convite'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-center relative max-w-[280px] mx-auto">
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">SEU CÓDIGO</div>
                                <div className="text-4xl font-mono font-bold text-emerald-400 tracking-wider">
                                    {inviteCode}
                                </div>
                            </div>

                            <p className="text-center text-xs text-gray-500">
                                Envie este código para seu parceiro(a). Este código expira em 24 horas.
                            </p>

                            <button
                                onClick={copyToClipboard}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check size={18} className="text-emerald-500" />
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={18} />
                                        Copiar Código
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
