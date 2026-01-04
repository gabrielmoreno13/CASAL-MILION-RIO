'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Home, Car, Plane, Heart, Baby, GraduationCap, Umbrella, Smartphone, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: any;
}

const SUGGESTED_GOALS = [
    { name: 'Casa Própria', value: 300000, icon: Home, color: 'from-blue-500 to-cyan-500' },
    { name: 'Carro Novo', value: 80000, icon: Car, color: 'from-orange-500 to-red-500' },
    { name: 'Viagem Internacional', value: 15000, icon: Plane, color: 'from-purple-500 to-pink-500' },
    { name: 'Casamento', value: 50000, icon: Heart, color: 'from-red-500 to-pink-500' },
    { name: 'Educação dos Filhos', value: 200000, icon: Baby, color: 'from-yellow-400 to-orange-500' },
    { name: 'Pós-Graduação', value: 30000, icon: GraduationCap, color: 'from-indigo-500 to-blue-500' },
    { name: 'Aposentadoria', value: 1000000, icon: Umbrella, color: 'from-green-500 to-emerald-500' },
    { name: 'Reserva de Emergência', value: 30000, icon: Trophy, color: 'from-emerald-400 to-green-500' }, // Trophy as generic safe/win
    { name: 'Upgrade Tech', value: 10000, icon: Smartphone, color: 'from-gray-500 to-slate-500' },
];

export function AddGoalModal({ isOpen, onClose, onSuccess, user }: AddGoalModalProps) {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [current, setCurrent] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
    const supabase = createClient();

    const handleSuggestionClick = (suggestion: typeof SUGGESTED_GOALS[0]) => {
        setName(suggestion.name);
        setTarget(suggestion.value.toString());
        setSelectedSuggestion(suggestion.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (member) {
                const { error } = await supabase.from('goals').insert({
                    couple_id: member.couple_id,
                    title: name,
                    target_amount: parseFloat(target.toString().replace(/[^0-9.]/g, '')),
                    current_amount: parseFloat(current.toString().replace(/[^0-9.]/g, '') || '0'),
                    target_date: date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                    icon: selectedSuggestion ? '🎯' : '💰', // Simplified icon logic for now
                    category: 'custom'
                });

                if (error) throw error;
                onSuccess();
                onClose();
                setName('');
                setTarget('');
                setCurrent('');
                setDate('');
                setSelectedSuggestion(null);
            }
        } catch (error: any) {
            console.error(error);
            alert('Erro ao criar meta.');
        } finally {
            setLoading(false);
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
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-4xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                >
                    {/* Left Side: Suggestions */}
                    <div className="w-full md:w-1/3 bg-[#13151A] border-r border-white/5 p-6 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Sugestões Populares</h3>
                        <div className="space-y-3">
                            {SUGGESTED_GOALS.map((goal) => (
                                <button
                                    key={goal.name}
                                    type="button"
                                    onClick={() => handleSuggestionClick(goal)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedSuggestion === goal.name
                                            ? 'bg-emerald-500/10 border-emerald-500/50'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${goal.color} text-white`}>
                                        <goal.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{goal.name}</p>
                                        <p className="text-xs text-gray-400">R$ {goal.value.toLocaleString('pt-BR')}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Criar Nova Meta</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Meta</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="Ex: Minha Casa Nova"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Valor Alvo (R$)</label>
                                    <input
                                        type="number"
                                        required
                                        value={target}
                                        onChange={e => setTarget(e.target.value)}
                                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="0,00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Já Guardado (R$)</label>
                                    <input
                                        type="number"
                                        value={current}
                                        onChange={e => setCurrent(e.target.value)}
                                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Prazo (Opcional)</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors bg-opacity-100" // Ensure calendar icon is visible/usable
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Criando...' : 'Criar Meta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
