'use client';

import { Star } from 'lucide-react';

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Casais reais, resultados reais
                    </h2>
                    <p className="text-lg text-gray-600">
                        Veja como casais estão transformando sua vida financeira.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            text: "Antes a gente brigava todo fim de mês. Agora, competir para ver quem ganha mais XP virou nosso hobby. Salvamos nosso casamento e nossa conta bancária!",
                            author: "Lucas & Marina",
                            role: "Juntos há 5 anos"
                        },
                        {
                            text: "A clareza de saber exatamente quanto podemos gastar por dia sem ferir nossos investimentos mudou o jogo. Atingimos nossa meta de viagem 3 meses antes.",
                            author: "Pedro & Sofia",
                            role: "Recém-casados"
                        },
                        {
                            text: "Eu sou gastão, ela é econômica. O App equilibrou isso de forma leve. O 'Modo Privacidade' também é genial para surpresas.",
                            author: "André & Carol",
                            role: "Noivos"
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex gap-1 text-yellow-400 mb-4">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-700 italic mb-6 leading-relaxed">"{item.text}"</p>
                            <div>
                                <h4 className="font-bold text-gray-900">{item.author}</h4>
                                <span className="text-sm text-gray-500">{item.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
