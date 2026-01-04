'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Home, Car, TrendingUp, DollarSign, ArrowUpCircle, ArrowDownCircle, PlusCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: any;
}

const CATEGORIES = [
    { id: 'INVESTMENT', label: 'Investimento', icon: TrendingUp },
    { id: 'HOME', label: 'Imóvel', icon: Home },
    { id: 'VEHICLE', label: 'Veículo', icon: Car },
    { id: 'OTHER', label: 'Outro', icon: DollarSign },
];

const OPERATION_TYPES = [
    { id: 'NEW', label: 'Novo Item', description: 'Carro, Casa, Ações...', icon: PlusCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/20' },
    { id: 'GAIN', label: 'Valorização', description: 'Lucros, Dividendos...', icon: ArrowUpCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/20' },
    { id: 'LOSS', label: 'Desvalorização', description: 'Perdas, Manutenção...', icon: ArrowDownCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/20' },
];

export function AddAssetModal({ isOpen, onClose, onSuccess, user }: AddAssetModalProps) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('INVESTMENT');
    const [operation, setOperation] = useState('NEW');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const supabase = createClient();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(formatCurrencyInput(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: member, error: memberError } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (memberError || !member) {
                throw new Error('Erro ao identificar casal.');
            }

            let numericValue = parseCurrencyInput(amount);
            if (isNaN(numericValue)) throw new Error('Valor inválido.');

            // Apply negative sign for Loss
            if (operation === 'LOSS') {
                numericValue = -Math.abs(numericValue);
            }

            const { error } = await supabase.from('assets').insert({
                couple_id: member.couple_id,
                name: name,
                type: category,
                value: numericValue,
                created_at: new Date(date).toISOString()
            });

            if (error) throw error;

            onSuccess();
            onClose();
            // Reset form
            setName('');
            setAmount('');
            setOperation('NEW');
        } catch (error: any) {
            console.error('Error saving asset:', error);
            alert(error.message || 'Erro ao salvar registro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
                    >
                        <div className="bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Registrar Patrimônio</h2>
                                    <p className="text-sm text-gray-400">Adicione bens ou registre a evolução</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Operation Type Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {OPERATION_TYPES.map((op) => (
                                        <button
                                            key={op.id}
                                            type="button"
                                            onClick={() => setOperation(op.id)}
                                            className={`relative p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 text-center group ${operation === op.id
                                                    ? `${op.bg} ${op.border} ring-1 ring-white/20`
                                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <op.icon size={24} className={operation === op.id ? op.color : 'text-gray-500 group-hover:text-gray-300'} />
                                            <div>
                                                <span className={`block text-xs font-bold ${operation === op.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                    {op.label}
                                                </span>
                                            </div>
                                            {operation === op.id && (
                                                <div className="absolute top-2 right-2 text-emerald-500">
                                                    <CheckCircle2 size={12} fill="currentColor" className="text-black" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Inputs */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Descrição do Ativo</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={operation === 'NEW' ? "Ex: Apartamento, BMW X1, Ações ITAUSA" : "Ex: Valorização do Imóvel, Dividendos..."}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">Valor</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                                                <input
                                                    type="text"
                                                    required
                                                    value={amount}
                                                    onChange={handleAmountChange}
                                                    placeholder="0,00"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">Data</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={e => setDate(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                                                />
                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Categoria</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setCategory(cat.id)}
                                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${category === cat.id
                                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                                        : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-gray-300'
                                                    }`}
                                            >
                                                <cat.icon size={20} />
                                                <span className="text-[10px] font-bold uppercase tracking-wide">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] btn-gradient-primary px-4 py-3 rounded-xl text-black font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle2 size={18} />
                                                Confirmar Registro
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
