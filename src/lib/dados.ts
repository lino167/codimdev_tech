// Tudo o que muda no site e não é texto de interface fica aqui: contatos e links. Um lugar só.
// Os textos visíveis ficam em src/i18n/pt.ts (nenhum texto visível fora dele).

export const CONTATO = {
  /** WhatsApp da codimdev, só dígitos com país e DDD */
  whatsapp: '5547996496281',
  whatsappLink: 'https://wa.me/5547996496281',
  email: 'contato@codimdev.com.br',
  emailLink: 'mailto:contato@codimdev.com.br',
  instagram: '@codimdev',
  instagramLink: 'https://instagram.com/codimdev',
} as const;

/** Domínio de produção (confirmar o registro antes de publicar). */
export const SITE = 'https://codimdev.com.br';

/** Resposta prometida, em horas úteis. Aparece em vários textos: mude só aqui e em pt.ts. */
export const RESPOSTA_HORAS_UTEIS = 24;
