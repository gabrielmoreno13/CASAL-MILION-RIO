'use client';

import { useCouple, Approval } from '@/contexts/CoupleContext';
import { Check, X, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';


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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#12141A] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col items-center text-center p-8 animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20">
                    <AlertTriangle size={32} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Aprovação Necessária</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    Seu parceiro solicitou a aprovação de uma despesa que excede o limite combinado.
                </p>

                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                    {formatCurrency(approval.amount)}
                </div>

                <p className="text-sm text-gray-500 mb-8 font-medium bg-white/5 px-4 py-2 rounded-lg">
                    {approval.description} <span className="opacity-50">•</span> {approval.category}
                </p>

                <input
                    type="text"
                    placeholder="Adicionar comentário (opcional)"
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors mb-6"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />

                <div className="flex gap-3 w-full">
                    <button
                        className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors flex items-center justify-center gap-2"
                        onClick={() => handleAction('rejected')}
                    >
                        <X size={18} /> Rejeitar
                    </button>
                    <button
                        className="flex-1 py-3 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        onClick={() => handleAction('approved')}
                    >
                        <Check size={18} /> Aprovar
                    </button>
                </div>
            </div>
        </div>
    );
}
