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
                        className="btn-gradient-primary flex items-center gap-2 px-6 py-3"
                    >
                        <Plus size={20} /> Nova Despesa
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
