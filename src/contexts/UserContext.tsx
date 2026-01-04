'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useRealtime } from '@/hooks/useRealtime';

// Define types broadly for now to match structure
interface UserContextType {
    user: any;
    profile: any;
    expenses: any[];
    investments: any[];
    goals: any[];
    loading: boolean;
    refreshData: () => Promise<void>;
    updateProfile: (field: string, value: any) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Simple debounce implementation
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [investments, setInvestments] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUserState = useCallback(async (userId: string) => {
        setLoading(true);
        try {
            const [
                profileRes,
                expensesRes,
                investmentsRes,
                goalsRes
            ] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', userId).single(),
                supabase.from('expenses').select('*').order('date', { ascending: false }),
                supabase.from('investments').select('*'),
                supabase.from('goals').select('*')
            ]);

            if (profileRes.data) setProfile(profileRes.data);
            if (expensesRes.data) setExpenses(expensesRes.data);
            if (investmentsRes.data) setInvestments(investmentsRes.data);
            if (goalsRes.data) setGoals(goalsRes.data);

        } catch (error) {
            console.error('Error loading user state:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        const initUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                await loadUserState(user.id);
            } else {
                setLoading(false);
            }
        };
        initUser();
    }, [loadUserState, supabase.auth]);

    // Realtime subscriptions
    useRealtime(user?.id, {
        onExpensesChange: () => loadUserState(user.id),
        onInvestmentsChange: () => loadUserState(user.id),
        onGoalsChange: () => loadUserState(user.id),
        onInviteReceived: (payload) => {
            // Check if invite matches user email?
            if (profile?.email && payload.new?.to_email === profile.email) {
                // Trigger notification?
                console.log("New invite received!", payload);
                // We could refresh couple context here too, but UserContext is mainly focused on User data.
            }
        }
    });

    // Auto-save logic
    const saveProfileToDb = async (userId: string, field: string, value: any) => {
        try {
            await supabase.from('profiles').update({ [field]: value }).eq('id', userId);
            console.log('Auto-saved:', field);
        } catch (err) {
            console.error('Auto-save error:', err);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback(
        debounce((userId: string, field: string, value: any) => saveProfileToDb(userId, field, value), 1000),
        []
    );

    const updateProfile = async (field: string, value: any) => {
        // Optimistic update
        setProfile((prev: any) => ({ ...prev, [field]: value }));

        if (user?.id) {
            debouncedSave(user.id, field, value);
        }
    };

    const refreshData = async () => {
        if (user?.id) await loadUserState(user.id);
    };

    return (
        <UserContext.Provider value={{
            user,
            profile,
            expenses,
            investments,
            goals,
            loading,
            refreshData,
            updateProfile
        }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
