'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, HeartHandshake, Lock } from 'lucide-react';
import Image from 'next/image';

export function Features() {
    return (
        <section id="features" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Feature 1: Gamification */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wide mb-6">
                            <Target size={14} />
                            Gamificação
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Transforme poupar em um jogo viciante.
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Subam de nível, mantenham "streaks" de investimento e desbloqueiem conquistas juntos. Tornamos a disciplina financeira algo divertido.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Sistema de XP baseado em economia real",
                                "Conquistas para marcos de patrimônio",
                                "Streaks mensais de investimento"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        ✓
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <div className="lg:w-1/2 relative">
                        {/* Abstract visual for gamification */}
                        <div className="bg-gradient-to-br from-orange-100 to-yellow-50 rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl border border-orange-100/50">
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Nível Atual</p>
                                        <h4 className="text-2xl font-bold text-gray-900">Mestres da Poupança</h4>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">🏆</div>
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-orange-500 w-[75%]"></div>
                                </div>
                                <p className="text-xs text-gray-500 text-right">3.450 / 5.000 XP</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 2: Sync */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-6">
                            <HeartHandshake size={14} />
                            Sincronia Total
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Dois usuários, um patrimônio.
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Visualize o progresso individual e do casal em uma única tela. Defina quanto cada um contribui e mantenha a transparência (com privacidade opcional).
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Visão unificada de Net Worth",
                                "Contribuição Proporcional Inteligente",
                                "Modo Privacidade para gastos pessoais"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        ✓
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <div className="lg:w-1/2 relative">
                        <div className="bg-gradient-to-bl from-blue-100 to-indigo-50 rounded-3xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl border border-blue-100/50">
                            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div className="flex -space-x-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"></div>
                                        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-600">+ R$ 4.200 (Total)</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Ele</span>
                                        <span className="font-bold">60%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[60%]"></div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Ela</span>
                                        <span className="font-bold">40%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[40%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 3: Investment First */}
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wide mb-6">
                            <TrendingUp size={14} />
                            Metodologia Profit First
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Pague-se primeiro. Gaste o resto.
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Nossa engine "Investment-First" calcula quanto você pode gastar por dia APÓS garantir sua meta de investimento mensal. Nunca mais falhe na sua meta.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Cálculo de 'Safe-to-Spend' diário",
                                "Projeção automática de FIRE (Independência Financeira)",
                                "Alertas inteligentes de desvio de meta"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        ✓
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <div className="lg:w-1/2 relative">
                        <div className="bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-3xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl border border-emerald-100/50">
                            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                                <p className="text-sm text-gray-500 mb-2">Disponível para Gastar Hoje</p>
                                <h3 className="text-4xl font-extrabold text-gray-900 mb-4">R$ 145,00</h3>
                                <div className="bg-emerald-50 rounded-xl p-4 text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock size={16} className="text-emerald-600" />
                                        <span className="text-xs font-bold text-emerald-700 uppercase">Investimento Garantido</span>
                                    </div>
                                    <p className="text-sm text-emerald-800">Sua meta de R$ 2.000 já foi separada do cálculo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
