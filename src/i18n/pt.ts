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
  barra: ['codimdev', 'Desenvolvimento web', 'Blumenau, SC', '2026'],
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
  // abertura da página inicial (cena 01): a animação de escrita entra na Parte 2
  abertura: {
    titulo: { antes: 'Seu site deveria ', destaque: 'vender', depois: '. Não só existir.' },
    apoio:
      'Landing pages, sites e sistemas web para empresas. Eu desenho e programo a mesma peça, do protótipo ao site no ar.',
    botaoPrincipal: 'Pedir orçamento',
    botaoSecundario: 'Ver projetos',
    nota: 'Orçamento pelo WhatsApp · resposta em até 24 horas úteis',
  },
} as const;

export type Textos = typeof pt;
