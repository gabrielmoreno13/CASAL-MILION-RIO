'use client';

import { useCouple, Approval } from '@/contexts/CoupleContext';
import { Check, X, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import styles from './ApprovalModal.module.css';

interface Props {
    approval: Approval;
    onClose: () => void;
}

export function ApprovalModal({ approval, onClose }: Props) {
    const { respondToApproval } = useCouple();
    const [comment, setComment] = useState('');

    const handleAction = async (status: 'approved' | 'rejected') => {
        await respondToApproval(approval.id, status, comment);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.icon}>
                    <AlertTriangle size={24} />
                </div>

                <h2 className={styles.title}>Aprovação Necessária</h2>
                <p className={styles.description}>
                    Seu parceiro solicitou a aprovação de uma despesa que excede o limite combinado.
                </p>

                <div className={styles.amount}>
                    {formatCurrency(approval.amount)}
                </div>

                <p className="text-sm text-gray-500 text-center mb-4">
                    {approval.description} ({approval.category})
                </p>

                <input
                    type="text"
                    placeholder="Adicionar comentário (opcional)"
                    className={styles.input}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />

                <div className={styles.actions}>
                    <button className={styles.rejectBtn} onClick={() => handleAction('rejected')}>
                        <X size={18} /> Rejeitar
                    </button>
                    <button className={styles.approveBtn} onClick={() => handleAction('approved')}>
                        <Check size={18} /> Aprovar
                    </button>
                </div>
            </div>
        </div>
    );
}
