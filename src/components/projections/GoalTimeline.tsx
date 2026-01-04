'use client';

import React from 'react';
import { Target, Flag, Calendar } from 'lucide-react';

interface GoalPoint {
    id: number;
    title: string;
    date: string;
    value: number;
    achieved: boolean;
}

const GOALS: GoalPoint[] = [
    { id: 1, title: 'Início', date: 'Jan 2024', value: 0, achieved: true },
    { id: 2, title: 'Reserva de Emergência', date: 'Jun 2024', value: 20000, achieved: true },
    { id: 3, title: 'Primeiro 100k', date: 'Dez 2025', value: 100000, achieved: false },
    { id: 4, title: 'Casa Própria', date: 'Jun 2028', value: 500000, achieved: false },
    { id: 5, title: 'Primeiro Milhão', date: 'Dez 2032', value: 1000000, achieved: false },
];

export function GoalTimeline() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target size={20} className="text-emerald-600" />
                Linha do Tempo de Objetivos
            </h3>

            <div className="relative">
                {/* Horizontal Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />

                {/* Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                    style={{ width: '35%' }} // Mock progress
                />

                <div className="relative flex justify-between">
                    {GOALS.map((goal, index) => (
                        <div key={goal.id} className="flex flex-col items-center group cursor-pointer">
                            {/* Point */}
                            <div
                                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-300
                                    ${goal.achieved
                                        ? 'bg-emerald-500 border-emerald-100 shadow-md scale-110'
                                        : 'bg-white border-gray-200 hover:border-emerald-300'
                                    }`}
                            >
                                {goal.achieved && <Flag size={12} className="text-white" />}
                            </div>

                            {/* Label */}
                            <div className="absolute top-10 flex flex-col items-center w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 bg-gray-800 text-white p-2 rounded-lg text-xs">
                                <span className="font-bold mb-1">{goal.title}</span>
                                <span className="flex items-center gap-1 text-gray-300">
                                    <Calendar size={10} /> {goal.date}
                                </span>
                                <span className="text-emerald-400 font-mono mt-1">
                                    R$ {(goal.value / 1000)}k
                                </span>
                                {/* Arrow */}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                            </div>

                            {/* Simple Label (Always visible) */}
                            <div className={`mt-3 text-xs font-semibold ${goal.achieved ? 'text-emerald-700' : 'text-gray-400'}`}>
                                {goal.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
