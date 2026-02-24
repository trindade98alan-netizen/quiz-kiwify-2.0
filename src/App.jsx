import { useEffect, useMemo, useState } from "react";

/* =========================
   UTMIFY EVENTS (helpers)
========================= */

function utmifyTrack(event, data = {}) {
  try {
    // Algumas versões expõem um objeto global
    if (window.utmify && typeof window.utmify.track === "function") {
      window.utmify.track(event, data);
      return;
    }

    // Fallback: dataLayer (não quebra, e algumas integrações leem daqui)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  } catch (e) {
    // Nunca deixa quebrar o app
  }
}

/* =========================
   1) QUIZ (6 perguntas)
========================= */

const questions = [
  {
    question:
      "Você sabe exatamente quanto dinheiro entrou e quanto saiu da sua conta no último mês?",
    description:
      "Não existe certo ou errado aqui. Escolha a opção que mais parece com a sua realidade hoje, isso vai ajudar a montar o seu diagnóstico financeiro no final.",
    options: [
      { text: "Tenho uma noção, mas nada muito organizado", score: 2, emoji: "🙋‍♂️" },
      { text: "Sim, está tudo anotado e bem claro para mim", score: 3, emoji: "😎" },
      { text: "Sinceramente, não sei… só vou gastando e vejo depois no extrato", score: 1, emoji: "😅" },
    ],
  },
  {
    question:
      'Quando o mês acaba, você tem a sensação de que o dinheiro simplesmente “sumiu”?',
    description: "Selecione uma das opções:",
    options: [
      { text: "Sim, no fim do mês quase nunca sei para onde o dinheiro foi.", score: 1, emoji: "😔" },
      { text: "Não, acompanho tudo e sei exatamente para onde cada gasto foi.", score: 3, emoji: "😏" },
      { text: "Às vezes tenho essa sensação, mas no geral consigo me virar e fechar o mês.", score: 2, emoji: "🤷‍♂️" },
    ],
  },
  {
    question:
      "Se você continuar fazendo exatamente o que faz hoje com seu dinheiro, como imagina que estará sua vida financeira daqui a 6 meses?",
    description: "Escolha a opção que melhor descreve você:",
    options: [
      { text: "Provavelmente mais endividado(a) e frustrado(a)", score: 1, emoji: "😣" },
      { text: "Do mesmo jeito de hoje, sem muita evolução", score: 2, emoji: "😐" },
      { text: "Com controle e conseguindo guardar dinheiro todo mês", score: 3, emoji: "🤑" },
    ],
  },
  {
    question: "O que mais te impede de ter um bom controle financeiro hoje?",
    description: "Responda com sinceridade.",
    options: [
      { text: "Falta de organização, começo e não consigo manter o controle", score: 1, emoji: "🙋‍♂️" },
      { text: "Não tenho uma ferramenta simples para controlar meu dinheiro", score: 2, emoji: "🤷‍♂️" },
      { text: "Esqueço de anotar os gastos no dia a dia", score: 1, emoji: "❌" },
      { text: "Acho complicado mexer com planilhas e números", score: 1, emoji: "😅" },
    ],
  },
  {
    question:
      "Se você tivesse uma planilha automática que mostrasse, em poucos cliques, para onde cada centavo do seu dinheiro está indo, você usaria?",
    description: "Qual é a sua opinião?",
    options: [
      { text: "Com certeza, é exatamente o que eu preciso agora", score: 3, emoji: "✅" },
      { text: "Talvez, se for bem simples de usar e não tomar muito tempo", score: 2, emoji: "🙋‍♂️" },
      { text: "Não sei, nunca tentei controlar o dinheiro com planilha, mas tenho curiosidade", score: 2, emoji: "🤔" },
    ],
  },
  {
    question:
      "Você gostaria de ter acesso a essa planilha ainda hoje para começar a organizar seu dinheiro?",
    description: "",
    options: [
      { text: "Sim, quero acesso imediato para organizar meu dinheiro", score: 3, emoji: "✅" },
      { text: "Sim, mas preciso de algo bem simples e fácil de usar", score: 2, emoji: "🙋‍♂️" },
      { text: "Por enquanto não", score: 1, emoji: "😔" },
    ],
  },
];

/* =========================
   2) OFERTA ÚNICA (Kiwify)
========================= */

const offer = {
  id: "card1",
  title: "Planilha Vida Sem Dívidas",
  subtitle: "Acesso vitalício",
  oldPrice: "R$97,00",
  newPrice: "R$19,90",
  url: "https://pay.kiwify.com.br/UXglpsq",
  image: "/card1.png",
  bullets: [
    "Acesso vitalício",
    "Atualização constante",
    "Vídeo aula ensinando a usar",
    "Sem mensalidade",
    "Personalize de acordo as suas necessidades",
    "Feita para iniciantes e experientes",
  ],
};

