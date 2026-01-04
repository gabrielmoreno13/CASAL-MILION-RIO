'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './AddGoalModal.module.css';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: any;
}

export function AddGoalModal({ isOpen, onClose, onSuccess, user }: AddGoalModalProps) {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [current, setCurrent] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get Couple ID
            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (member) {
                const { error } = await supabase.from('financial_goals').insert({
                    couple_id: member.couple_id,
                    goal_type: name, // Using goal_type as name for now in this schema version
                    target_amount: parseFloat(target.replace(/[^0-9.]/g, '')),
                    current_amount: parseFloat(current.replace(/[^0-9.]/g, '') || '0'),
                    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() // Default 1 year
                });

                if (error) throw error;
                onSuccess();
                onClose();
                setName('');
                setTarget('');
                setCurrent('');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao criar meta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Nova Meta (Pote)</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Nome da Meta (Ex: Viagem, Carro)</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Valor Alvo (R$)</label>
                        <input
                            type="number"
                            required
                            value={target}
                            onChange={e => setTarget(e.target.value)}
                            className={styles.input}
                            placeholder="0,00"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Valor Já Guardado (R$)</label>
                        <input
                            type="number"
                            value={current}
                            onChange={e => setCurrent(e.target.value)}
                            className={styles.input}
                            placeholder="0,00"
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Criando...' : 'Criar Meta'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
