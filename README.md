# 💰 Casal Milionário (V3)

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

O **Casal Milionário** é uma plataforma financeira de alta performance projetada para casais que buscam a independência financeira. Utilixa a metodologia *"Profit First"* (Lucro Primeiro) e princípios de gamificação para tornar a gestão de dinheiro engajadora e eficiente.

---

## 🚀 Funcionalidades Principais

### 1. Dashboard Inteligente

- Visão unificada de **Patrimônio Total**.
- **Wallet**: Controle detalhado de receitas e despesas com categorização automática.
- **Metas Compartilhadas**: "Potes" virtuais para objetivos de curto, médio e longo prazo.

### 2. Gamificação Financeira

- **Níveis e XP**: Ganhe experiência ao registrar transações e manter a consistência.
- **Streaks**: Recompensas visuais por dias consecutivos de foco financeiro.
- **Conquistas**: Medalhas desbloqueáveis (ex: "Primeiro 10k Investido").

### 3. Engine "Investment-First"

- **Cálculo de Sobra Segura**: O app calcula quanto você pode gastar *hoje* sem comprometer seu futuro, baseando-se na meta de 20% de investimento.
- **Projeções de FIRE**: Gráficos de independência financeira baseados em seus aportes atuais.

### 4. Consultor IA ("Mestre de Finanças")

- Assistente virtual integrado que analisa seu perfil e tira dúvidas financeiras 24/7.
- *Powered by Google Gemini (Integration Ready).*

---

## 🛠 Tech Stack & Arquitetura

O projeto foi construído seguindo os princípios de **Clean Architecture** e **Component-Driven Development**.

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript.
- **Estilização**: Tailwind CSS + Modules (para isolamento de componentes complexos).
- **Backend/DB**: Supabase (PostgreSQL + Auth + Realtime).
- **Validação**: Zod para segurança de dados na API.
- **Pipeline**: GitHub Actions para CI/CD (Quality Checks).

---

## ⚙️ Configuração Local

### Pré-requisitos

- Node.js 20+
- Conta no Supabase

### Instalação

1. Clone o repositório:
\`\`\`bash
git clone <https://github.com/seu-usuario/casal-milionario.git>
cd casal-milionario
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configuração de Variáveis de Ambiente:
Crie um arquivo \`.env.local\` na raiz:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_supabase
GEMINI_API_KEY=sua_chave_opcional
\`\`\`

4. Rodar o projeto:
\`\`\`bash
npm run dev
\`\`\`

---

## 🔒 Segurança e Qualidade

Este projeto utiliza **Zod** para validação estrita de dados de entrada na API (`src/app/api/chat`), prevenindo injeção de dados maliciosos.
Além disso, um workflow de CI (`.github/workflows/ci.yml`) garante que nenhum código quebrado seja mergeado na branch principal.

---

## 🤝 Contribuição

PRs são bem-vindos! Por favor, siga o template de Pull Request padrão do repositório.

## 📄 Licença

MIT
