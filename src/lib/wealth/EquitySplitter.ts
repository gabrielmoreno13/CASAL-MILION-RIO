export class EquitySplitter {
    /**
     * Calcula a divisão justa de uma conta baseada na renda do casal.
     * @param amount Valor da conta (R$)
     * @param userIncome Renda do Usuário A (R$)
     * @param partnerIncome Renda do Usuário B (R$)
     */
    static splitExpense(amount: number, userIncome: number, partnerIncome: number) {
        const totalIncome = userIncome + partnerIncome;

        if (totalIncome === 0) {
            // Fallback para 50/50 se não houver renda cadastrada
            return {
                userShare: amount / 2,
                partnerShare: amount / 2,
                userPercentage: 50,
                partnerPercentage: 50
            };
        }

        const userRatio = userIncome / totalIncome;
        const partnerRatio = partnerIncome / totalIncome;

        return {
            userShare: amount * userRatio,
            partnerShare: amount * partnerRatio,
            userPercentage: (userRatio * 100).toFixed(1),
            partnerPercentage: (partnerRatio * 100).toFixed(1)
        };
    }
}
