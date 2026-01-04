import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define strict validation schema
const ChatRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
    })).min(1, "É preciso enviar pelo menos uma mensagem"),
    context: z.object({
        name: z.string().optional().default("Usuário"),
        level: z.string().optional(),
        netWorth: z.number().optional(),
        income: z.number().optional()
    }).optional()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate inputs using Zod
        const result = ChatRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: result.error.format() },
                { status: 400 }
            );
        }

        const { messages, context } = result.data;

        // Check if we have an API Key (Simulated check)
        const apiKey = process.env.GEMINI_API_KEY;

        const lastMessage = messages[messages.length - 1];
        const userPrompt = lastMessage.content;

        // Construct System Prompt with Context
        const systemPrompt = `
            Você é o "Mestre de Finanças" do app Casal Milionário.
            Você é um consultor financeiro sábio, paciente e focado na metodologia "Profit First" e "Investimento Reverso".
            
            CONTEXTO DO USUÁRIO:
            - Nome: ${context?.name}
            - Nível de Gamificação: ${context?.level || 'Iniciante'}
            - Patrimônio Total: ${context?.netWorth || 'Não informado'}
            - Renda Mensal: ${context?.income || 'Não informado'}
            
            SEU ESTILO:
            - Use emojis moderadamente.
            - Seja direto, mas motivador.
            - Sempre tente relacionar a resposta com o objetivo de "Construir o Primeiro Milhão".
            - Se o usuário perguntar sobre compras supérfluas, lembre-o da meta de investimento.
        `;

        // If no API key, return a simulated intelligent response
        if (!apiKey) {
            console.log('No GEMINI_API_KEY found. Returning mock response.');

            let mockResponse = "Estou processando seus dados... ";
            const lowerPrompt = userPrompt.toLowerCase();

            if (lowerPrompt.includes('investir') || lowerPrompt.includes('investimento')) {
                mockResponse = `Ótima iniciativa, ${context?.name}! Para começar a investir, lembre-se da regra de ouro: pague-se primeiro. Separe pelo menos 20% da sua renda assim que ela cair na conta. Como está sua reserva de emergência?`;
            } else if (lowerPrompt.includes('divida') || lowerPrompt.includes('dívida')) {
                mockResponse = "Dívidas são como âncoras. Vamos priorizar as de juros mais altos (como cartão de crédito). Liste todas elas para mim, vamos criar um plano de ataque!";
            } else if (lowerPrompt.includes('viagem') || lowerPrompt.includes('comprar')) {
                mockResponse = "Ótimo objetivo! Mas antes, verifique seu 'Custo por Dia' no dashboard. Essa compra cabe no seu orçamento diário sem comprometer seu futuro?";
            } else {
                mockResponse = `Como seu Mestre Financeiro, estou aqui para ajudar ${context?.name} a atingir o milhão. Qual sua maior dúvida sobre dinheiro hoje?`;
            }

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            return NextResponse.json({
                role: 'assistant',
                content: mockResponse
            });
        }

        // REAL GEMINI IMPLEMENTATION (Commented out for safety until key is present)
        /*
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\nUser: " + userPrompt }] }]
            })
        });
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        return NextResponse.json({ role: 'assistant', content: text });
        */

        return NextResponse.json({ role: 'assistant', content: "Erro na configuração da IA. Verifique a API Key." });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