/* =========================
   3) DEPOIMENTOS (JPG)
========================= */

const testimonials = [
  {
    text:
      "Eu sempre perdia controle das pequenas despesas. Com a planilha, passei a acompanhar tudo e já estou conseguindo guardar uma reserva mensal!",
    name: "Maria Silva",
    role: "Diarista",
    avatar: "/maria.jpg",
  },
  {
    text:
      "Simples de usar e muito prática. Consegui organizar minhas contas e criar um orçamento mensal que realmente funciona. Vale cada centavo!",
    name: "Breno Silva",
    role: "Auxiliar de T.I",
    avatar: "/breno.jpg",
  },
  {
    text:
      "Achei que organização financeira fosse complicado até usar essa planilha. Intuitiva e com relatórios que me ajudam a decidir melhor!",
    name: "Paulo B.",
    role: "Repositor",
    avatar: "/paulo.jpg",
  },
];

/* =========================
   4) CONTADOR (10 min)
========================= */

function useCountdown(startSeconds = 600) {
  const [secondsLeft, setSecondsLeft] = useState(startSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/* =========================
   APP
========================= */

export default function App() {
  const [stage, setStage] = useState("hook"); // hook | quiz | offers
  const [current, setCurrent] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const maxScore = useMemo(() => questions.length * 3, []);
  const progressPct = useMemo(
    () => Math.round(((current + 1) / questions.length) * 100),
    [current]
  );

  function start() {
    utmifyTrack("quiz_start");
    setStage("quiz");
    setCurrent(0);
    setTotalScore(0);
  }

  function answer(score) {
    const nextTotal = totalScore + score;

    setTotalScore((s) => s + score);

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      utmifyTrack("quiz_complete", { totalScore: nextTotal, maxScore });
      setStage("offers");
    }
  }

  /* ===== TELA 1: ENTRADA com MOCKUP ===== */
  if (stage === "hook") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.mockWrap}>
            <img src="/mockup.png" alt="Mockup da planilha" style={styles.mockImg} />
          </div>

          <h1 style={styles.title}>Responda 6 perguntas rápidas 💰</h1>
          <p style={styles.subtitle}>
            Em menos de 1 minuto, descubra se o seu dinheiro está realmente sob controle
            ou escapando da sua mão sem você perceber.
          </p>

          <div style={styles.badgeRow}>
            <span style={styles.badge}>🕐 Leva apenas alguns segundos</span>
          </div>

          <button style={styles.primaryBtn} onClick={start}>
            Iniciar diagnóstico financeiro
          </button>
        </div>
      </div>
    );
  }

  /* ===== QUIZ ===== */
  if (stage === "quiz") {
    const q = questions[current];

    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.topRow}>
            <span style={styles.stepPill}>
              Pergunta {current + 1} de {questions.length}
            </span>
            <span style={styles.stepPct}>{progressPct}%</span>
          </div>

          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>

          <h2 style={styles.qTitle}>{q.question}</h2>
          {q.description && <p style={styles.qDesc}>{q.description}</p>}

          <div style={{ marginTop: 6 }}>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                style={styles.optionBtn}
                onClick={() => answer(opt.score)}
              >
                <span style={styles.optEmoji}>{opt.emoji}</span>
                <span style={styles.optText}>{opt.text}</span>
              </button>
            ))}
          </div>

          <div style={styles.helpRow}>
            <span style={styles.helpText}>Não existe certo ou errado — seja sincero.</span>
          </div>
        </div>
      </div>
    );
  }

  return <OffersPage totalScore={totalScore} maxScore={maxScore} />;
}

/* =========================
   PÁGINA FINAL (OFERTA)
========================= */

