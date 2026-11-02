// Ordem de inicialização do site (chamado pelo Base.astro). Único ponto de entrada da animação.
// Fatia T2: fontes pela carga (FontFace a partir dos bytes) e o mundo desenhando o símbolo no ticker do GSAP.
// O loader (T4), a entrada (T3), os reveals, o Lenis e a nav (T7) entram aqui, nesta ordem, nas próximas fatias.
import { gsap } from 'gsap';
import { criarMundo, type Mundo } from '../mundo/mundo';
import { carga, ARQUIVOS_FONTES } from './carga';

export function iniciar() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const c = carga(ARQUIVOS_FONTES);

  let mundo: Mundo | null = null;
  try {
    mundo = criarMundo({ reduzido });
  } catch (e) {
    console.error(e);
  }
  if (mundo) {
    const m = mundo;
    gsap.ticker.add(() => m.quadro());
    document.documentElement.classList.add('tem-gl');
  } else {
    document.documentElement.classList.add('sem-gl');
  }

  // com as fontes aplicadas, o layout do título muda: o mundo mede de novo
  void c.pronta.then(() => mundo?.medir());
  return { mundo, carga: c };
}
