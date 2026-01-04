import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export const useRealtime = (
    userId: string | null,
    callbacks: {
        onExpensesChange?: () => void;
        onInvestmentsChange?: () => void;
        onGoalsChange?: () => void;
        onInviteReceived?: (payload: any) => void;
    }
) => {
    const supabase = createClient();

    useEffect(() => {
        if (!userId) return;

        // Subscriptions
        const expensesSub = supabase
            .channel('expenses-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'expenses' },
                () => callbacks.onExpensesChange && callbacks.onExpensesChange()
            )
            .subscribe();

        const investmentsSub = supabase
            .channel('investments-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'investments' },
                () => callbacks.onInvestmentsChange && callbacks.onInvestmentsChange()
            )
            .subscribe();

        const goalsSub = supabase
            .channel('goals-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'goals' },
                () => callbacks.onGoalsChange && callbacks.onGoalsChange()
            )
            .subscribe();

        // Invites - specifically for this user's email would be ideal, 
        // but typically we can listen filtering by column if RLS allows, 
        // or just listen to all and filter in client (less secure/performant if high volume).
        // Better: listen to 'couple_invites' where 'to_email' matches user query? 
        // Realtime postgres_changes filter support is limited to simple equality usually.
        // We'll rely on the callback triggering a refresh or handling the payload.
        // Note: To filter by email in realtime, we need to know the email.
        // For now, let's subscribe to the table and rely on RLS or client-side check if possible,
        // OR just trigger a refresh of pending invites.

        // Actually, let's allow passing an email for the filter if we have it, 
        // but the hook arg is userId. We might need email.
        // For now, simpler approach: just refresh invites on any change to that table?
        // Or just rely on periodic refresh? Realtime is requested.

        const invitesSub = supabase
            .channel('couple-invites-changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'couple_invites' },
                (payload) => callbacks.onInviteReceived && callbacks.onInviteReceived(payload)
            )
            .subscribe();

        return () => {
            supabase.removeChannel(expensesSub);
            supabase.removeChannel(investmentsSub);
            supabase.removeChannel(goalsSub);
            supabase.removeChannel(invitesSub);
        };
    }, [userId, supabase, callbacks]);
};
