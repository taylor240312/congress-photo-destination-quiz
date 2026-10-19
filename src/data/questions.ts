import hero from "@/assets/hero.jpg";
import q1 from "@/assets/q1.jpg";
import q2 from "@/assets/q2.jpg";
import q3 from "@/assets/q3.jpg";
import q4 from "@/assets/q4.jpg";
import q5 from "@/assets/q5.jpg";
import q6 from "@/assets/q6.jpg";
import q7 from "@/assets/q7.jpg";
import q8 from "@/assets/q8.jpg";
import q9 from "@/assets/q9.jpg";

/**
 * "lean" indica a que conjunto de conteúdos editoriais a alternativa se aproxima
 * (orientação geral de prioridades, não propostas oficiais). "neutral" não pesa.
 */
export type Lean = "lula" | "flavio" | "neutral";

export interface QuizOption {
  id: string;
  label: string;
  lean: Lean;
}

export interface QuizQuestion {
  id: string;
  theme: string;
  title: string;
  image: string;
  imageAlt: string;
  options: QuizOption[];
}

export const heroImage = hero;

export const questions: QuizQuestion[] = [
  {
    id: "impostos",
    theme: "Impostos e custo de vida",
    title: "Para aliviar o custo de vida, o que deve vir primeiro?",
    image: q1,
    imageAlt: "Família a fazer compras numa feira de rua",
    options: [
      { id: "a", label: "Isentar de imposto quem ganha menos e taxar mais os altos rendimentos", lean: "lula" },
      { id: "b", label: "Cortar impostos para todos e reduzir o tamanho do Estado", lean: "flavio" },
      { id: "c", label: "Simplificar o sistema sem mudar muito a carga total", lean: "neutral" },
    ],
  },
  {
    id: "economia",
    theme: "Economia e emprego",
    title: "Qual o melhor motor para gerar empregos?",
    image: q2,
    imageAlt: "Trabalhadores numa fábrica brasileira",
    options: [
      { id: "a", label: "Investimento público e bancos estatais a impulsionar a indústria", lean: "lula" },
      { id: "b", label: "Menos regras e mais liberdade para as empresas privadas", lean: "flavio" },
      { id: "c", label: "Um equilíbrio entre os dois", lean: "neutral" },
    ],
  },
  {
    id: "seguranca",
    theme: "Segurança pública",
    title: "Como enfrentar a violência nas cidades?",
    image: q3,
    imageAlt: "Viatura policial numa rua urbana ao entardecer",
    options: [
      { id: "a", label: "Penas mais duras e mais poder para as polícias", lean: "flavio" },
      { id: "b", label: "Inteligência, prevenção social e coordenação nacional", lean: "lula" },
      { id: "c", label: "Facilitar a posse de armas para defesa pessoal", lean: "flavio" },
      { id: "d", label: "Controlar mais rigorosamente o acesso a armas", lean: "lula" },
    ],
  },
  {
    id: "saude",
    theme: "Saúde",
    title: "Qual deve ser o papel do SUS?",
    image: q4,
    imageAlt: "Profissionais de saúde num corredor hospitalar",
    options: [
      { id: "a", label: "Reforçar o SUS com mais verba pública", lean: "lula" },
      { id: "b", label: "Ampliar parcerias com o setor privado para ganhar eficiência", lean: "flavio" },
      { id: "c", label: "Manter o modelo atual, mas melhorar a gestão", lean: "neutral" },
    ],
  },
  {
    id: "social",
    theme: "Programas sociais",
    title: "Programas de transferência de renda devem…",
    image: q5,
    imageAlt: "Família brasileira a partilhar uma refeição em casa",
    options: [
      { id: "a", label: "Ser ampliados e ter valores maiores", lean: "lula" },
      { id: "b", label: "Ter regras mais rígidas e portas de saída para o emprego", lean: "flavio" },
      { id: "c", label: "Continuar como estão", lean: "neutral" },
    ],
  },
  {
    id: "educacao",
    theme: "Educação",
    title: "Qual a prioridade na educação?",
    image: q6,
    imageAlt: "Estudantes numa sala de aula de escola pública",
    options: [
      { id: "a", label: "Mais universidades e institutos federais públicos", lean: "lula" },
      { id: "b", label: "Escolas cívico-militares e mais disciplina", lean: "flavio" },
      { id: "c", label: "Ensino técnico ligado ao mercado de trabalho", lean: "neutral" },
    ],
  },
  {
    id: "infra",
    theme: "Infraestruturas",
    title: "Quem deve liderar as grandes obras?",
    image: q7,
    imageAlt: "Vista aérea de obras numa autoestrada",
    options: [
      { id: "a", label: "O Estado, com um grande programa de investimento público", lean: "lula" },
      { id: "b", label: "A iniciativa privada, por concessões e privatizações", lean: "flavio" },
    ],
  },
  {
    id: "gastos",
    theme: "Gastos públicos",
    title: "Sobre as contas públicas, o que é mais importante?",
    image: q8,
    imageAlt: "Congresso Nacional em Brasília num dia nublado",
    options: [
      { id: "a", label: "Cortar despesas, mesmo que isso reduza serviços", lean: "flavio" },
      { id: "b", label: "Gastar para estimular a economia e proteger os mais pobres", lean: "lula" },
      { id: "c", label: "Equilibrar as contas aos poucos, sem cortes bruscos", lean: "neutral" },
    ],
  },
  {
    id: "futuro",
    theme: "Futuro do Brasil",
    title: "Que valor deve guiar o Brasil na próxima década?",
    image: q9,
    imageAlt: "Brasília ao amanhecer",
    options: [
      { id: "a", label: "Redução das desigualdades e inclusão social", lean: "lula" },
      { id: "b", label: "Liberdade económica, família e valores tradicionais", lean: "flavio" },
      { id: "c", label: "Crescimento sustentável e proteção do ambiente", lean: "lula" },
      { id: "d", label: "Ordem, segurança e combate à corrupção", lean: "flavio" },
    ],
  },
];

/** Pergunta extra neutra mostrada apenas em caso de empate. */
export const tiebreakerQuestion: QuizQuestion = {
  id: "desempate",
  theme: "Última escolha",
  title: "Se tivesses de escolher um só foco para o próximo governo?",
  image: q9,
  imageAlt: "Brasília ao amanhecer",
  options: [
    { id: "a", label: "Proteger quem mais precisa", lean: "lula" },
    { id: "b", label: "Dar mais liberdade a quem empreende", lean: "flavio" },
  ],
};

export const SECONDS_PER_QUESTION = 8;
