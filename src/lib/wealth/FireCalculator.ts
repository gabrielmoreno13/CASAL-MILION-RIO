export class FireCalculator {
    /**
     * Calcula o tempo para atingir a Independência Financeira.
     * @param currentNetWorth Patrimônio Líquido Atual (R$)
     * @param monthlySavings Aporte Mensal (R$)
     * @param monthlyExpenses Gasto Mensal (Estilo de Vida) (R$)
     * @param annualReturnRate Taxa de Retorno Anual (Ex: 0.10 para 10% CDI)
     * @param inflationRate Taxa de Inflação Anual (Ex: 0.04 para 4% IPCA)
     * @returns Objeto com datas e valores projetados
     */
    static calculateTimeToFire(
        currentNetWorth: number,
        monthlySavings: number,
        monthlyExpenses: number,
        annualReturnRate: number = 0.10, // 10% CDI Padrão
        inflationRate: number = 0.045 // 4.5% IPCA Padrão
    ) {
        // Regra dos 4% (Safe Withdrawal Rate) -> Meta = Gasto Anual / 0.04
        // Ou Meta = Gasto Mensal * 300
        const annualExpenses = monthlyExpenses * 12;
        const fireNumber = annualExpenses * 25; // Target (R$ 1M para 40k/ano)

        // Taxa Real Mensal
        const realAnnualReturn = (1 + annualReturnRate) / (1 + inflationRate) - 1;
        const realMonthlyReturn = Math.pow(1 + realAnnualReturn, 1 / 12) - 1;

        let months = 0;
        let accumulator = currentNetWorth;
        const projection = [];

        // Simulação mês a mês
        // Limitado a 50 anos (600 meses) para evitar loop infinito
        while (accumulator < fireNumber && months < 600) {
            accumulator = accumulator * (1 + realMonthlyReturn) + monthlySavings;
            months++;

            // Gravar snapshots anuais para gráfico
            if (months % 12 === 0) {
                projection.push({
                    year: Math.floor(months / 12),
                    amount: accumulator
                });
            }
        }

        const today = new Date();
        const fireDate = new Date(today.setMonth(today.getMonth() + months));

        return {
            monthsToFire: months,
            fireDate: fireDate,
            fireNumber: fireNumber,
            isAchievable: months < 600,
            projection
        };
    }
}
