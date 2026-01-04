'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { DashboardOverview } from '@/components/dashboard/Overview';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';
import { createClient } from '@/lib/supabase';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    return (
        <>
            <Header
                title="Visão Geral"
                action={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--primary)',
                            color: 'var(--text-primary)',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <Plus size={18} /> Nova Despesa
                    </button>
                }
            />

            <DashboardOverview key={refreshTrigger} />

            {user && (
                <AddExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                    user={user}
                />
            )}
        </>
    );
}
