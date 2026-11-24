// O motor, parte 2: a caixa de seleção do `design`: um retângulo fino com quatro alças e a medida ao vivo em mono
// ("640 × 128"). Cresce do canto de cima à esquerda até o canto de baixo à direita seguindo o cursor.
import { gsap } from 'gsap';

export interface Caixa {
  el: HTMLElement;
  /** desenha a caixa de (x, y) até (x + w, y + h); `seguir` roda a cada quadro com o canto de baixo à direita */
  desenhar(
    x: number,
    y: number,
    w: number,
    h: number,
    dur: number,
    seguir?: (cx: number, cy: number) => void,
  ): gsap.core.Tween;
  remover(dur?: number): gsap.core.Tween;
}

export function criarCaixa(): Caixa {
  const el = document.createElement('div');
  el.className = 'caixa';
  el.innerHTML = '<i></i><i></i><i></i><i></i><span class="caixa__medida"></span>';
  document.querySelector('.motor')?.appendChild(el);
  const medida = el.querySelector<HTMLElement>('.caixa__medida')!;
  gsap.set(el, { opacity: 0 });
  return {
    el,
    desenhar(x, y, w, h, dur, seguir) {
      const o = { w: 0, h: 0 };
      gsap.set(el, { x, y, opacity: 1 });
      return gsap.to(o, {
        w,
        h,
        duration: dur,
        ease: 'power2.inOut',
        onUpdate() {
          el.style.width = `${o.w}px`;
          el.style.height = `${o.h}px`;
          medida.textContent = `${Math.round(o.w)} × ${Math.round(o.h)}`;
          seguir?.(x + o.w, y + o.h);
        },
      });
    },
    remover(dur = 0.4) {
      return gsap.to(el, { opacity: 0, duration: dur, onComplete: () => el.remove() });
    },
  };
}
