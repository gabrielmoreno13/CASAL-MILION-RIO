'use client';

import React from 'react';
import { X, Calendar, DollarSign, Tag, User } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';


interface Props {
    transaction: any;
    onClose: () => void;
}

export function TransactionModal({ transaction, onClose }: Props) {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#12141A] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white">Detalhes da Transação</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-1">
                        <span className="text-gray-400 font-bold text-lg">R$</span>
                        <span className="text-4xl font-bold text-white tracking-tight">{Math.abs(transaction.amount).toFixed(2)}</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-gray-400">
                                <Tag size={20} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</label>
                                <p className="text-white font-medium text-lg">{transaction.description}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-gray-400">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data</label>
                                <p className="text-white font-medium text-lg">{new Date(transaction.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-gray-400">
                                <User size={20} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Usuário</label>
                                <p className="text-white font-medium text-lg">Você</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/5 flex gap-3">
                    <button className="flex-1 py-3 px-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/5 transition-colors">
                        Editar
                    </button>
                    <button className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}
