// Textos do site em português. Nenhum texto visível fica fora deste arquivo (e do en.ts).
// Fonte: Livro da Marca (seção 8) e PROMPT-SITE.md. Preços e contatos ainda provisórios (SPEC, decisão 1).

export const pt = {
  meta: {
    lang: 'pt-BR',
    titulo: 'CodimDev · Site, sistema e automação para pequenas empresas',
    descricao:
      'Site, sistema e automação para pequenas e médias empresas. Diagnóstico grátis, direto com quem faz. Blumenau, SC, atendimento remoto.',
  },
  loader: {
    rotulo: 'Conectando',
    rotuloHd: 'Conectando em HD',
    aria: 'Carregando a página',
  },
  hero: {
    titulo1: 'Tudo',
    titulo2: 'conectado.',
    // h1: diz de cara o que o site vende (serviços) e o resultado para o dono (escolhido em 02/11/2026)
    promessa: 'Site, sistema e automação para a sua empresa parar de depender de você.',
    // apoio: cada serviço vira uma cena do dia a dia do Marcos; fecha com "direto com quem faz"
    apoio:
      'Cliente que te encontra no Google, pedido que cai sozinho na planilha, WhatsApp que responde e agenda 24 h por dia. Direto com quem faz: eu, Zacarias.',
    // botão em primeira pessoa (Livro da Marca, microtextos) + a linha de informação embaixo (nada de "sem spam")
    botaoPrincipal: 'Mapear minha empresa',
    botaoSecundario: 'Ver projetos',
    // espaços que não quebram: "24 h úteis" nunca fica órfão no fim da linha
    nota: 'Diagnóstico grátis · 2 minutos · resposta em até 24 h úteis',
  },
} as const;

export type Textos = typeof pt;
