// Ordem de inicialização do site (chamado pelo Base.astro). Único ponto de entrada da animação.
// 1. A carga começa antes de tudo (fontes; no ?hd, também as imagens). 2. O mundo nasce e desenha no ticker.
// 3. Com as fontes aplicadas, o título é rasterizado de novo, ainda durante o loader. 4. O loader acompanha os
// bytes e, no fim, a entrada continua de onde ele parou. Os reveals, o Lenis e a nav (T7) entram depois do loader.
import { gsap } from 'gsap';
import { criarMundo, type Mundo } from '../mundo/mundo';
import { carga, ARQUIVOS_FONTES } from './carga';
import { loader } from './loader';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { entrada } from './entrada';
import { suave } from './suave';
import { revelar } from './revelar';
import { prepararNav } from './nav';

/** Segundo da entrada em que a nav aparece (junto da promessa e dos botões do hero). */
const NAV_APARECE = 2.6;

export async function iniciar() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  const nav = prepararNav();
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hd = new URLSearchParams(location.search).has('hd');

  // (no ?hd entram também as imagens do mundo, quando existirem: fatia T5)
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

  // com as fontes aplicadas, o título é rasterizado de novo (ainda durante o loader, não no quadro da passagem)
  void c.pronta.then(() => mundo?.medir(true));

  await loader({ mundo, carga: c, hd, reduzido });
  // depois do loader: Lenis, nav e as entradas de texto por tempo; a nav aparece perto do fim da entrada do hero
  const suaveRolagem = suave({ reduzido });
  nav.ligar(suaveRolagem);
  revelar({ reduzido });
  const tl = entrada({ mundo, reduzido });
  if (reduzido) nav.mostrar();
  else tl.add(() => nav.mostrar(), NAV_APARECE);
  ScrollTrigger.refresh();

  // só no `astro dev`: reprisar a entrada em câmera lenta para conferir quadro a quadro (fora do build)
  if (import.meta.env.DEV) {
    const m = mundo;
    Object.assign(window, {
      __codimdev: {
        mundo: m,
        reprisar(velocidade = 1) {
          // mata a entrada anterior (se ainda estiver rodando) para as duas não brigarem pelo mesmo estado
          gsap.globalTimeline.getChildren(false, true, true).forEach((t) => t.kill());
          if (m) gsap.killTweensOf(m.estado);
          if (m)
            Object.assign(m.estado, {
              forma: 1,
              abre: 1,
              elos: 0,
              brilho: 0,
              alcance: 0,
              voo: -1,
              solido: 0,
              final: 0,
              solidez: 1,
            });
          raiz.classList.add('is-loading');
          gsap.globalTimeline.timeScale(velocidade);
          return entrada({ mundo: m, reduzido });
        },
      },
    });
  }
  return { mundo, carga: c };
}
