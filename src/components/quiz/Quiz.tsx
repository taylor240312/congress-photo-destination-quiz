import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import {
  heroImage,
  questions,
  tiebreakerQuestion,
  SECONDS_PER_QUESTION,
  type QuizQuestion,
} from "@/data/questions";
import { analyzeAnswers } from "@/lib/analyze.functions";
import { deterministicDecision } from "@/lib/scoring";
import { getDestinationUrl, type Destination } from "@/config/destinations";

type Phase = "intro" | "quiz" | "analyzing" | "error" | "unavailable";

export function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [leaving, setLeaving] = useState(false);
  const [useTiebreaker, setUseTiebreaker] = useState(false);
  const inFlight = useRef(false);
  const analyze = useServerFn(analyzeAnswers);

  const flow: QuizQuestion[] = useTiebreaker ? [...questions, tiebreakerQuestion] : questions;
  const current = flow[index];
  const minutes = Math.max(1, Math.round((questions.length * SECONDS_PER_QUESTION) / 60));

  // Pré-carrega imagens para evitar saltos
  useEffect(() => {
    flow.forEach((q) => {
      const img = new Image();
      img.src = q.image;
    });
  }, [flow]);

  const finish = useCallback(
    (dest: Destination) => {
      const url = getDestinationUrl(dest);
      if (url) window.location.assign(url);
      else setPhase("unavailable");
    },
    [],
  );

  const runAnalysis = useCallback(
    async (finalAnswers: Record<string, string>, f: QuizQuestion[]) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setPhase("analyzing");
      const picked = f.map((q) => ({ q, o: q.options.find((o) => o.id === finalAnswers[q.id])! }));
      try {
        const res = await analyze({
          data: {
            answers: picked.map(({ q, o }) => ({ theme: q.theme, question: q.title, answer: o.label })),
          },
        });
        if (res.decision !== "insufficient") return finish(res.decision);
        // Desempate transparente: maioria simples das escolhas
        const det = deterministicDecision(picked.map((p) => p.o.lean));
        if (det) return finish(det);
        if (!f.includes(tiebreakerQuestion)) {
          inFlight.current = false;
          setUseTiebreaker(true);
          setIndex(questions.length);
          setPhase("quiz");
          return;
        }
        finish(picked[picked.length - 1].o.lean === "flavio" ? "flavio" : "lula");
      } catch (e) {
        console.error(e);
        setPhase("error");
      } finally {
        inFlight.current = false;
      }
    },
    [analyze, finish],
  );

  const choose = (optionId: string) => {
    if (leaving) return;
    const prev = answers[current.id];
    let next = { ...answers, [current.id]: optionId };
    // Alterar uma resposta invalida as respostas posteriores
    if (prev && prev !== optionId) {
      const keep = new Set(flow.slice(0, index + 1).map((q) => q.id));
      next = Object.fromEntries(Object.entries(next).filter(([k]) => keep.has(k)));
      if (useTiebreaker && index < questions.length) setUseTiebreaker(false);
    }
    setAnswers(next);
    setLeaving(true);
    window.setTimeout(() => {
      setLeaving(false);
      const activeFlow = prev && prev !== optionId && index < questions.length ? questions : flow;
      if (index + 1 < activeFlow.length) setIndex(index + 1);
      else runAnalysis(next, activeFlow);
    }, 280);
  };

  const back = () => {
    if (index === 0) setPhase("intro");
    else setIndex(index - 1);
  };

  if (phase === "intro") {
    return (
      <main className="relative min-h-dvh overflow-hidden">
        <img
          src={heroImage}
          alt="Congresso Nacional em Brasília ao pôr do sol"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col justify-end px-6 pb-14 pt-24 text-primary-foreground sm:pb-20">
          <span className="animate-fade-up mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
            Especial editorial · Brasil
          </span>
          <h1 className="animate-fade-up font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            Que Brasil você quer para amanhã?
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl text-lg text-primary-foreground/85">
            Explore prioridades e propostas para impostos, segurança, saúde, educação e muito mais. Responda com
            sinceridade — não há respostas certas.
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-5">
            <button
              onClick={() => {
                setIndex(0);
                setPhase("quiz");
              }}
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-soft transition hover:brightness-110 active:scale-[0.98]"
            >
              Começar o quiz
              <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </button>
            <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/80">
              <Clock className="size-4" /> {questions.length} perguntas · cerca de {minutes} min
            </span>
          </div>
          <p className="mt-10 text-xs text-primary-foreground/60">
            Projeto editorial independente. Não é uma ferramenta oficial de nenhum candidato, partido ou instituição.
          </p>
        </div>
      </main>
    );
  }

  if (phase === "analyzing" || phase === "error" || phase === "unavailable") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-primary-deep px-6 text-primary-foreground">
        <div className="w-full max-w-md text-center animate-fade-up">
          {phase === "analyzing" && (
            <>
              <h2 className="font-display text-3xl font-extrabold">Analisando suas respostas…</h2>
              <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-primary-foreground/15">
                <div className="h-full w-2/5 rounded-full bg-accent animate-indeterminate" />
              </div>
            </>
          )}
          {phase === "error" && (
            <>
              <h2 className="font-display text-3xl font-extrabold">Não foi possível concluir a análise</h2>
              <p className="mt-3 text-primary-foreground/75">Verifique sua conexão e tente novamente.</p>
              <button
                onClick={() => runAnalysis(answers, flow)}
                className="mt-8 rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground"
              >
                Tentar novamente
              </button>
            </>
          )}
          {phase === "unavailable" && (
            <>
              <h2 className="font-display text-3xl font-extrabold">Obrigado por participar</h2>
              <p className="mt-3 text-primary-foreground/75">O conteúdo de destino ainda não está disponível.</p>
            </>
          )}
        </div>
      </main>
    );
  }

  const progress = ((index + (leaving ? 1 : 0)) / flow.length) * 100;
  const selected = answers[current.id];

  return (
    <main className="min-h-dvh bg-background lg:grid lg:grid-cols-2">
      <div className="relative h-[34dvh] overflow-hidden bg-primary-deep lg:sticky lg:top-0 lg:h-dvh">
        <img
          key={current.id}
          src={current.image}
          alt={current.imageAlt}
          width={1200}
          height={912}
          className="animate-img-in absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay opacity-60" />
        <span className="absolute bottom-4 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
          {current.theme}
        </span>
      </div>

      <section className="mx-auto flex w-full max-w-xl flex-col px-6 py-6 lg:justify-center lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={back}
            aria-label="Pergunta anterior"
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Voltar
          </button>
          <span className="text-sm font-semibold text-primary">
            {index + 1} / {flow.length}
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div key={current.id} className={leaving ? "opacity-0 transition-opacity duration-200" : "animate-fade-up"}>
          <h2 className="mt-8 font-display text-3xl font-extrabold leading-tight tracking-tight text-primary-deep sm:text-4xl">
            {current.title}
          </h2>
          <div className="mt-7 flex flex-col gap-3">
            {current.options.map((o) => {
              const isSel = selected === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => choose(o.id)}
                  aria-pressed={isSel}
                  className={`flex items-center justify-between gap-4 rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition active:scale-[0.99] ${
                    isSel
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-border bg-card text-card-foreground hover:border-primary/60 hover:bg-secondary"
                  }`}
                >
                  {o.label}
                  <ArrowRight className={`size-4 shrink-0 ${isSel ? "opacity-100" : "opacity-30"}`} />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
