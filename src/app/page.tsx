// app/page.tsx
import styles from './page.module.css';
import { ArrowRight, Play, Shield, Users, PiggyBank, Target, TrendingUp, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <TrendingUp size={18} color="#111827" />
          </div>
          <span>Casal Milionário</span>
        </div>

        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>Funcionalidades</a>
          <a href="#method" className={styles.navLink}>O Método</a>
          <a href="#testimonials" className={styles.navLink}>Casais</a>
        </nav>

        <div className={styles.headerActions}>
          <a href="/login">
            <button className={styles.btnSecondary}>Entrar</button>
          </a>
          <a href="/register">
            <button className={styles.btnPrimary}>
              Começar Agora
              <ArrowRight size={16} />
            </button>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <Sparkles size={14} />
              Planejamento Financeiro v2.0
            </span>

            <h1 className={styles.heroTitle}>
              Sua riqueza<br />
              <span className={styles.heroTitleHighlight}>planejada.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              O primeiro app focado em construir o <strong>primeiro milhão</strong> do casal através da metodologia de investimento reverso.
            </p>

            <div className={styles.heroButtons}>
              <button className={styles.btnHeroPrimary}>
                Começar Agora
                <ArrowRight size={18} />
              </button>
              <button className={styles.btnHeroSecondary}>
                <Play size={18} />
                Ver Demo
              </button>
            </div>

            <div className={styles.heroTrust}>
              <div className={styles.trustItem}>
                <Shield size={16} className={styles.trustIcon} />
                <span>Dados Criptografados</span>
              </div>
              <div className={styles.trustItem}>
                <Users size={16} className={styles.trustIcon} />
                <span>+5.000 Casais</span>
              </div>
            </div>
          </div>

          {/* DASHBOARD MOCKUP */}
          <div className={styles.heroVisual}>
            <div className={styles.dashboardMockup}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupTabs}>
                  <button className={`${styles.mockupTab} ${styles.active}`}>Overview</button>
                  <button className={styles.mockupTab}>Analytics</button>
                  <button className={styles.mockupTab}>Despesas</button>
                </div>
                <div className={styles.mockupUser}>
                  <span className={styles.mockupUserName}>Gabriel & Maria</span>
                  <div className={styles.mockupAvatar}></div>
                </div>
              </div>

              {/* Card Insight Verde */}
              <div className={styles.insightCard}>
                <div className={styles.insightLabel}>
                  <Sparkles size={14} />
                  Account Insights
                </div>
                <p className={styles.insightTitle}>
                  Este mês, vocês economizaram{' '}
                  <span className={styles.insightHighlight}>R$ 2.340</span> — isso é 15% a mais!
                </p>
              </div>

              {/* Título do Painel */}
              <h2 className={styles.mockupTitle}>Overview Panel</h2>

              {/* Grid de Métricas */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>
                    <span className={styles.metricDot}></span>
                    Patrimônio Atual
                  </div>
                  <div className={styles.metricValue}>97,22<sup>k</sup></div>
                  <div className={styles.metricChange}>+14.9% este mês</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>
                    <span className={styles.metricDot}></span>
                    Investido
                  </div>
                  <div className={styles.metricValue}>10,12<sup>k</sup></div>
                  <div className={styles.metricChange}>+1.62k este mês</div>
                </div>
              </div>

              {/* Mini Gráfico */}
              <div className={styles.chartContainer}>
                <div className={styles.chartBars}>
                  <div className={styles.chartBar} style={{ height: '40%' }}></div>
                  <div className={styles.chartBar} style={{ height: '60%' }}></div>
                  <div className={styles.chartBar} style={{ height: '45%' }}></div>
                  <div className={styles.chartBar} style={{ height: '80%' }}></div>
                  <div className={styles.chartBar} style={{ height: '55%' }}></div>
                  <div className={styles.chartBar} style={{ height: '70%' }}></div>
                  <div className={styles.chartBar} style={{ height: '90%' }}></div>
                  <div className={styles.chartBar} style={{ height: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features} id="features">
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>Por que Casal Milionário?</h2>
            <p className={styles.featuresSubtitle}>
              Desenvolvido para casais que querem construir riqueza juntos de forma inteligente.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <PiggyBank size={24} />
              </div>
              <h3 className={styles.featureTitle}>Investimento Primeiro</h3>
              <p className={styles.featureDescription}>
                Separe o investimento antes de ver o que sobra para gastar. A metodologia que realmente funciona.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users size={24} />
              </div>
              <h3 className={styles.featureTitle}>Conta Conjunta</h3>
              <p className={styles.featureDescription}>
                Sincronização em tempo real para os dois. Cada gasto é compartilhado instantaneamente.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Target size={24} />
              </div>
              <h3 className={styles.featureTitle}>Foco no Milhão</h3>
              <p className={styles.featureDescription}>
                Gamificação e projeções realistas para vocês atingirem a liberdade financeira juntos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
