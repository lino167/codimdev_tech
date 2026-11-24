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
import { prepararHero } from '../hero';
import { prepararNav } from './nav';

gsap.registerPlugin(ScrollTrigger);

/** Segundos depois da abertura da tela em que o cabeçalho aparece. */
const CABECALHO_APARECE = 0.5;

export async function iniciar() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hd = new URLSearchParams(location.search).has('hd');
  const nav = prepararNav();
  // as partículas (imagens e pontos) se preparam atrás do carregador; a história começa quando a tela se abre
  const hero = prepararHero({ reduzido });

  const c = carga(ARQUIVOS_FONTES);
  // a tela só abre com o hero pronto (ou depois de 4,5 s: o hero cai para a foto)
  const espera = hero ? Promise.race([hero.pronto, new Promise((r) => setTimeout(r, 4500))]) : undefined;
  await loader({ carga: c, hd, reduzido, espera });

  const rolagem = suave({ reduzido });
  nav.ligar(rolagem);
  revelar({ reduzido });
  hero?.entrar();
  if (reduzido) nav.mostrar();
  else gsap.delayedCall(CABECALHO_APARECE, () => nav.mostrar());

  ScrollTrigger.refresh();
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
  return { carga: c };
}
