import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, PieChart, MoreHorizontal, Bell, Search, Menu } from 'lucide-react';
import { Card } from './Card';

export function DashboardPreview() {
    return (
        <div className="w-full h-full bg-[#FAFAFA] dark:bg-[#0A0A0A] flex overflow-hidden rounded-[32px] font-sans antialiased text-gray-900 dark:text-gray-100 select-none">

            {/* Sidebar (Visual Only) */}
            <div className="w-64 border-r border-gray-200 dark:border-white/10 p-6 flex flex-col justify-between bg-white dark:bg-black hidden md:flex">
                <div className="space-y-8">
                    {/* Logo Placeholder */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-green-600 shadow-emerald-500/20 shadow-lg" />
                        <span className="font-semibold tracking-tight text-lg">Casal Milionário</span>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                        <SidebarItem active icon={<PieChart size={20} />} label="Overview" />
                        <SidebarItem icon={<Wallet size={20} />} label="Carteira" />
                        <SidebarItem icon={<TrendingUp size={20} />} label="Investimentos" />
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-black" />
                    <div className="flex-1">
                        <div className="h-3 w-20 bg-gray-200 dark:bg-white/20 rounded mb-1" />
                        <div className="h-2 w-12 bg-gray-100 dark:bg-white/10 rounded" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-[#FAFAFA] dark:bg-[#050505]">

                {/* Header */}
                <header className="h-20 border-b border-gray-200/50 dark:border-white/5 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-xl font-semibold">Visão Geral</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm relative">
                            <Bell size={16} className="text-gray-400" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Grid */}
                <div className="p-8 overflow-hidden relative">
                    {/* Abstract Content to fill space */}
                    <div className="grid grid-cols-12 gap-6 h-full">

                        {/* Highlight Metric - Total Net Worth */}
                        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#111] rounded-[24px] p-8 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-gray-500 mb-1">Patrimônio Líquido Total</p>
                                <h3 className="text-5xl font-semibold tracking-tighter mb-4">R$ 254.392<span className="text-gray-300">,00</span></h3>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-1 border border-emerald-100">
                                        <ArrowUpRight size={14} /> +12.5%
                                    </span>
                                    <span className="text-xs text-gray-400">vs. mês anterior</span>
                                </div>
                            </div>
                            {/* Decorative Gradient Blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/20 transition-colors duration-500" />
                        </div>

                        {/* Smaller Metric - Monthly Savings */}
                        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-[24px] p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                            <p className="text-emerald-100 text-sm font-medium mb-8">Economia Mensal</p>
                            <h3 className="text-3xl font-semibold mb-2">R$ 8.450</h3>
                            <p className="text-emerald-100 text-sm opacity-80">Meta atingida!</p>

                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/4 translate-y-1/4" />
                        </div>

                        {/* Chart Placeholder Area (Bottom) */}
                        <div className="col-span-12 bg-white dark:bg-[#111] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-white/5 h-48 flex items-end justify-between gap-2 opacity-80">
                            {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                                <div key={i} className="w-full bg-emerald-500/20 rounded-t-lg hover:bg-emerald-500 transition-colors duration-300" style={{ height: `${h}%` }} />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-default transition-colors ${active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
            {React.cloneElement(icon, { size: 20, className: active ? 'text-emerald-600' : 'text-gray-400' })}
            <span className="text-sm">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
        </div>
    );
}
