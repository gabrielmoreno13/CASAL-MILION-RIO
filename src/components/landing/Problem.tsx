'use client';

import { motion } from 'framer-motion';
import { Frown, AlertCircle, PieChart } from 'lucide-react';

export function Problem() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Por que 70% dos casais brigam por dinheiro?
                    </h2>
                    <p className="text-lg text-gray-600">
                        A falta de clareza e objetivos desalinhados são os maiores vilões do relacionamento.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Frown,
                            title: "Falta de Sincronia",
                            text: "Um usa planilha no Excel, o outro anota no caderno. No fim do mês, as contas nunca batem."
                        },
                        {
                            icon: AlertCircle,
                            title: "Gastos Invisíveis",
                            text: "Pequenas despesas individuais que somadas destroem a capacidade de poupança do casal."
                        },
                        {
                            icon: PieChart,
                            title: "Sem Metas Claras",
                            text: "Investir para quê? Sem um objetivo compartilhado (casa, viagem, aposentadoria), economizar se torna um sacrifício."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
