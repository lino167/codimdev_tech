// Cena 03, a peça principal: um site fictício sendo construído em cinco etapas, em vídeo. O palco fica preso por 5
// telas (4 no celular) e a rolagem escolhe a etapa: a cada uma, o clipe dela entra (os outros saem em fusão) e toca uma vez.
//
// - A ROLAGEM dirige só o que é contínuo: a escala do quadro, a barra de etapa e, nos últimos 8%, o palco escurecendo.
// - O que é POR TEMPO (o clipe tocando, o texto da etapa saindo e entrando palavra por palavra) dispara uma vez quando
//   a etapa muda.
// - Os clipes só começam a baixar perto da seção (preload="none" até lá) e o próximo já vai um passo à frente. Com
//   economia de dados, ficam os quadros de cada etapa.
// Todo texto vem de pt.ts, pelos atributos data-* que o Peca.astro escreve. Movimento reduzido ou sem JS: nada disto
// roda e o CSS mostra o quadro final e a lista de etapas.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Etapa {
  rotulo: string;
  frase: string;
  fato: string;
}
interface Dados {
  etapas: Etapa[];
}

const ABERTURA = 0.06; // fatia do pin antes da primeira etapa
const VIRADA = 0.08; // fatia do pin depois da última: o palco escurece
const ESCURO = '#18191D';
const CLARO = '#F5F4EF';

const limitar = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export function peca({ reduzido }: { reduzido: boolean }) {
  const sec = document.querySelector<HTMLElement>('[data-peca]');
  if (!sec || reduzido) return;
  const palco = sec.querySelector<HTMLElement>('[data-palco]');
  const tela = sec.querySelector<HTMLElement>('[data-tela]');
  const clipes = Array.from(sec.querySelectorAll<HTMLVideoElement>('[data-clipe]'));
  const rotulo = sec.querySelector<HTMLElement>('[data-rotulo]');
  const frase = sec.querySelector<HTMLElement>('[data-frase]');
  const fato = sec.querySelector<HTMLElement>('[data-fato]');
  const trilha = sec.querySelector<HTMLElement>('[data-trilha]');
  if (!palco || !tela || clipes.length !== 5 || !rotulo || !frase || !fato || !trilha) return;
  const dados = JSON.parse(sec.dataset.dados ?? '{}') as Dados;
  if (!dados.etapas?.length) return;
  sec.classList.add('peca--animada');

  // com economia de dados, só os quadros de cada etapa (sem baixar vídeo)
  const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const poucoDado = Boolean(conexao?.saveData);

  const carregar = (i: number) => {
    const v = clipes[i];
    if (!v || poucoDado || v.dataset.carregado) return;
    v.dataset.carregado = '1';
    v.preload = 'auto';
    v.load();
  };
  // perto da seção: o primeiro e o segundo clipe
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 200%',
    once: true,
    onEnter: () => {
      carregar(0);
      carregar(1);
    },
  });

  // o texto da etapa: sai antes da próxima e entra palavra por palavra, saindo do desfoque
  let atual = -1;
  let troca: gsap.core.Tween | null = null;
  const trocarTexto = (i: number, primeira = false) => {
    troca?.kill();
    const entrar = () => {
      const e = dados.etapas[i];
      rotulo.textContent = e.rotulo;
      fato.textContent = e.fato;
      frase.replaceChildren(
        ...e.frase.split(' ').flatMap((palavra, k, todas) => {
          const s = document.createElement('span');
          s.className = 'pal';
          s.textContent = palavra;
          return k < todas.length - 1 ? [s, document.createTextNode(' ')] : [s];
        }),
      );
      gsap.fromTo(
        frase.querySelectorAll('.pal'),
        { opacity: 0, filter: 'blur(6px)', y: 8 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
      );
      gsap.fromTo([rotulo, fato], { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.1, overwrite: 'auto' });
    };
    if (primeira) return entrar();
    troca = gsap.to([frase, rotulo, fato], {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: () => {
        gsap.set([frase, rotulo, fato], { opacity: 1 });
        entrar();
      },
    });
  };

  const ir = (i: number, primeira = false) => {
    if (i === atual) return;
    atual = i;
    clipes.forEach((v, n) => {
      v.classList.toggle('peca__clipe--ativo', n === i);
      if (n === i) {
        carregar(i);
        carregar(i + 1);
        v.currentTime = 0;
        void v.play().catch(() => undefined);
      } else {
        // sai em fusão (o CSS leva 0,5 s) e só então para
        window.setTimeout(() => {
          if (atual !== n) v.pause();
        }, 600);
      }
    });
    trocarTexto(i, primeira);
  };

  // o que é contínuo: o quadro se firma, a barra de etapa anda e, no fim, o palco escurece
  const rolagem = gsap.timeline({ defaults: { ease: 'none' } });
  rolagem
    .fromTo(tela, { scale: 0.92 }, { scale: 1, duration: ABERTURA + 0.1 }, 0)
    .fromTo(trilha, { '--p': 0 }, { '--p': 1, duration: 1 - ABERTURA - VIRADA }, ABERTURA)
    .to(tela, { scale: 0.9, duration: VIRADA, ease: 'power2.inOut' }, 1 - VIRADA)
    .to(
      palco,
      { backgroundColor: ESCURO, color: CLARO, duration: VIRADA * 0.6, ease: 'power1.inOut' },
      1 - VIRADA * 0.6,
    );

  ScrollTrigger.create({
    trigger: palco,
    start: 'top top',
    end: () => `+=${window.innerWidth <= 700 ? 400 : 500}%`,
    pin: true,
    scrub: 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    animation: rolagem,
    onUpdate: (self) => {
      const p = self.progress;
      const f = limitar((p - ABERTURA) / (1 - ABERTURA - VIRADA), 0, 1);
      ir(Math.min(dados.etapas.length - 1, Math.floor(f * dados.etapas.length)));
      // a nav lê este atributo: no fim do pin o palco é escuro
      palco.dataset.tema = p > 1 - VIRADA * 0.5 ? 'escuro' : 'claro';
    },
  });
  ir(0, true);
}
