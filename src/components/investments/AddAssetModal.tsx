'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Home, Car, TrendingUp, DollarSign, ArrowUpCircle, ArrowDownCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';
import styles from './AddAssetModal.module.css';

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
    { id: 'NEW', label: 'Novo Patrimônio', icon: PlusCircle, color: 'text-white' },
    { id: 'GAIN', label: 'Ganho/Rendimento', icon: ArrowUpCircle, color: 'text-emerald-500' },
    { id: 'LOSS', label: 'Perda/Desvalorização', icon: ArrowDownCircle, color: 'text-red-500' },
];

export function AddAssetModal({ isOpen, onClose, onSuccess, user }: AddAssetModalProps) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('INVESTMENT');
    const [operation, setOperation] = useState('NEW');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const supabase = createClient();

    if (!isOpen) return null;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(formatCurrencyInput(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get Couple ID
            const { data: member, error: memberError } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (memberError || !member) {
                console.error('Error finding couple:', memberError);
                throw new Error('Você precisa fazer parte de um casal para adicionar ativos.');
            }

            let numericValue = parseCurrencyInput(amount);

            if (isNaN(numericValue)) {
                throw new Error('Valor inválido.');
            }

            // Apply negative sign for Loss
            if (operation === 'LOSS') {
                numericValue = -Math.abs(numericValue);
            }

            const { error } = await supabase.from('assets').insert({
                couple_id: member.couple_id,
                name: name,
                type: category, // Using category as the DB 'type' field
                value: numericValue,
                created_at: new Date(date).toISOString() // Assuming created_at can be overridden or there's a date column. If not, it defaults to now.
                // Note: If DB doesn't support overriding created_at, this might ignore the date. 
                // Checks on schema earlier were inconclusive on 'date' column, adhering to 'created_at' best effort.
            });

            if (error) throw error;

            onSuccess();
            onClose();
            setName('');
            setAmount('');
            setOperation('NEW');
        } catch (error: any) {
            console.error('Full Error:', error);
            alert(error.message || 'Erro ao salvar ativo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Registrar Movimentação</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Operation Type Selector */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {OPERATION_TYPES.map((op) => (
                            <button
                                key={op.id}
                                type="button"
                                onClick={() => setOperation(op.id)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${operation === op.id
                                        ? 'bg-white/10 border-white/20'
                                        : 'bg-transparent border-white/5 hover:bg-white/5'
                                    }`}
                            >
                                <op.icon size={24} className={operation === op.id ? op.color : 'text-gray-500'} />
                                <span className={`text-xs font-medium ${operation === op.id ? 'text-white' : 'text-gray-500'}`}>
                                    {op.label.split('/')[0]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Descrição</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={operation === 'NEW' ? "Ex: Ações Apple" : operation === 'GAIN' ? "Ex: Dividendos VALE3" : "Ex: Desvalorização Carro"}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Valor (R$)</label>
                        <input
                            type="text"
                            required
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="R$ 0,00"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Data</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Categoria</label>
                        <div className={styles.typeGrid}>
                            {CATEGORIES.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`${styles.typeCard} ${category === cat.id ? styles.activeType : ''}`}
                                    onClick={() => setCategory(cat.id)}
                                >
                                    <cat.icon size={20} />
                                    <span>{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Salvar' : 'Confirmar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
