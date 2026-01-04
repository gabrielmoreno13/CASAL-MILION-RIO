'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Invista no seu futuro por menos de uma pizza
                    </h2>
                    <p className="text-lg text-gray-600">
                        Planos simples e transparentes. Cancele quando quiser.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Plano Básico</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold text-gray-900">Grátis</span>
                            </div>
                            <p className="mt-2 text-gray-500">Para começar a se organizar.</p>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-600"><Check size={18} className="text-green-500" /> Registro de despesas</li>
                            <li className="flex items-center gap-3 text-gray-600"><Check size={18} className="text-green-500" /> Metas básicas</li>
                            <li className="flex items-center gap-3 text-gray-400"><X size={18} /> Sem sincronização de casal</li>
                            <li className="flex items-center gap-3 text-gray-400"><X size={18} /> Sem gamificação avançada</li>
                            <li className="flex items-center gap-3 text-gray-400"><X size={18} /> Sem projeções de IA</li>
                        </ul>
                        <Link href="/register">
                            <button className="w-full py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
                                Começar Grátis
                            </button>
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative p-8 rounded-3xl border-2 border-emerald-500 bg-emerald-50/10 shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide">
                            Mais Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Casal Milionário Pro</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold text-gray-900">R$ 29,90</span>
                                <span className="ml-2 text-gray-500">/mês</span>
                            </div>
                            <p className="mt-2 text-emerald-700 font-medium">Tudo que vocês precisam para enriquecer.</p>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-800 font-medium"><Check size={18} className="text-emerald-500" /> Sincronização em Tempo Real</li>
                            <li className="flex items-center gap-3 text-gray-800 font-medium"><Check size={18} className="text-emerald-500" /> Gamificação Completa (XP, Níveis)</li>
                            <li className="flex items-center gap-3 text-gray-800 font-medium"><Check size={18} className="text-emerald-500" /> Projeções FIRE & Investimentos</li>
                            <li className="flex items-center gap-3 text-gray-800 font-medium"><Check size={18} className="text-emerald-500" /> Insights de IA Ilimitados</li>
                            <li className="flex items-center gap-3 text-gray-800 font-medium"><Check size={18} className="text-emerald-500" /> Suporte Prioritário</li>
                        </ul>
                        <Link href="/register">
                            <button className="w-full py-4 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                                Testar 7 Dias Grátis
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
