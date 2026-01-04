'use client';
import { X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-[#0F1115] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-[50px] pointer-events-none" />

                    <div className="flex justify-end mb-4">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 mb-4">
                            <MessageCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Inteligente</h2>
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white mb-4">
                            EM BREVE
                        </span>
                        <p className="text-gray-400 leading-relaxed">
                            Em breve, você poderá registrar despesas, consultar saldo e receber alertas diretamente pelo WhatsApp!
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5 text-left">
                        <h3 className="text-white font-medium mb-2 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            O que vem por aí:
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                                <span>💬</span>
                                <span>"Gastei R$ 50 no Uber" → Registra automático</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>📊</span>
                                <span>Resumo semanal no seu chat</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>🔔</span>
                                <span>Lembretes de contas a pagar</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10"
                    >
                        Avise-me quando lançar
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
