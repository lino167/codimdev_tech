// Textos do site em português. Nenhum texto visível fica fora deste arquivo (e do en.ts).
// Fonte: Livro da Marca (seção 8) e PROMPT-SITE.md. Preços e contatos ainda provisórios (SPEC, decisão 1).

export const pt = {
  meta: {
    lang: 'pt-BR',
    titulo: 'CodimDev · Sua empresa trabalhando sozinha',
    descricao:
      'Site, sistema e automação para pequenas e médias empresas. Diagnóstico grátis, direto com quem faz. Blumenau, SC, atendimento remoto.',
  },
  hero: {
    titulo1: 'Tudo',
    titulo2: 'conectado.',
    promessa: 'Sua empresa trabalhando sozinha.',
    apoio: 'Site que atrai, sistema que organiza, IA que executa. Eu sou o Zacarias, e você fala direto comigo.',
    botaoPrincipal: 'Fazer diagnóstico grátis',
    botaoSecundario: 'Ver como funciona',
  },
} as const;

export type Textos = typeof pt;
