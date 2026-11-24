// Entrada do texto POR TEMPO, uma vez, quando o bloco chega na tela (o scroll só dispara, nunca conduz).
// [data-linhas]: o título é quebrado nos <br> e cada linha sobe de uma máscara (1,1 s expo.out, stagger 0,085).
// [data-revelar]: bloco que entra por opacidade + 30 px (data-delay, em segundos, para cascata em grades).
// Movimento reduzido: nada é escondido. Sem JS: nada é escondido (o estado inicial é posto aqui, no JS).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INICIO = 'top 88%';

/** Embrulha cada linha (separada por <br>) numa máscara, devolvendo os spans que sobem. */
function dividirLinhas(el: HTMLElement): HTMLElement[] {
  const linhas: HTMLElement[] = [];
  let atual = novaLinha(linhas);
  const frag = document.createDocumentFragment();
  frag.append(atual.mascara);
  for (const no of Array.from(el.childNodes)) {
    if (no.nodeName === 'BR') {
      // um espaço entre as máscaras mantém a leitura em uma frase para leitores de tela
      frag.append(document.createTextNode(' '));
      atual = novaLinha(linhas);
      frag.append(atual.mascara);
    } else {
      atual.dentro.append(no);
    }
  }
  el.replaceChildren(frag);
  return linhas;
}

function novaLinha(linhas: HTMLElement[]) {
  const mascara = document.createElement('span');
  mascara.className = 'linha-mascara';
  const dentro = document.createElement('span');
  mascara.append(dentro);
  linhas.push(dentro);
  return { mascara, dentro };
}

export function revelar({ reduzido = false }: { reduzido?: boolean }) {
  if (reduzido) return;

  document.querySelectorAll<HTMLElement>('[data-linhas]').forEach((el) => {
    const spans = dividirLinhas(el);
    gsap.set(spans, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el,
      start: INICIO,
      once: true,
      onEnter: () => gsap.to(spans, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.085 }),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-revelar]').forEach((el) => {
    gsap.set(el, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: el,
      start: INICIO,
      once: true,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          delay: Number(el.dataset.delay ?? 0),
        }),
    });
  });
}
