// Ordem de inicialização do site (chamado pelo Base.astro). Único ponto de entrada da animação.
// Hoje: fontes pela carga (FontFace a partir dos bytes), o mundo no ticker do GSAP e a entrada do hero.
// O loader com o contador (T4), os reveals, o Lenis e a nav (T7) entram aqui, nesta ordem, nas próximas fatias.
import { gsap } from 'gsap';
import { criarMundo, type Mundo } from '../mundo/mundo';
import { carga, ARQUIVOS_FONTES } from './carga';
import { entrada } from './entrada';

/** Até o loader existir (T4), a entrada espera as fontes no máximo este tempo. */
const ESPERA_FONTES_MS = 2500;

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
  const raiz = document.documentElement;
  if (mundo) {
    const m = mundo;
    gsap.ticker.add(() => m.quadro());
    raiz.classList.add('tem-gl');
  } else {
    raiz.classList.add('sem-gl');
  }

  // a entrada começa com as fontes aplicadas (sem troca de fonte no meio do movimento) ou no limite
  const limite = new Promise<void>((ok) => setTimeout(ok, ESPERA_FONTES_MS));
  void Promise.race([c.pronta, limite]).then(() => {
    mundo?.medir();
    entrada({ mundo, reduzido });
  });

  // só no `astro dev`: reprisar a entrada em câmera lenta para conferir quadro a quadro (fora do build)
  if (import.meta.env.DEV) {
    const m = mundo;
    Object.assign(window, {
      __codimdev: {
        mundo: m,
        reprisar(velocidade = 1) {
          if (m) Object.assign(m.estado, { forma: 0, abre: 1, elos: 0, brilho: 0 });
          raiz.classList.add('is-loading');
          gsap.globalTimeline.timeScale(velocidade);
          return entrada({ mundo: m, reduzido });
        },
      },
    });
  }
  return { mundo, carga: c };
}
