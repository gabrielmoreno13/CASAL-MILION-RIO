'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

// --- Types ---

export interface PartnerData {
    id: string;
    name: string;
    avatar_url?: string;
    monthlyContribution: number;
    expenses: number; // Current month expenses
    investments: number; // Current month investments
}

export interface Approval {
    id: string;
    requestedBy: string; // user id
    amount: number;
    category: string;
    description: string;
    timestamp: string;
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
}

export interface CoupleState {
    coupleId: string | null;
    partner1: PartnerData | null;
    partner2: PartnerData | null;
    viewMode: 'individual' | 'couple';
    pendingApprovals: Approval[];
    isLoading: boolean;
}

interface CoupleContextType extends CoupleState {
    toggleViewMode: () => void;
    requestApproval: (amount: number, category: string, description: string) => Promise<void>;
    respondToApproval: (approvalId: string, status: 'approved' | 'rejected', comment?: string) => Promise<void>;
    refreshCoupleData: () => Promise<void>;
}

// --- Context ---

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export function CoupleProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const [state, setState] = useState<CoupleState>({
        coupleId: null,
        partner1: null,
        partner2: null,
        viewMode: 'couple', // Default to couple view? Or individual? Prompt says "Visão Geral [Individual | Casal]"
        pendingApprovals: [],
        isLoading: true
    });

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Initial Fetch
        async function fetchUserAndCouple() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setState(prev => ({ ...prev, isLoading: false }));
                return;
            }
            setUserId(user.id);

            // Fetch Couple Link
            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (member) {
                // Fetch both members of the couple
                const { data: members } = await supabase
                    .from('couple_members')
                    .select(`
                        profile_id,
                        profiles:profile_id (
                            id,
                            full_name,
                            avatar_url,
                            income
                        )
                    `)
                    .eq('couple_id', member.couple_id);

                // Fetch calculations (mocked for now or simplistic query)
                // In a real app we would exclude internal transfers etc.

                const p1Data: any = members && members[0] ? members[0].profiles : null;
                const p2Data: any = members && members[1] ? members[1].profiles : null;

                // MOCK DATA for Phase 2 demo as we might not have real transactions for both users yet
                const mockP1 = p1Data ? {
                    id: p1Data.id || p1Data[0]?.id,
                    name: p1Data.full_name || p1Data[0]?.full_name || 'Parceiro 1',
                    avatar_url: p1Data.avatar_url || p1Data[0]?.avatar_url,
                    monthlyContribution: p1Data.income || p1Data[0]?.income || 0,
                    expenses: 4560,  // Mock from prompt
                    investments: 1140 // Mock from prompt
                } : null;

                const mockP2 = p2Data ? {
                    id: p2Data.id || p2Data[0]?.id,
                    name: p2Data.full_name || p2Data[0]?.full_name || 'Parceiro 2',
                    avatar_url: p2Data.avatar_url || p2Data[0]?.avatar_url,
                    monthlyContribution: p2Data.income || p2Data[0]?.income || 0, // Mock from prompt example was R$ 4.300
                    expenses: 3440,
                    investments: 860
                } : null;

                setState(prev => ({
                    ...prev,
                    coupleId: member.couple_id,
                    partner1: mockP1,
                    partner2: mockP2,
                    isLoading: false
                }));
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        }

        fetchUserAndCouple();
    }, []);

    const toggleViewMode = () => {
        setState(prev => ({
            ...prev,
            viewMode: prev.viewMode === 'individual' ? 'couple' : 'individual'
        }));
    };

    const requestApproval = async (amount: number, category: string, description: string) => {
        // In real app, insert into 'approvals' table
        const newApproval: Approval = {
            id: Math.random().toString(36).substr(2, 9),
            requestedBy: userId!,
            amount,
            category,
            description,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        setState(prev => ({
            ...prev,
            pendingApprovals: [...prev.pendingApprovals, newApproval]
        }));

        // alert("Solicitação de aprovação enviada!");
    };

    const respondToApproval = async (approvalId: string, status: 'approved' | 'rejected', comment?: string) => {
        setState(prev => ({
            ...prev,
            pendingApprovals: prev.pendingApprovals.map(app =>
                app.id === approvalId
                    ? { ...app, status, comment }
                    : app
            ).filter(app => app.status === 'pending') // Remove if handled? Or keep history?
            // Prompt says: "Histórico de aprovações em Configurações". 
            // For context logic, maybe just update status.
        }));
    };

    const refreshCoupleData = async () => {
        // Re-fetch logic
    };

    return (
        <CoupleContext.Provider value={{ ...state, toggleViewMode, requestApproval, respondToApproval, refreshCoupleData }}>
            {children}
        </CoupleContext.Provider>
    );
}

export const useCouple = () => {
    const context = useContext(CoupleContext);
    if (!context) {
        throw new Error('useCouple must be used within a CoupleProvider');
    }
    return context;
};
