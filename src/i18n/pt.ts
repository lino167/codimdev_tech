// Textos do site em português. Nenhum texto visível fica fora deste arquivo (e do en.ts, que vem depois).
// Fonte: Livro da marca v1.0 (24/11/2026) e prompt-site.md. Grafia: "codimdev", tudo junto e minúsculo, sempre.
// Linhas marcadas com `// sotaque` carregam uma expressão do Piauí (regras em historia.md): no máximo uma por cena,
// e nunca em serviço, combinado, formulário, erro ou privacidade.

export const pt = {
  meta: {
    lang: 'pt-BR',
    titulo: 'codimdev · Landing pages, sites e sistemas web para empresas',
    descricao:
      'Landing pages, sites e sistemas web para empresas, com design e código pela mesma pessoa. Do protótipo ao site no ar. Orçamento pelo WhatsApp.',
  },
  carregador: {
    rotulo: 'Já já', // sotaque
    aria: 'Carregando a página',
  },
  pular: 'Pular para o conteúdo',
  cabecalho: {
    marca: 'codimdev',
    aria: 'Principal',
    links: [
      { rotulo: 'Serviços', href: '/servicos' },
      { rotulo: 'Projetos', href: '/projetos' },
      { rotulo: 'Como funciona', href: '/como-funciona' },
      { rotulo: 'Sobre', href: '/sobre' },
    ],
    cta: 'Pedir orçamento',
    ctaHref: '/orcamento',
    menu: 'Menu',
    fechar: 'Fechar',
  },
  // a barra de quatro colunas em mono, no topo de cada página
  rodape: {
    aria: 'Rodapé',
    colunas: [
      {
        titulo: 'Serviços',
        links: [
          { rotulo: 'Landing pages', href: '/servicos/landing-page' },
          { rotulo: 'Sites institucionais', href: '/servicos/site-institucional' },
          { rotulo: 'Redesign e conversão', href: '/servicos/redesign-e-conversao' },
          { rotulo: 'Interfaces e sistemas', href: '/servicos/interfaces-e-sistemas' },
          { rotulo: 'Design system', href: '/servicos/design-system' },
        ],
      },
      {
        titulo: 'Conheça',
        links: [
          { rotulo: 'Projetos', href: '/projetos' },
          { rotulo: 'Como funciona', href: '/como-funciona' },
          { rotulo: 'Sobre', href: '/sobre' },
        ],
      },
      {
        titulo: 'Fale comigo',
        links: [
          { rotulo: 'Pedir orçamento', href: '/orcamento' },
          { rotulo: 'Privacidade', href: '/privacidade' },
        ],
      },
    ],
    contato: 'Contato',
    instagram: 'Instagram',
    email: 'E-mail',
    legal: 'codimdev · desenvolvimento web · 2026',
    piaui: 'feito por um piauiense', // sotaque: a origem, sem palavra
    topo: 'Voltar ao topo',
  },
  // cena 01: a barrinha-cursor escreve o título (movimento/abertura.ts)
  abertura: {
    titulo: { antes: 'Seu site deveria ', destaque: 'vender', depois: '. Não só existir.' },
    apoio:
      'Landing pages, sites e sistemas web para empresas. Eu desenho e programo a mesma peça, do protótipo ao site no ar.',
    botaoPrincipal: 'Pedir orçamento',
    botaoSecundario: 'Ver projetos',
    nota: 'Orçamento pelo WhatsApp · resposta em até 24 horas úteis',
    foto: 'Zacarias, de braços cruzados, de frente para você',
  },
  // os dois cursores que montam a página (motor/cursores.ts)
  motor: { design: 'design', codigo: 'código' },
  // cena 02: a barrinha risca a parte que falha em cada frase
  escapa: {
    frases: [
      { antes: 'Seu anúncio paga o clique. Sua página ', falha: 'perde o lead', depois: '.' },
      { antes: 'Seu formulário está ', falha: 'espantando cliente', depois: '.' },
      { antes: 'Planilha ', falha: 'não é sistema de gestão', depois: '.' },
    ],
    apoio: 'Eu começo pelo que está custando venda, não pelo que é bonito.',
  },
  // cena 03, a peça principal: uma janela de navegador riscada em cinco etapas
  peca: {
    rotulo: 'Como funciona',
    titulo: { antes: 'Uma conversa vira protótipo, vira código e vai ao ', destaque: 'ar', depois: '.' },
    ilustracao: 'Ilustração',
    abas: ['01 · conversa', '02 · protótipo', '03 · código', '04 · testes', '05 · no ar'],
    etapas: [
      {
        rotulo: 'Etapa 1 · Conversa',
        frase: 'Uma conversa…',
        fato: 'Proposta por escrito antes de começar: escopo, prazo, preço e o que não está incluso. Nada começa sem aceite.',
      },
      {
        rotulo: 'Etapa 2 · Protótipo',
        frase: '…vira protótipo…',
        fato: 'Você clica nas telas antes de qualquer código. São 2 rodadas de ajuste.',
      },
      {
        rotulo: 'Etapa 3 · Código',
        frase: '…vira código…',
        fato: 'Design e código pela mesma pessoa, sem ruído entre etapas.',
      },
      {
        rotulo: 'Etapa 4 · Testes',
        frase: '…passa nos testes…',
        fato: 'Versão de celular, velocidade e formulários testados.',
      },
      {
        rotulo: 'Etapa 5 · No ar',
        frase: '…e vai ao ar.',
        fato: 'Site no ar, um guia curto de uso e 15 dias para pequenos ajustes.', // confirmar os 15 dias
      },
    ],
    // o que aparece desenhado dentro da janela (é uma ilustração, não um site de verdade)
    proposta: { titulo: 'PROPOSTA', linhas: ['Escopo', 'Prazo', 'Preço'] },
    codigo: [
      '<section class="hero">',
      '  <h1>Uma página',
      '  que vende.</h1>',
      '  <a href="/orcamento">',
      '    Pedir orçamento',
      '  </a>',
      '</section>',
      '.hero { display: grid;',
      '  gap: 24px; }',
    ],
    mock: { titulo: ['Uma página', 'que vende.'], botao: 'Pedir orçamento' },
    endereco: 'suaempresa.com.br',
    noAr: 'NO AR',
    checklist: ['celular', 'velocidade', 'formulário'],
  },
  // cena 04: a única cena escura
  noAr: {
    titulo: { antes: 'Pronto. Agora o site ', destaque: 'trabalha', depois: ' para você.' }, // sotaque: pronto
    apoio: 'Cada tela existe para vender, informar ou poupar tempo.',
  },
} as const;

export type Textos = typeof pt;
