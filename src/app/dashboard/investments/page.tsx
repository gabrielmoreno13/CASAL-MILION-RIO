'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { TrendingUp, ArrowUpRight, Clock, ExternalLink, Globe } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'; // Ensure utility exists or reimplement simple formatter

// --- Mock Data ---
const MARKET_INDICATORS = [
    { name: 'Selic', value: '12,25%', change: '+0.50%', positive: true },
    { name: 'IPCA (12m)', value: '4,50%', change: '-0.10%', positive: true },
    { name: 'Ibovespa', value: '132.000 pts', change: '+1.20%', positive: true },
    { name: 'Bitcoin', value: 'R$ 350.000', change: '+5.40%', positive: true },
    { name: 'Dólar', value: 'R$ 5,85', change: '+0.30%', positive: false }, // Higher dollar might be negative for spending but positive for investment, simpler logic: red
];

const NEWS_FEED = [
    {
        id: 1,
        title: 'Selic mantém taxa em 12,25% ao ano: O que fazer?',
        source: 'InfoMoney',
        time: 'Há 2 horas',
        image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=800&q=80',
        url: 'https://www.infomoney.com.br'
    },
    {
        id: 2,
        title: 'Bitcoin atinge novo recorde histórico e supera US$ 70k',
        source: 'Valor Econômico',
        time: 'Há 5 horas',
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
        url: 'https://valor.globo.com'
    },
    {
        id: 3,
        title: 'Melhores fundos imobiliários para 2026 segundo analistas',
        source: 'Suno Research',
        time: 'Há 8 horas',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        url: 'https://www.suno.com.br'
    },
    {
        id: 4,
        title: 'Tesouro Direto suspende negociações após volatilidade',
        source: 'CNN Brasil',
        time: 'Há 12 horas',
        image: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?w=800&q=80',
        url: 'https://www.cnnbrasil.com.br'
    }
];

export default function InvestmentsPage() {
    return (
        <div className="fade-in pb-20">
            <Header title="Central de Investimentos" />

            <div className="container mx-auto px-6 max-w-7xl mt-8">

                {/* Market Ticker */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {MARKET_INDICATORS.map(indicator => (
                        <div key={indicator.name} className="flex-shrink-0 bg-[#0F1115] border border-white/5 rounded-2xl p-4 min-w-[200px]">
                            <div className="text-gray-400 text-xs font-medium uppercase mb-1">{indicator.name}</div>
                            <div className="flex items-end justify-between">
                                <div className="text-xl font-bold text-white">{indicator.value}</div>
                                <div className={`text-xs font-bold ${indicator.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {indicator.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Globe size={24} className="text-emerald-500" />
                                Notícias do Mercado
                            </h2>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Tempo Real
                            </span>
                        </div>

                        {NEWS_FEED.map(news => (
                            <a
                                key={news.id}
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <div className="bg-[#0F1115] border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col md:flex-row">
                                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase">
                                            {news.source}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col justify-center flex-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <Clock size={12} />
                                            {news.time}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                                            {news.title}
                                        </h3>
                                        <div className="mt-auto flex items-center gap-2 text-sm text-emerald-500 font-medium">
                                            Ler matéria completa <ExternalLink size={14} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border border-emerald-500/20 rounded-3xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Comece a Investir</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Aproveite as taxas altas da Selic para criar sua reserva de emergência ou invista em fundos imobiliários para renda passiva.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all mb-3">
                                Abrir Conta na Corretora
                            </button>
                            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all">
                                Simular Investimento
                            </button>
                        </div>

                        <div className="bg-[#0F1115] border border-white/5 rounded-3xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-purple-500" />
                                Maiores Altas
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { symbol: 'PETR4', name: 'Petrobras', val: '+2.4%' },
                                    { symbol: 'VALE3', name: 'Vale', val: '+1.8%' },
                                    { symbol: 'ITUB4', name: 'Itaú Unibanco', val: '+1.2%' },
                                ].map((stock, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <div className="font-bold text-white">{stock.symbol}</div>
                                            <div className="text-xs text-gray-500">{stock.name}</div>
                                        </div>
                                        <div className="font-bold text-emerald-500">{stock.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