function OffersPage({ totalScore, maxScore }) {
  const time = useCountdown(10 * 60);

  const perfil =
    totalScore <= 8
      ? "Seu dinheiro provavelmente está escapando sem você perceber 💸"
      : totalScore <= 13
      ? "Você até se vira, mas está perdendo dinheiro no descontrole invisível 👀"
      : "Você já tem uma boa base — agora é manter consistência e otimizar 📌";

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, padding: 18 }}>
        {/* Contador */}
        <div style={offersStyles.timerWrap}>
          <div style={offersStyles.timerText}>
            GARANTA AGORA COM DESCONTO <span style={offersStyles.timer}>{time}</span>
          </div>
        </div>

        {/* Título + Diagnóstico */}
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <div style={offersStyles.headerTag}>SUA MELHOR OPÇÃO</div>
          <div style={offersStyles.headerTitle}>Seu diagnóstico está pronto ✅</div>
          <div style={offersStyles.headerSub}>
            {perfil}
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>
              Pontuação: <strong>{totalScore}</strong> / {maxScore}
            </div>
          </div>
        </div>

        {/* Imagem planilha */}
        <div style={offersStyles.planilhaOnlyWrap}>
          <img src="/planilha.png" alt="Planilha" style={offersStyles.planilhaOnlyImg} />
        </div>

        {/* Card único */}
        <div style={offersStyles.gridOne}>
          <OfferCard offer={offer} />
        </div>

        {/* ===== GARANTIA (NOVO BLOCO 7 DIAS) ===== */}
        <div style={guaranteeStyles.wrap}>
          <div style={guaranteeStyles.badge}>GARANTIA TOTAL</div>

          <div style={guaranteeStyles.title}>
            Experimente por <span style={guaranteeStyles.titleStrong}>7 dias</span> — Sem risco ✅
          </div>

          <div style={guaranteeStyles.text}>
            Eu confio tanto que essa planilha vai te dar clareza e controle do seu dinheiro,
            que vou te dar <strong>7 dias pra testar sem medo</strong>.
            <br />
            <br />
            Se dentro de <strong>7 dias</strong> você achar que não valeu a pena, é só pedir e
            você recebe <strong>100% do seu dinheiro de volta</strong>.
            <br />
            <br />
            Sem enrolação. Sem burocracia. O risco é meu. <strong>Você só testa.</strong>
          </div>

          <div style={guaranteeStyles.footerLine}>
            Ou você organiza sua vida financeira… <strong>ou eu devolvo o seu dinheiro.</strong>
          </div>

          {/* ✅ Use uma imagem nova: /garantia-7dias.png (coloque em /public) */}
          <img
            src="/garantia-7dias.png"
            alt="Garantia 7 dias"
            style={guaranteeStyles.image}
          />
        </div>

        {/* Depoimentos */}
        <div style={{ marginTop: 18 }}>
          <h3 style={offersStyles.h3}>RELATOS DE QUEM ADQUIRIU</h3>
          {testimonials.map((t, i) => (
            <Testimonial key={i} {...t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OfferCard({ offer }) {
  return (
    <div style={offersStyles.card}>
      <div style={offersStyles.cardTitle}>{offer.title}</div>
      <div style={offersStyles.cardSubtitle}>{offer.subtitle}</div>

      <div style={offersStyles.cardImageWrap}>
        <img src={offer.image} alt={offer.title} style={offersStyles.cardImage} />
      </div>

      <div style={offersStyles.priceBox}>
        <div style={offersStyles.oldPrice}>De: {offer.oldPrice}</div>
        <div style={offersStyles.newPrice}>Por: {offer.newPrice}</div>
      </div>

      {offer.bullets?.length > 0 && (
        <ul style={offersStyles.bullets}>
          {offer.bullets.map((b, i) => (
            <li key={i} style={offersStyles.bulletItem}>
              ✅ {b}
            </li>
          ))}
        </ul>
      )}

      <button
        style={offersStyles.buyBtn}
        onClick={() => {
          utmifyTrack("offer_click", { offerId: offer.id, offerTitle: offer.title });

          // repassa TODOS os params (utm_*, fbclid, gclid, etc)
          const currentParams = new URLSearchParams(window.location.search);
          const paramsString = currentParams.toString();

          let finalUrl = offer.url;

          if (paramsString) {
            finalUrl += (offer.url.includes("?") ? "&" : "?") + paramsString;
          }

          window.location.href = finalUrl;
        }}
      >
        Quero esse
      </button>
    </div>
  );
}

function Testimonial({ text, name, role, avatar }) {
  return (
    <div style={offersStyles.testimonial}>
      <div style={offersStyles.testHeader}>
        <img src={avatar} alt={name} style={offersStyles.avatar} />
        <div>
          <div style={offersStyles.testName}>{name}</div>
          <div style={offersStyles.testRole}>{role}</div>
        </div>
      </div>

      <div style={{ marginBottom: 6, marginTop: 10 }}>{"⭐".repeat(5)}</div>
      <div style={{ fontSize: 14, lineHeight: 1.45, color: "#111827" }}>{text}</div>
    </div>
  );
}

/* =========================
   ESTILOS
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
    padding: 16,
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 980,
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
    padding: "26px 22px",
  },
  mockWrap: {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto 14px auto",
    borderRadius: 16,
    overflow: "hidden",
    background: "#0b1220",
    padding: 10,
    height: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mockImg: { width: "100%", height: "100%", objectFit: "contain", display: "block" },

  title: { fontSize: 22, marginBottom: 10, color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#475569", marginBottom: 14, lineHeight: 1.45 },
  badgeRow: { display: "flex", justifyContent: "center", marginBottom: 14 },
  badge: {
    fontSize: 12,
    fontWeight: 700,
    background: "#eef2ff",
    color: "#3730a3",
    padding: "8px 12px",
    borderRadius: 999,
  },
  primaryBtn: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    border: "none",
    background: "#16a34a",
    color: "white",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
  },

  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  stepPill: {
    fontSize: 12,
    fontWeight: 800,
    background: "#f1f5f9",
    color: "#0f172a",
    padding: "7px 10px",
    borderRadius: 999,
  },
  stepPct: { fontSize: 12, fontWeight: 800, color: "#16a34a" },
  progressBar: { width: "100%", height: 8, background: "#e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 18 },
  progressFill: { height: "100%", background: "#16a34a", transition: "width 0.25s ease" },

  qTitle: { fontSize: 17, marginBottom: 10, color: "#0f172a", lineHeight: 1.35 },
  qDesc: { fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.45 },

  optionBtn: {
    width: "100%",
    padding: 14,
    marginTop: 10,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    textAlign: "left",
  },
  optEmoji: { width: 22, display: "inline-flex", justifyContent: "center" },
  optText: { fontSize: 14, color: "#0f172a", lineHeight: 1.35 },
  helpRow: { marginTop: 14, textAlign: "center" },
  helpText: { fontSize: 12, color: "#94a3b8" },
};

const offersStyles = {
  timerWrap: { width: "100%", display: "flex", justifyContent: "center", marginBottom: 12 },
  timerText: {
    background: "#111827",
    color: "white",
    padding: "10px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.3,
  },
  timer: { marginLeft: 8, padding: "4px 8px", borderRadius: 999, background: "#16a34a", color: "white", fontWeight: 900 },

  headerTag: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "#111827",
    color: "white",
    fontSize: 12,
    fontWeight: 900,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 900, color: "#0f172a" },
  headerSub: { marginTop: 8, fontSize: 13, color: "#334155", lineHeight: 1.45 },

  planilhaOnlyWrap: {
    width: "100%",
    maxWidth: 720,
    margin: "14px auto 0 auto",
    borderRadius: 18,
    overflow: "hidden",
    background: "transparent",
  },
  planilhaOnlyImg: { width: "100%", height: "auto", display: "block", borderRadius: 18 },

  // ✅ um card só
  gridOne: {
    marginTop: 18,
    display: "grid",
    gap: 14,
    gridTemplateColumns: "minmax(260px, 520px)",
    justifyContent: "center",
    alignItems: "start",
  },

  card: {
    position: "relative",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 16,
    textAlign: "left",
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
  },

  cardTitle: { fontSize: 16, fontWeight: 900, color: "#0f172a" },
  cardSubtitle: { fontSize: 12, color: "#64748b", marginTop: 4 },

  cardImageWrap: {
    width: "100%",
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
    background: "#0b1220",
    aspectRatio: "9 / 16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  priceBox: { marginTop: 12, borderRadius: 14, padding: 12, background: "#f8fafc", border: "1px solid #e5e7eb" },
  oldPrice: { fontSize: 12, color: "#6b7280", textDecoration: "line-through" },
  newPrice: { marginTop: 6, fontSize: 20, fontWeight: 900, color: "#0f172a" },

  bullets: { listStyle: "none", padding: 0, margin: "12px 0 0 0" },
  bulletItem: { fontSize: 12, color: "#334155", marginTop: 8, lineHeight: 1.35, whiteSpace: "normal", wordBreak: "break-word" },

  buyBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#16a34a",
    color: "white",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
    marginTop: "auto",
  },

  h3: { fontSize: 13, letterSpacing: 0.6, margin: "0 0 10px 0", textAlign: "center" },

  testimonial: { border: "1px solid #e5e7eb", background: "#ffffff", borderRadius: 14, padding: 14, marginTop: 10, textAlign: "left" },
  testHeader: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid #e5e7eb" },
  testName: { fontWeight: 900, color: "#111827", fontSize: 14, lineHeight: 1.2 },
  testRole: { color: "#64748b", fontSize: 12, marginTop: 2 },
};

/* =========================
   GARANTIA (7 dias)
========================= */

const guaranteeStyles = {
  wrap: {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    padding: 18,
    textAlign: "center",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 10,
    background: "#7c3aed", // roxo
    color: "white",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.25,
    marginBottom: 10,
  },
  titleStrong: { color: "#7c3aed" },
  text: {
    maxWidth: 780,
    margin: "0 auto",
    fontSize: 14,
    color: "#334155",
    lineHeight: 1.6,
  },
  footerLine: {
    marginTop: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  image: {
    width: "100%",
    maxWidth: 520,
    display: "block",
    margin: "14px auto 0 auto",
    borderRadius: 14,
  },
};