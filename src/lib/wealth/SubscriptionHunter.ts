export interface SubscriptionCandidate {
    name: string;
    amount: number;
    frequency: 'Monthly' | 'Weekly';
    confidence: 'High' | 'Medium' | 'Low';
    lastDate: string;
}

export class SubscriptionHunter {
    static analyze(expenses: any[]): SubscriptionCandidate[] {
        if (!expenses || expenses.length === 0) return [];

        // Group by normalized description
        const groups: { [key: string]: any[] } = {};

        expenses.forEach(exp => {
            // Simple normalization: lowercase, remove numbers (often used for transaction IDs), trim
            const key = exp.description.toLowerCase().replace(/[0-9]/g, '').trim();
            if (!groups[key]) groups[key] = [];
            groups[key].push(exp);
        });

        const candidates: SubscriptionCandidate[] = [];

        Object.keys(groups).forEach(key => {
            const group = groups[key];
            if (group.length >= 2) {
                // Sort by date desc
                group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const newest = group[0];
                const amount = newest.amount; // Use most recent amount

                // Calculate average days between transactions to guess frequency
                // For MVP, if there are >= 2 transactions roughly 25-35 days apart, it's monthly.

                // Simplified Logic: If Description contains keywords OR appears > 2 times with similar amount
                const isStreaming = ['netflix', 'spotify', 'amazon', 'disney', 'hbo', 'apple', 'youtube'].some(k => key.includes(k));
                const isService = ['uber', 'ifood', 'gym', 'smart fit', 'academia'].some(k => key.includes(k));

                if (isStreaming || (group.length >= 2 && !isService)) {
                    candidates.push({
                        name: newest.description,
                        amount: amount,
                        frequency: 'Monthly',
                        confidence: isStreaming ? 'High' : 'Medium',
                        lastDate: newest.date
                    });
                }
            }
        });

        return candidates;
    }
}
