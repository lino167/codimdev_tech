// Cena 01: a barrinha-cursor ESCREVE o título, letra a letra (34 ms por letra), e fica piscando no fim, como em um
// editor. Depois o apoio e os botões sobem, e a janela esboçada, ao lado, entra em traços. Movimento reduzido ou
// sem JS: o título é o texto comum, tudo já formado. O texto completo continua acessível para leitores de tela.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SEG_POR_LETRA = 0.034;

export interface Abertura {
  /** começa a escrever (chamado quando a tela do carregador se abre) */
  entrar(): void;
}

export function prepararAbertura(reduzido: boolean): Abertura | null {
  const titulo = document.querySelector<HTMLElement>('[data-digita]');
  if (!titulo || reduzido) return null;
  const resto = Array.from(
    document.querySelectorAll<HTMLElement>('.abertura__apoio, .abertura__botoes, .abertura__nota'),
  );
  const esboco = document.querySelector<SVGElement>('[data-esboco]');
  const pecas = esboco ? Array.from(esboco.querySelectorAll<SVGElement>('.e')) : [];

  // o texto completo vai para leitores de tela; o visual (letra por letra) fica escondido deles
  const completo = (titulo.textContent ?? '').replace(/\s+/g, ' ').trim();
  const letras: HTMLElement[] = [];
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  const dividir = (no: Node, destino: Node) => {
    if (no.nodeType === Node.TEXT_NODE) {
      for (const ch of no.textContent ?? '') {
        if (/\s/.test(ch)) {
          destino.appendChild(document.createTextNode(' '));
          continue;
        }
        const l = document.createElement('span');
        l.className = 'letra';
        l.textContent = ch;
        destino.appendChild(l);
        letras.push(l);
      }
    } else if (no instanceof HTMLElement) {
      const copia = no.cloneNode(false) as HTMLElement; // mantém o data-destaque (a palavra em carmim)
      destino.appendChild(copia);
      no.childNodes.forEach((filho) => dividir(filho, copia));
    }
  };
  titulo.childNodes.forEach((no) => dividir(no, visual));
  const leitor = document.createElement('span');
  leitor.className = 'so-leitor';
  leitor.textContent = completo;
  const cursor = document.createElement('i');
  cursor.className = 'barrinha abertura__cursor';
  cursor.setAttribute('aria-hidden', 'true');
  titulo.replaceChildren(leitor, visual, cursor);
  titulo.classList.add('digitando');

  gsap.set(resto, { opacity: 0, y: 20 });
  gsap.set(pecas, { opacity: 0 });

  const mover = (l: HTMLElement | undefined) => {
    if (!l) return;
    cursor.style.left = `${l.offsetLeft + l.offsetWidth + 6}px`;
    cursor.style.top = `${l.offsetTop + l.offsetHeight * 0.56 - 6}px`;
  };
  // se a tela mudar de tamanho, a barrinha continua no fim do que já foi escrito
  let escritas = 0;
  window.addEventListener('resize', () => mover(letras[Math.max(0, escritas - 1)]));
  mover(letras[0]);

  return {
    entrar() {
      const tl = gsap.timeline();
      tl.set(cursor, { opacity: 1 }, 0);
      letras.forEach((l, i) =>
        tl.call(
          () => {
            l.style.opacity = '1';
            escritas = i + 1;
            mover(l);
          },
          undefined,
          0.25 + i * SEG_POR_LETRA,
        ),
      );
      const fim = 0.25 + letras.length * SEG_POR_LETRA;
      tl.to(resto, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' }, fim - 0.25);
      // a janela esboçada se risca, peça por peça, enquanto o título é escrito
      tl.to(pecas, { opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, 0.4);
      // ao sair da abertura, a janela esboçada sobe e se apaga (a peça principal assume a cena)
      if (esboco) {
        gsap.to(esboco, {
          yPercent: -14,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.abertura', start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    },
  };
}
