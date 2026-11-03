// Os quatro cases do túnel. `parede` é o lugar do plano antes de ser puxado (ângulo em radianos, raio).
// A profundidade de cada um fica em PROF_DESTAQUES (src/motion/cena.js), na mesma ordem.
// `ano` e `onde` ficam null enquanto não forem confirmados: a linha do case mostra só o que existe.
// Fotos provisórias (pranchas com a tela ou a logo real) até as fotos de 03_imagens/portfolio chegarem.
export const casos = [
  {
    slug: 'tenua',
    foto: '/trabalhos/real/destaque-tenua.webp',
    cliente: 'Tenua',
    ano: null,
    disciplina: 'Identidade visual e site',
    onde: null,
    resumo: 'Ateliê de crochê autoral. A logo virou uma linha só, que é abraço e trama ao mesmo tempo.',
    parede: { ang: 0.35, raio: 4.4 },
  },
  {
    slug: 'kraflo',
    foto: '/trabalhos/real/destaque-kraflo.webp',
    cliente: 'Kraflo',
    ano: null,
    disciplina: 'Sistema e automação',
    onde: null,
    resumo: 'Manutenção com IA. Ordens de serviço, ativos e um bot que abre o chamado com uma foto.',
    parede: { ang: 2.6, raio: 4.6 },
  },
  {
    slug: 'val',
    foto: '/trabalhos/real/destaque-val.webp',
    cliente: 'Val Serviços',
    ano: 2024,
    disciplina: 'Identidade visual',
    onde: null,
    resumo: 'Empreiteira de duas pessoas, serviço de pedreiro. Uma marca para chegar na obra com cara de empresa grande.',
    parede: { ang: 5.2, raio: 4.3 },
  },
  {
    slug: 'codimdev',
    foto: '/trabalhos/real/destaque-marca.webp',
    cliente: 'CodimDev',
    ano: 2026,
    disciplina: 'Identidade e motion',
    onde: 'Blumenau',
    resumo: 'A minha própria marca. Dois C ligados por um elo vermelho: tudo conectado.',
    parede: { ang: 1.4, raio: 4.5 },
  },
];

export const metaDoCaso = (c) => [c.ano, c.disciplina, c.onde].filter(Boolean).join(' · ');
