// Índice de projetos. Só trabalhos reais. `ano` null = ainda não confirmado (a célula fica vazia).
export const filtros = [
  { id: 'todos', nome: 'Todos' },
  { id: 'sistemas', nome: 'Sistemas' },
  { id: 'sites', nome: 'Sites' },
  { id: 'identidade', nome: 'Identidade' },
  { id: 'motion', nome: 'Motion' },
];

const p = (ano, cliente, disciplina, tipo, filtro, foto) => ({
  ano,
  cliente,
  disciplina,
  tipo,
  filtro,
  foto: `/trabalhos/real/${foto}.webp`,
});

export const projetos = [
  p(2026, 'Marca CodimDev', 'Identidade visual', 'Estúdio próprio', 'identidade', 'i-marca'),
  p(2026, 'Vinheta CodimDev', 'Motion', 'Estúdio próprio', 'motion', 'i-vinheta'),
  p(2026, 'Bastidores: Kraflo OS Bot', 'Motion', 'Vídeo de processo', 'motion', 'i-bastidores'),
  p(2024, 'Val Serviços', 'Identidade visual', 'Empreiteira', 'identidade', 'i-val'),
  p(null, 'Tenua', 'Identidade visual', 'Ateliê de crochê', 'identidade', 'i-tenua-marca'),
  p(null, 'Tenua', 'Site', 'Ateliê de crochê', 'sites', 'i-tenua-site'),
  p(null, 'Kraflo CMMS', 'Sistema de manutenção', 'Manutenção industrial', 'sistemas', 'i-kraflo'),
  p(null, 'Kraflo OS Bot', 'Bot no Telegram', 'Manutenção industrial', 'sistemas', 'i-bot'),
];

export const TOTAL_PROJETOS = projetos.length;
