import { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   UTMIFY EVENTS (helpers)
========================= */

function utmifyTrack(event, data = {}) {
  try {
    if (window.utmify && typeof window.utmify.track === "function") {
      window.utmify.track(event, data);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  } catch (e) {}
}

/* =========================
   1) QUIZ (6 perguntas) — PT-BR
========================= */

const questions = [
  {
    question:
      "Você sabe exatamente quanto dinheiro entrou e quanto saiu da sua conta no último mês?",
    description:
      "Aqui não existe certo ou errado. Escolha a opção que mais parece com a sua realidade hoje. Isso vai ajudar a montar o seu diagnóstico financeiro no final.",
    options: [
      { text: "Tenho uma noção, mas nada muito organizado", score: 2, emoji: "🙋‍♂️" },
      { text: "Sim, está tudo anotado e bem claro para mim", score: 3, emoji: "😎" },
      { text: "Sinceramente não… só vou gastando e depois vejo no extrato", score: 1, emoji: "😅" },
    ],
  },
  {
    question:
      'Quando o mês acaba, você tem a sensação de que o dinheiro simplesmente “sumiu”?',
    description: "Selecione uma opção:",
    options: [
      { text: "Sim, no fim do mês quase nunca sei para onde o dinheiro foi.", score: 1, emoji: "😔" },
      { text: "Não, eu acompanho tudo e sei exatamente para onde foi cada gasto.", score: 3, emoji: "😏" },
      { text: "Às vezes sinto isso, mas no geral consigo me virar e fechar o mês.", score: 2, emoji: "🤷‍♂️" },
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
      { text: "Falta de organização: começo e não consigo manter o controle", score: 1, emoji: "🙋‍♂️" },
      { text: "Não tenho uma ferramenta simples para controlar meu dinheiro", score: 2, emoji: "🤷‍♂️" },
      { text: "Eu esqueço de anotar os gastos do dia a dia", score: 1, emoji: "❌" },
      { text: "Acho complicado mexer com planilhas e números", score: 1, emoji: "😅" },
    ],
  },
  {
    question:
      "Se você tivesse uma planilha automática que mostrasse, em poucos cliques, para onde cada centavo do seu dinheiro está indo… você usaria?",
    description: "Qual é a sua opinião?",
    options: [
      { text: "Com certeza. É exatamente o que eu preciso agora", score: 3, emoji: "✅" },
      { text: "Talvez, se for bem simples e não tomar muito tempo", score: 2, emoji: "🙋‍♂️" },
      { text: "Não sei… nunca tentei, mas tenho curiosidade", score: 2, emoji: "🤔" },
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
   2) OFERTA PRINCIPAL / SAÍDA
========================= */

const mainOffer = {
  id: "card1",
  title: "Planilha Vida Sem Dívidas",
  subtitle: "Acesso vitalício",
  oldPrice: "R$97,00",
  newPrice: "R$24,90",
  url: "https://pay.kiwify.com.br/UXglpsq",
  image: "/card1.png",
  bullets: [
    "Acesso vitalício",
    "Atualizações constantes",
    "Vídeo guia para aprender a usar",
    "Sem mensalidade",
    "Personalize de acordo com as suas necessidades",
    "Feita para iniciantes e experientes",
  ],
};

const exitOffer = {
  id: "exit-offer",
  title: "Oferta de Saída Exclusiva",
  subtitle: "Liberada só porque você chegou até aqui",
  oldPrice: "R$24,90",
  newPrice: "R$16,90",
  url: "https://pay.kiwify.com.br/T2t4PBq",
  image: "/card1.png",
};

/* =========================
   3) BÔNUS / DEPOIMENTOS
========================= */

const bonuses = [
  {
    title: "Suporte no WhatsApp",
    image: "/suporte.png",
    description:
      "Tire dúvidas e receba ajuda real para aplicar tudo com confiança, sem travar no meio do processo.",
  },
  {
    title: "Checklist Quitação Acelerada",
    image: "/acelerada.png",
    description:
      "Um passo a passo prático para quem tem baixa renda e precisa quitar dívidas mais rápido com estratégia.",
  },
  {
    title: "Raio-X dos Gastos Invisíveis",
    image: "/raio.png",
    description:
      "Descubra os vazamentos escondidos que fazem seu dinheiro sumir e elimine os gastos que sabotam seu mês.",
  },
  {
    title: "Renda Extra Estratégica",
    image: "/renda.png",
    description:
      "Descubra a forma de renda extra mais adequada ao seu perfil para começar do jeito certo e com mais resultado.",
  },
];

const testimonialImages = ["/w1.jpeg", "/w2.jpeg", "/w3.jpeg", "/w4.jpeg", "/w5.jpeg"];

/* =========================
   4) CONTADOR
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
   HELPERS
========================= */

function redirectToCheckout(offer, eventName = "cta_click") {
  utmifyTrack(eventName, {
    offerId: offer.id,
    offerTitle: offer.title,
  });

  const currentParams = new URLSearchParams(window.location.search);
  const paramsString = currentParams.toString();

  let finalUrl = offer.url;

  if (paramsString) {
    finalUrl += (finalUrl.includes("?") ? "&" : "?") + paramsString;
  }

  window.location.href = finalUrl;
}

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

/* =========================
   APP
========================= */

export default function App() {
  const [stage, setStage] = useState("hook");
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

  if (stage === "hook") {
    return (
      <div style={styles.page} className="quiz-root-page">
        <div style={styles.card} className="quiz-main-card">
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

  if (stage === "quiz") {
    const q = questions[current];

    return (
      <div style={styles.page} className="quiz-root-page">
        <div style={styles.card} className="quiz-main-card">
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

  if (stage === "exit-offer") {
    return (
      <ExitOfferPage
        offer={exitOffer}
        onBackToMain={() => setStage("offers")}
      />
    );
  }

  return (
    <OffersPage
      totalScore={totalScore}
      maxScore={maxScore}
      onExitIntent={() => setStage("exit-offer")}
    />
  );
}

/* =========================
   PÁGINA PRINCIPAL DE OFERTA
========================= */

function OffersPage({ totalScore, maxScore, onExitIntent }) {
  const time = useCountdown(10 * 60);
  const [showExitModal, setShowExitModal] = useState(false);

  const perfil =
    totalScore <= 8
      ? "Seu dinheiro provavelmente está escapando sem você perceber 💸"
      : totalScore <= 13
      ? "Você até se vira, mas está perdendo dinheiro no descontrole invisível 👀"
      : "Você já tem uma boa base — agora é manter consistência e otimizar 📌";

  useBackRedirect(onExitIntent, "main_exit_intent_back");
  useDesktopExitIntent(() => setShowExitModal(true), "main_exit_intent_desktop");

  return (
    <div style={styles.page} className="quiz-root-page">
      <div style={{ ...styles.card, padding: 18 }} className="quiz-main-card">
        <div style={offersStyles.timerWrap}>
          <div style={offersStyles.timerText}>
            GARANTA AGORA COM DESCONTO <span style={offersStyles.timer}>{time}</span>
          </div>
        </div>

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

        <div style={offersStyles.planilhaOnlyWrap}>
          <img src="/planilha.png" alt="Planilha" style={offersStyles.planilhaOnlyImg} />
        </div>

        <div style={offersStyles.gridOne}>
          <OfferCard offer={mainOffer} bonuses={bonuses} />
        </div>

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

          <img src="/garantia-7dias.png" alt="Garantia 7 dias" style={guaranteeStyles.image} />
        </div>

        <div style={{ marginTop: 18 }}>
          <h3 style={offersStyles.h3}>RELATOS DE QUEM ADQUIRIU</h3>
          <TestimonialsCarousel images={testimonialImages} />

          <button
            style={offersStyles.bottomCtaBtn}
            className="offers-bottom-cta-mobile"
            onClick={() => redirectToCheckout(mainOffer, "bottom_cta_click")}
          >
            Quero minha Planilha
          </button>
        </div>
      </div>

      {showExitModal && (
        <ExitIntentModal
          onClose={() => setShowExitModal(false)}
          onGoExitOffer={() => {
            setShowExitModal(false);
            onExitIntent();
          }}
        />
      )}
    </div>
  );
}

/* =========================
   PÁGINA DE SAÍDA / DESCONTO
========================= */

function ExitOfferPage({ offer, onBackToMain }) {
  const time = useCountdown(7 * 60);

  return (
    <div style={styles.page} className="quiz-root-page">
      <div style={{ ...styles.card, padding: 18 }} className="quiz-main-card">
        <div style={exitStyles.topAlert} className="exit-top-alert-mobile">
          ⚠️ ESPERE! Antes de sair, eu liberei uma condição especial só nesta tela
        </div>

        <div style={exitStyles.heroWrap}>
          <div style={exitStyles.heroBadge}>DESCONTO DE SAÍDA</div>
          <div style={exitStyles.heroTitle} className="exit-hero-title-mobile">
            Não feche essa página sem pegar sua <span style={exitStyles.heroStrong}>oferta final</span>
          </div>
          <div style={exitStyles.heroText}>
            Como você chegou até aqui, eu destravei uma última chance para levar a
            <strong> Planilha Vida Sem Dívidas</strong> com valor reduzido.
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={exitStyles.timerBox} className="exit-timer-box-mobile">
            Essa condição expira em <span style={exitStyles.timerValue}>{time}</span>
          </div>
        </div>

        <div style={exitStyles.priceCard} className="exit-price-card-mobile">
          <div style={exitStyles.priceImageCol}>
            <img src={offer.image} alt={offer.title} style={exitStyles.priceImage} />
          </div>

          <div style={exitStyles.priceInfo}>
            <div style={exitStyles.offerMiniTag} className="exit-mini-tag-mobile">
              OFERTA DE SAÍDA EXCLUSIVA
            </div>
            <div style={exitStyles.offerTitle} className="exit-title-mobile">
              {offer.title}
            </div>
            <div style={exitStyles.offerSubtitle}>{offer.subtitle}</div>

            <div style={exitStyles.priceLineOld}>De {offer.oldPrice}</div>
            <div style={exitStyles.priceLineNew} className="exit-price-new-mobile">
              Por apenas {offer.newPrice}
            </div>
            <div style={exitStyles.priceObs}>
              Mesmo acesso, mesmos bônus e uma última chance antes de você sair.
            </div>

            <button
              style={exitStyles.ctaBtn}
              className="exit-cta-mobile"
              onClick={() => redirectToCheckout(offer, "exit_offer_click")}
            >
              Quero aproveitar o desconto
            </button>

            <button
              style={exitStyles.backBtn}
              onClick={onBackToMain}
            >
              Voltar para a oferta anterior
            </button>
          </div>
        </div>

        <div style={exitStyles.bonusSection}>
          <div style={exitStyles.sectionBadge}>🎁 TODOS OS BÔNUS CONTINUAM INCLUSOS</div>
          <div style={exitStyles.sectionTitle} className="exit-section-title-mobile">
            Você não leva só a planilha
          </div>
          <div style={exitStyles.sectionText}>
            Além da planilha, você também recebe os bônus abaixo para acelerar sua organização,
            sair das dívidas e enxergar novas oportunidades financeiras.
          </div>

          <div style={offersStyles.bonusGrid}>
            {bonuses.map((bonus, index) => (
              <div key={index} style={offersStyles.bonusCard}>
                <div style={offersStyles.bonusImageWrapVertical}>
                  <img src={bonus.image} alt={bonus.title} style={offersStyles.bonusImageVertical} />
                </div>
                <div style={offersStyles.bonusCardTitle}>{bonus.title}</div>
                <div style={offersStyles.bonusCardDesc}>{bonus.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={exitStyles.sectionBadge}>🔥 VEJA O QUE ESTÃO FALANDO</div>
          <div style={exitStyles.sectionTitle} className="exit-section-title-mobile">
            Provas reais de quem adquiriu
          </div>
          <TestimonialsCarousel images={testimonialImages} />

          <button
            style={offersStyles.bottomCtaBtn}
            className="offers-bottom-cta-mobile"
            onClick={() => redirectToCheckout(offer, "exit_bottom_cta_click")}
          >
            Quero minha Planilha com desconto
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MODAL EXIT INTENT DESKTOP
========================= */

function ExitIntentModal({ onClose, onGoExitOffer }) {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.card}>
        <button style={modalStyles.closeBtn} onClick={onClose} aria-label="Fechar">
          ×
        </button>

        <div style={modalStyles.badge}>⚠️ ESPERE UM SEGUNDO</div>
        <div style={modalStyles.title}>
          Antes de sair, veja sua <span style={modalStyles.strong}>última oportunidade</span>
        </div>
        <div style={modalStyles.text}>
          Você já chegou até a oferta final. Eu liberei uma condição especial de saída
          para você não perder a chance de organizar sua vida financeira pagando menos.
        </div>

        <div style={modalStyles.ctaRow}>
          <button style={modalStyles.primaryBtn} onClick={onGoExitOffer}>
            Ver oferta de saída
          </button>
          <button style={modalStyles.secondaryBtn} onClick={onClose}>
            Continuar nesta página
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   CARD DE OFERTA
========================= */

function OfferCard({ offer, bonuses }) {
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
        onClick={() => redirectToCheckout(offer, "offer_click")}
      >
        Quero esse
      </button>

      <div style={offersStyles.bonusSection}>
        <div style={offersStyles.bonusHeaderBadge}>🎁 4 BÔNUS ESPECIAIS INCLUSOS</div>
        <div style={offersStyles.bonusHeaderTitle}>
          Ao garantir hoje, você não leva só a planilha…
        </div>
        <div style={offersStyles.bonusHeaderText}>
          Você também recebe <strong>4 bônus práticos e valiosos</strong> para acelerar
          sua organização financeira, sair das dívidas e construir novas fontes de renda.
        </div>

        <div style={offersStyles.bonusGrid}>
          {bonuses.map((bonus, index) => (
            <div key={index} style={offersStyles.bonusCard}>
              <div style={offersStyles.bonusImageWrapVertical}>
                <img src={bonus.image} alt={bonus.title} style={offersStyles.bonusImageVertical} />
              </div>
              <div style={offersStyles.bonusCardTitle}>{bonus.title}</div>
              <div style={offersStyles.bonusCardDesc}>{bonus.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   CARROSSEL DE DEPOIMENTOS
========================= */

function TestimonialsCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function prevSlide() {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextSlide() {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div style={carouselStyles.wrap}>
      <button
        style={{ ...carouselStyles.arrowBtn, left: 10 }}
        onClick={prevSlide}
        aria-label="Anterior"
      >
        ‹
      </button>

      <div style={carouselStyles.viewport}>
        <img
          src={images[currentIndex]}
          alt={`Depoimento ${currentIndex + 1}`}
          style={carouselStyles.image}
        />
      </div>

      <button
        style={{ ...carouselStyles.arrowBtn, right: 10 }}
        onClick={nextSlide}
        aria-label="Próximo"
      >
        ›
      </button>

      <div style={carouselStyles.dots}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              ...carouselStyles.dot,
              opacity: currentIndex === index ? 1 : 0.35,
              transform: currentIndex === index ? "scale(1.15)" : "scale(1)",
            }}
            aria-label={`Ir para depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================
   RECUPERAÇÃO DE SAÍDA
========================= */

function useBackRedirect(onExitIntent, trackEventName = "exit_intent_back") {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const state = { page: "offer-page" };
    window.history.pushState(state, "", window.location.href);

    function handlePopState() {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      utmifyTrack(trackEventName);
      onExitIntent();
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onExitIntent, trackEventName]);
}

function useDesktopExitIntent(onIntent, trackEventName = "exit_intent_desktop") {
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (isMobileDevice()) return;

    function handleMouseOut(e) {
      if (triggeredRef.current) return;
      if (!e.relatedTarget && e.clientY <= 10) {
        triggeredRef.current = true;
        utmifyTrack(trackEventName);
        onIntent();
      }
    }

    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [onIntent, trackEventName]);
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
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 980,
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
    padding: "26px 22px",
    overflow: "hidden",
    boxSizing: "border-box",
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
    boxSizing: "border-box",
  },
  mockImg: { width: "100%", height: "100%", objectFit: "contain", display: "block" },
  title: { fontSize: 22, marginBottom: 10, color: "#0f172a", wordBreak: "normal", overflowWrap: "break-word" },
  subtitle: { fontSize: 14, color: "#475569", marginBottom: 14, lineHeight: 1.45, wordBreak: "normal", overflowWrap: "break-word" },
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
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 10 },
  stepPill: {
    fontSize: 12,
    fontWeight: 800,
    background: "#f1f5f9",
    color: "#0f172a",
    padding: "7px 10px",
    borderRadius: 999,
  },
  stepPct: { fontSize: 12, fontWeight: 800, color: "#16a34a", flexShrink: 0 },
  progressBar: { width: "100%", height: 8, background: "#e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 18 },
  progressFill: { height: "100%", background: "#16a34a", transition: "width 0.25s ease" },
  qTitle: { fontSize: 17, marginBottom: 10, color: "#0f172a", lineHeight: 1.35, wordBreak: "normal", overflowWrap: "break-word" },
  qDesc: { fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.45, wordBreak: "normal", overflowWrap: "break-word" },
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
    boxSizing: "border-box",
  },
  optEmoji: { width: 22, display: "inline-flex", justifyContent: "center", flexShrink: 0 },
  optText: { fontSize: 14, color: "#0f172a", lineHeight: 1.35, wordBreak: "normal", overflowWrap: "break-word" },
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
    textAlign: "center",
    maxWidth: "100%",
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  timer: {
    marginLeft: 8,
    padding: "4px 8px",
    borderRadius: 999,
    background: "#16a34a",
    color: "white",
    fontWeight: 900,
    display: "inline-block",
  },
  headerTag: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "#111827",
    color: "white",
    fontSize: 12,
    fontWeight: 900,
    marginBottom: 10,
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  headerTitle: { fontSize: 18, fontWeight: 900, color: "#0f172a", wordBreak: "normal", overflowWrap: "break-word" },
  headerSub: { marginTop: 8, fontSize: 13, color: "#334155", lineHeight: 1.45, wordBreak: "normal", overflowWrap: "break-word" },
  planilhaOnlyWrap: {
    width: "100%",
    maxWidth: 720,
    margin: "14px auto 0 auto",
    borderRadius: 18,
    overflow: "hidden",
    background: "transparent",
  },
  planilhaOnlyImg: { width: "100%", height: "auto", display: "block", borderRadius: 18 },
  gridOne: {
    marginTop: 18,
    display: "grid",
    gap: 14,
    gridTemplateColumns: "minmax(260px, 700px)",
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
    overflow: "hidden",
    boxSizing: "border-box",
  },
  cardTitle: { fontSize: 16, fontWeight: 900, color: "#0f172a", wordBreak: "normal", overflowWrap: "break-word" },
  cardSubtitle: { fontSize: 12, color: "#64748b", marginTop: 4, wordBreak: "normal", overflowWrap: "break-word" },
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
  priceBox: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
  },
  oldPrice: { fontSize: 12, color: "#6b7280", textDecoration: "line-through", wordBreak: "normal", overflowWrap: "break-word" },
  newPrice: { marginTop: 6, fontSize: 20, fontWeight: 900, color: "#0f172a", wordBreak: "normal", overflowWrap: "break-word" },
  bullets: { listStyle: "none", padding: 0, margin: "12px 0 0 0" },
  bulletItem: {
    fontSize: 12,
    color: "#334155",
    marginTop: 8,
    lineHeight: 1.35,
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
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
  bonusSection: {
    marginTop: 16,
    borderRadius: 16,
    border: "2px solid #16a34a",
    background: "linear-gradient(180deg, #ecfdf5, #ffffff)",
    padding: 14,
    textAlign: "center",
    boxSizing: "border-box",
  },
  bonusHeaderBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#16a34a",
    color: "white",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.3,
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  bonusHeaderTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.25,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  bonusHeaderText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.55,
    color: "#334155",
    maxWidth: 620,
    marginLeft: "auto",
    marginRight: "auto",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  bonusGrid: {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
    alignItems: "start",
  },
  bonusCard: {
    border: "1px solid #d1fae5",
    background: "#ffffff",
    borderRadius: 14,
    padding: 12,
    textAlign: "left",
    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
    overflow: "hidden",
    boxSizing: "border-box",
    minWidth: 0,
  },
  bonusImageWrapVertical: {
    width: "100%",
    maxWidth: 240,
    margin: "0 auto 10px auto",
    borderRadius: 14,
    overflow: "hidden",
    background: "#0b1220",
    aspectRatio: "9 / 16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bonusImageVertical: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    background: "#000000",
  },
  bonusCardTitle: {
    fontSize: 14,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.3,
    textAlign: "center",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  bonusCardDesc: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 1.5,
    color: "#334155",
    textAlign: "left",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  h3: {
    fontSize: 13,
    letterSpacing: 0.6,
    margin: "0 0 10px 0",
    textAlign: "center",
  },
  bottomCtaBtn: {
    width: "100%",
    maxWidth: 420,
    padding: 16,
    borderRadius: 12,
    border: "none",
    background: "#16a34a",
    color: "white",
    fontSize: 18,
    fontWeight: 900,
    cursor: "pointer",
    margin: "18px auto 0 auto",
    display: "block",
    boxShadow: "0 10px 24px rgba(22, 163, 74, 0.28)",
    boxSizing: "border-box",
  },
};

const carouselStyles = {
  wrap: {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    margin: "0 auto",
  },
  viewport: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    background: "#0b1220",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "contain",
  },
  arrowBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    background: "rgba(15, 23, 42, 0.82)",
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 1,
    cursor: "pointer",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },
  dots: {
    marginTop: 12,
    display: "flex",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "none",
    background: "#16a34a",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

const guaranteeStyles = {
  wrap: {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    padding: 18,
    textAlign: "center",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 10,
    background: "#7c3aed",
    color: "white",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.3,
    marginBottom: 10,
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 20,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.25,
    marginBottom: 10,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  titleStrong: { color: "#7c3aed" },
  text: {
    maxWidth: 780,
    margin: "0 auto",
    fontSize: 14,
    color: "#334155",
    lineHeight: 1.6,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  footerLine: {
    marginTop: 12,
    fontSize: 14,
    color: "#0f172a",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  image: {
    width: "100%",
    maxWidth: 520,
    display: "block",
    margin: "14px auto 0 auto",
    borderRadius: 14,
  },
};

const exitStyles = {
  topAlert: {
    width: "100%",
    background: "#7f1d1d",
    color: "#ffffff",
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 900,
    fontSize: 14,
    marginBottom: 16,
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
    textAlign: "center",
  },
  heroWrap: {
    textAlign: "center",
  },
  heroBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "#111827",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 900,
    marginBottom: 10,
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.2,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  heroStrong: {
    color: "#dc2626",
  },
  heroText: {
    maxWidth: 760,
    margin: "10px auto 0 auto",
    fontSize: 15,
    color: "#334155",
    lineHeight: 1.6,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  timerBox: {
    marginTop: 16,
    display: "inline-block",
    background: "#111827",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 13,
    maxWidth: "100%",
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
    textAlign: "center",
  },
  timerValue: {
    marginLeft: 8,
    background: "#dc2626",
    borderRadius: 999,
    padding: "4px 8px",
    display: "inline-block",
  },
  priceCard: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
    gap: 18,
    alignItems: "center",
    border: "2px solid #fecaca",
    borderRadius: 20,
    padding: 18,
    background: "linear-gradient(180deg, #fff1f2, #ffffff)",
    overflow: "hidden",
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
  },
  priceImageCol: {
    width: "100%",
    minWidth: 0,
  },
  priceImage: {
    width: "100%",
    borderRadius: 16,
    display: "block",
    background: "#0b1220",
  },
  priceInfo: {
    textAlign: "left",
    minWidth: 0,
    width: "100%",
  },
  offerMiniTag: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#dc2626",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 900,
    maxWidth: "100%",
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  offerTitle: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.15,
    wordBreak: "normal",
    overflowWrap: "break-word",
    whiteSpace: "normal",
  },
  offerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.45,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  priceLineOld: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    textDecoration: "line-through",
    fontWeight: 700,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  priceLineNew: {
    marginTop: 6,
    fontSize: 34,
    color: "#dc2626",
    fontWeight: 900,
    lineHeight: 1.1,
    wordBreak: "normal",
    overflowWrap: "break-word",
    whiteSpace: "normal",
  },
  priceObs: {
    marginTop: 8,
    fontSize: 14,
    color: "#334155",
    lineHeight: 1.5,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  ctaBtn: {
    width: "100%",
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(22, 163, 74, 0.28)",
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
    whiteSpace: "normal",
  },
  backBtn: {
    width: "100%",
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
    whiteSpace: "normal",
  },
  bonusSection: {
    marginTop: 22,
    border: "2px solid #bbf7d0",
    borderRadius: 18,
    padding: 16,
    background: "linear-gradient(180deg, #f0fdf4, #ffffff)",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  sectionBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "#16a34a",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 900,
    marginBottom: 10,
    maxWidth: "100%",
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 1.2,
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  sectionText: {
    maxWidth: 760,
    margin: "10px auto 0 auto",
    fontSize: 14,
    color: "#334155",
    lineHeight: 1.6,
    textAlign: "center",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.72)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 560,
    background: "#ffffff",
    borderRadius: 22,
    padding: 22,
    position: "relative",
    boxShadow: "0 25px 60px rgba(0,0,0,0.28)",
    textAlign: "center",
    boxSizing: "border-box",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 12,
    border: "none",
    background: "transparent",
    fontSize: 30,
    lineHeight: 1,
    cursor: "pointer",
    color: "#475569",
  },
  badge: {
    display: "inline-block",
    background: "#111827",
    color: "#ffffff",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 900,
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  title: {
    marginTop: 14,
    fontSize: 28,
    lineHeight: 1.18,
    fontWeight: 900,
    color: "#0f172a",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  strong: {
    color: "#dc2626",
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 1.6,
    color: "#334155",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },
  ctaRow: {
    marginTop: 18,
    display: "grid",
    gap: 10,
  },
  primaryBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    fontSize: 17,
    fontWeight: 900,
    cursor: "pointer",
    boxSizing: "border-box",
  },
  secondaryBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    boxSizing: "border-box",
  },
};

/* =========================
   RESPONSIVO MOBILE
========================= */

if (typeof window !== "undefined") {
  const styleId = "quiz-mobile-exit-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      * {
        box-sizing: border-box;
      }

      html, body, #root {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
      }

      @media (max-width: 768px) {
        .quiz-root-page {
          padding: 10px !important;
          align-items: flex-start !important;
        }

        .quiz-main-card {
          border-radius: 18px !important;
          padding: 18px 14px !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
        }

        .exit-price-card-mobile {
          grid-template-columns: 1fr !important;
          gap: 14px !important;
          padding: 14px !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        .exit-title-mobile {
          font-size: 20px !important;
          line-height: 1.2 !important;
          text-align: left !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .exit-hero-title-mobile {
          font-size: 19px !important;
          line-height: 1.18 !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .exit-price-new-mobile {
          font-size: 22px !important;
          line-height: 1.1 !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .exit-mini-tag-mobile {
          font-size: 11px !important;
          line-height: 1.2 !important;
          max-width: 100% !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .exit-top-alert-mobile {
          font-size: 12px !important;
          line-height: 1.35 !important;
          padding: 10px 12px !important;
          text-align: center !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .exit-timer-box-mobile {
          font-size: 12px !important;
          line-height: 1.35 !important;
          padding: 9px 12px !important;
          text-align: center !important;
          max-width: 100% !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .exit-section-title-mobile {
          font-size: 18px !important;
          line-height: 1.2 !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .exit-cta-mobile {
          font-size: 15px !important;
          padding: 14px !important;
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }

        .offers-bottom-cta-mobile {
          font-size: 16px !important;
          padding: 14px !important;
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}