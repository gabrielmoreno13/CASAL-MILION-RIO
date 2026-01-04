'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    {
        q: "Preciso conectar minha conta bancária (Open Finance)?",
        a: "Não obrigatóriamente! Você pode usar o modo manual, mas a conexão automática facilita muito o rastreamento."
    },
    {
        q: "Meu parceiro(a) precisa pagar também?",
        a: "Não! Uma assinatura Pro cobre as DUAS contas. Vocês vinculam os perfis e compartilham os benefícios."
    },
    {
        q: "Meus dados estão seguros?",
        a: "Absolutamente. Usamos criptografia de ponta a ponta e não vendemos seus dados para terceiros. Sua privacidade é nossa prioridade."
    },
    {
        q: "Funciona para quem não é casado?",
        a: "Sim! Namorados, noivos ou morando junto. Se vocês têm contas ou objetivos em comum, o app é para vocês."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Dúvidas Frequentes
                    </h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex justify-between items-center p-6 text-left bg-white"
                            >
                                <span className="font-semibold text-gray-900">{faq.q}</span>
                                {openIndex === i ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-gray-50"
                                    >
                                        <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
