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
    inviteSpouse: () => Promise<string | null>;
    joinCouple: (code: string) => Promise<boolean>;
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

    const inviteSpouse = async () => {
        if (!userId) return null;

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        try {
            // Delete any existing invites for this user to keep it clean
            await supabase.from('couple_invites').delete().eq('created_by', userId);

            const { error } = await supabase
                .from('couple_invites')
                .insert({
                    created_by: userId,
                    code: code,
                    status: 'pending'
                });

            if (error) throw error;
            return code;
        } catch (err) {
            console.error('Error creating invite:', err);
            return null;
        }
    };

    const joinCouple = async (code: string) => {
        if (!userId) return false;

        try {
            // 1. Verify code
            const { data: invite, error: inviteError } = await supabase
                .from('couple_invites')
                .select('*')
                .eq('code', code.toUpperCase())
                .single();

            if (inviteError || !invite) throw new Error('Código inválido ou expirado.');

            const partnerId = invite.created_by;

            if (partnerId === userId) throw new Error('Você não pode entrar no seu próprio convite.');

            // 2. Check if partner already has a couple
            const { data: partnerMember } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', partnerId)
                .single();

            let coupleId = partnerMember?.couple_id;

            // 3. Create couple if likely doesn't exist (or partner not in one)
            if (!coupleId) {
                const { data: newCouple, error: coupleError } = await supabase
                    .from('couples')
                    .insert({ name: 'Casal Milionário' }) // Use a default name, can be changed later
                    .select()
                    .single();

                if (coupleError) throw coupleError;
                coupleId = newCouple.id;

                // Add partner to couple
                await supabase.from('couple_members').insert({
                    couple_id: coupleId,
                    profile_id: partnerId,
                    role: 'admin'
                });

                // Update partner profile
                await supabase.from('profiles').update({ couple_id: coupleId }).eq('id', partnerId);
            }

            // 4. Add current user to couple
            const { error: joinError } = await supabase.from('couple_members').insert({
                couple_id: coupleId,
                profile_id: userId,
                role: 'admin' // Both admins for now
            });

            if (joinError) throw joinError;

            // 5. Update current user profile
            await supabase.from('profiles').update({ couple_id: coupleId }).eq('id', userId);

            // 6. Migrate Data (Expenses, Investments, Goals)
            // Update items where user_id is involved to have the couple_id
            await supabase.from('expenses').update({ couple_id: coupleId }).in('user_id', [userId, partnerId]);
            await supabase.from('investments').update({ couple_id: coupleId }).in('user_id', [userId, partnerId]);
            await supabase.from('financial_goals').update({ couple_id: coupleId }).in('couple_id', [userId, partnerId]); // Assuming goals might have been linked to user or holding id? 
            // Actually goals usually have couple_id. If they were null or user-specific, we update. 
            // If the schema for goals uses couple_id primarily, we just ensure it's set.

            // 7. Delete logic or mark accepted
            await supabase.from('couple_invites').update({ status: 'accepted' }).eq('id', invite.id);

            // Reload to refresh context
            window.location.reload();
            return true;
        } catch (err) {
            console.error('Error joining couple:', err);
            return false;
        }
    };

    return (
        <CoupleContext.Provider value={{ ...state, toggleViewMode, requestApproval, respondToApproval, refreshCoupleData, inviteSpouse, joinCouple }}>
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
