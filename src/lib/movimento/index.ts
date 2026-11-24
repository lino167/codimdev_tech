// Ordem de inicialização do site (chamado pelo Base.astro). Único ponto de entrada da animação.
// 1. A carga começa antes de tudo (fontes; no ?hd, também as imagens). 2. O carregador acompanha os bytes e, no fim,
// a tela se abre. 3. Depois dele: Lenis, cabeçalho e as entradas de texto por tempo. 4. O cabeçalho aparece perto do
// fim da abertura. 5. ScrollTrigger.refresh() agora e de novo quando as fontes estiverem prontas.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { carga, ARQUIVOS_FONTES } from './carga';
import { loader } from './loader';
import { suave } from './suave';
import { revelar } from './revelar';
import { prepararNav } from './nav';
import { prepararAbertura } from './abertura';
import { escapa } from './escapa';
import { tunel } from './tunel';
import { peca } from './peca';

gsap.registerPlugin(ScrollTrigger);

/** Segundos depois da abertura da tela em que o cabeçalho aparece. */
const CABECALHO_APARECE = 0.5;

export async function iniciar() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hd = new URLSearchParams(location.search).has('hd');
  const nav = prepararNav();
  // as letras do título esperam escondidas atrás do carregador; a barrinha começa a escrever quando a tela se abre
  const abertura = prepararAbertura(reduzido);

  const c = carga(ARQUIVOS_FONTES);
  await loader({ carga: c, hd, reduzido });

  const rolagem = suave({ reduzido });
  nav.ligar(rolagem);
  // ordem: a peça (que prende o palco) vem primeiro, para os gatilhos de baixo contarem com o espaço do pin
  tunel({ reduzido });
  peca({ reduzido });
  revelar({ reduzido });
  escapa(reduzido);
  abertura?.entrar();
  if (reduzido) nav.mostrar();
  else gsap.delayedCall(CABECALHO_APARECE, () => nav.mostrar());

  ScrollTrigger.refresh();
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
  return { carga: c };
}
