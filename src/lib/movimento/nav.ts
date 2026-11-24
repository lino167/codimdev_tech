// Nav fixa: transparente no topo; depois de 40 px vira barra branca a 92% com fio; some ao descer (passada meia
// tela) e volta ao subir; sobre uma seção escura ([data-tema="escuro"]) troca de cor. No celular, o botão abre a
// folha de links (Esc fecha; a rolagem trava). A entrada é por tempo: começa escondida (nav--espera) e o
// index.ts a mostra no fim da entrada do hero. Sem JS, a nav já está visível e os links funcionam.
import { gsap } from 'gsap';
import type { Suave } from './suave';

const TOPO = 40; // a partir daqui a barra aparece
const FOLGA_SUBIR = 12; // px subindo para a nav voltar
const FOLGA_DESCER = 24; // px descendo para a nav sair

export interface Nav {
  /** tira a nav do estado de espera (entra com opacidade) */
  mostrar(): void;
  /** liga o scroll e o menu do celular */
  ligar(suave: Suave | null): void;
}

export function prepararNav(): Nav {
  const barra = document.querySelector<HTMLElement>('[data-nav]');
  // antes do loader acabar a nav fica escondida: nenhum quadro com ela pronta demais
  barra?.classList.add('nav--espera');

  return {
    mostrar() {
      barra?.classList.remove('nav--espera');
    },
    ligar(suave) {
      if (!barra) return;
      const botao = barra.querySelector<HTMLButtonElement>('[data-menu-botao]');
      const folha = document.querySelector<HTMLElement>('[data-menu-folha]');
      const raiz = document.documentElement;
      let aberto = false;

      const definir = (valor: boolean) => {
        aberto = valor;
        botao?.setAttribute('aria-expanded', String(valor));
        folha?.toggleAttribute('data-aberta', valor);
        raiz.classList.toggle('menu-aberto', valor);
        if (valor) {
          barra.classList.remove('is-hidden');
          suave?.parar();
        } else {
          suave?.seguir();
        }
      };
      botao?.addEventListener('click', () => definir(!aberto));
      folha?.addEventListener('click', (ev) => {
        if ((ev.target as Element).closest('a')) definir(false);
      });
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && aberto) {
          definir(false);
          botao?.focus();
        }
      });
      // virou desktop com o menu aberto: fecha
      matchMedia('(min-width: 901px)').addEventListener('change', (e) => e.matches && aberto && definir(false));

      let ultimo = window.scrollY;
      let acumulado = 0;
      const escuras = Array.from(document.querySelectorAll<HTMLElement>('[data-tema="escuro"]'));
      gsap.ticker.add(() => {
        const y = window.scrollY;
        barra.classList.toggle('is-scrolled', y > TOPO);

        const dy = y - ultimo;
        ultimo = y;
        if (Math.sign(dy) !== Math.sign(acumulado)) acumulado = 0;
        acumulado += dy;
        if (!aberto) {
          if (y <= TOPO || acumulado < -FOLGA_SUBIR) barra.classList.remove('is-hidden');
          else if (acumulado > FOLGA_DESCER && y > window.innerHeight * 0.5) barra.classList.add('is-hidden');
        }

        // a cor da nav acompanha o fundo que está embaixo dela
        const sobreEscura = escuras.some((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= 30 && r.bottom >= 30;
        });
        barra.classList.toggle('nav--escura', sobreEscura);
      });
    },
  };
}
