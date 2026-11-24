// Cena 03, a peça principal. O palco fica preso por 5 telas (4 no celular) e a rolagem leva uma janela de navegador,
// desenhada em SVG, por cinco etapas: conversa, protótipo, código, testes e no ar.
//
// - A ROLAGEM dirige só o que é contínuo: a leve perspectiva da janela (que se acalma até 0), a barra de etapa e,
//   nos últimos 4%, o palco escurecendo e a janela recuando.
// - O que é POR TEMPO (a escrita, o cursor clicando, as marcas de teste, o pulso da luz) dispara uma vez quando a
//   etapa muda e roda sozinho; o texto da etapa sai e entra palavra por palavra, saindo do desfoque.
// - Os primeiros 6% do pin são a abertura (a janela se firma) e os últimos 4%, o respiro final.
// Todo texto vem de pt.ts, pelos atributos data-* que o Peca.astro escreve. Movimento reduzido ou sem JS: nada disto
// roda e o CSS mostra a janela pronta e a lista de etapas.
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
  codigo: string[];
  proposta: { titulo: string; linhas: string[] };
  endereco: string;
  checklist: string[];
}

const ABERTURA = 0.06; // fatia do pin antes da primeira etapa
const RESPIRO = 0.04; // fatia do pin depois da última
const CPS_CODIGO = 40; // caracteres por segundo ao escrever o código
const CPS_ENDERECO = 30;
const ESCURO = '#18191D';
const CLARO = '#F5F4EF';
const TRAMA = '#E9E7E0';

const limitar = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export function peca({ reduzido }: { reduzido: boolean }) {
  const sec = document.querySelector<HTMLElement>('[data-peca]');
  if (!sec || reduzido) return;
  const palco = sec.querySelector<HTMLElement>('[data-palco]');
  const janela = sec.querySelector<HTMLElement>('[data-janela]');
  const svg = sec.querySelector<SVGSVGElement>('.peca__svg');
  const rotulo = sec.querySelector<HTMLElement>('[data-rotulo]');
  const frase = sec.querySelector<HTMLElement>('[data-frase]');
  const fato = sec.querySelector<HTMLElement>('[data-fato]');
  const trilha = sec.querySelector<HTMLElement>('[data-trilha]');
  if (!palco || !janela || !svg || !rotulo || !frase || !fato || !trilha) return;
  const dados = JSON.parse(sec.dataset.dados ?? '{}') as Dados;
  if (!dados.etapas?.length) return;
  sec.classList.add('peca--animada');

  const G = (nome: string) => svg.querySelector<SVGGElement>(`[data-g="${nome}"]`) as SVGGElement;
  const todos = <T extends Element>(sel: string) => Array.from(svg.querySelectorAll<T>(sel));
  const site = G('site');
  const celular = G('celular');
  const linhasCodigo = todos<SVGTextElement>('[data-linha]');
  const propostaTitulo = svg.querySelector<SVGTextElement>('[data-proposta-titulo]') as SVGTextElement;
  const propostaLinhas = todos<SVGTextElement>('[data-proposta-linha]');
  const endereco = svg.querySelector<SVGTextElement>('[data-endereco]') as SVGTextElement;
  const abas = todos<SVGGElement>('[data-aba]');
  const checks = todos<SVGGElement>('[data-check]');
  const pulso = svg.querySelector<SVGGElement>('[data-pulso]') as SVGGElement;
  const cursor = G('cursor');

  // pivôs das escalas (em unidades do viewBox)
  gsap.set(site, { svgOrigin: '600 360' });
  gsap.set(celular, { svgOrigin: '410 370' });
  gsap.set(pulso, { svgOrigin: '916 47' });
  gsap.set(cursor, { x: 860, y: 220 });

  const digitar = (el: Element, texto: string, cps: number, tl: gsap.core.Timeline, em: number) => {
    const o = { n: 0 };
    tl.to(
      o,
      {
        n: texto.length,
        duration: texto.length / cps,
        ease: 'none',
        onUpdate: () => {
          el.textContent = texto.slice(0, Math.round(o.n));
        },
      },
      em,
    );
    return texto.length / cps;
  };
  const riscos = (raiz: Element | null) => (raiz ? Array.from(raiz.querySelectorAll<SVGElement>('.risco')) : []);
  const desenhar = (tl: gsap.core.Timeline, alvos: SVGElement[], em: number, duracao = 0.5, passo = 0.08) =>
    tl.fromTo(
      alvos,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: duracao, stagger: passo, ease: 'power2.inOut' },
      em,
    );

  // o estado de cada etapa: o que fica visível e onde
  const aplicar = (i: number, instante = false) => {
    const duracao = instante ? 0 : 0.6;
    const para = (g: SVGGElement, vars: gsap.TweenVars) =>
      gsap.to(g, { ...vars, duration: duracao, ease: 'power2.out', overwrite: 'auto' });
    svg.dataset.fase = i >= 2 ? 'solido' : 'esboco';
    const oculto = { opacity: 0 };
    switch (i) {
      case 0: // conversa: a janela, apagada, atrás da proposta
        para(site, { opacity: 0.35, scale: 0.97 });
        para(G('telaA'), oculto);
        para(G('telaB'), oculto);
        para(G('telaC'), oculto);
        para(G('tabs'), oculto);
        para(G('codigo'), { opacity: 0, x: 40 });
        para(G('status'), oculto);
        para(cursor, oculto);
        para(G('e1'), { opacity: 1 });
        para(celular, { opacity: 0, scale: 0.9, x: 0, y: 0 });
        para(G('check'), oculto);
        break;
      case 1: // protótipo: a página em blocos tracejados e o cursor clicando nas abas
        para(site, { opacity: 1, scale: 1 });
        para(G('telaA'), { opacity: 1 });
        para(G('tabs'), { opacity: 1 });
        para(G('codigo'), { opacity: 0, x: 40 });
        para(G('status'), oculto);
        para(cursor, { opacity: 1 });
        para(G('e1'), oculto);
        para(celular, { opacity: 0, scale: 0.9, x: 0, y: 0 });
        para(G('check'), oculto);
        break;
      case 2: // código: a página ganha corpo e o código se escreve ao lado
        para(site, { opacity: 1, scale: 1 });
        para(G('telaA'), { opacity: 1 });
        para(G('telaB'), oculto);
        para(G('telaC'), oculto);
        para(G('tabs'), { opacity: 0.35 });
        para(G('codigo'), { opacity: 1, x: 0 });
        para(G('status'), oculto);
        para(cursor, oculto);
        para(G('e1'), oculto);
        para(celular, { opacity: 0, scale: 0.9, x: 0, y: 0 });
        para(G('check'), oculto);
        break;
      case 3: // testes: a janela vira celular e os testes passam
        para(site, { opacity: 0.12, scale: 0.92 });
        para(G('telaA'), { opacity: 1 });
        para(G('telaB'), oculto);
        para(G('telaC'), oculto);
        para(G('codigo'), { opacity: 0, x: 40 });
        para(G('status'), oculto);
        para(cursor, oculto);
        para(G('e1'), oculto);
        para(celular, { opacity: 1, scale: 1, x: 0, y: 0 });
        para(G('check'), { opacity: 1 });
        break;
      default: // no ar: a janela volta, o celular recua e a luz de status acende
        para(site, { opacity: 1, scale: 1 });
        para(G('telaA'), { opacity: 1 });
        para(G('telaB'), oculto);
        para(G('telaC'), oculto);
        para(G('tabs'), { opacity: 0.35 });
        para(G('codigo'), { opacity: 0, x: 40 });
        para(G('status'), { opacity: 1 });
        para(cursor, oculto);
        para(G('e1'), oculto);
        para(celular, { opacity: 0, scale: 0.5, x: -110, y: 210 }); // o celular sai de cena: o site final fica limpo
        para(G('check'), oculto);
    }
  };

  // o que roda por tempo em cada etapa (uma vez, quando ela começa)
  let seq: gsap.core.Timeline | null = null;
  const sequencia = (i: number) => {
    seq?.kill();
    const tl = gsap.timeline();
    seq = tl;
    switch (i) {
      case 0: {
        propostaTitulo.textContent = '';
        propostaLinhas.forEach((t) => (t.textContent = ''));
        gsap.set(riscos(G('e1')), { strokeDashoffset: 1 });
        desenhar(tl, riscos(G('e1')).slice(0, 7), 0.15, 0.45, 0.07);
        digitar(propostaTitulo, dados.proposta.titulo, 24, tl, 0.2);
        dados.proposta.linhas.forEach((texto, k) => {
          const base = 0.8 + k * 0.7;
          digitar(propostaLinhas[k], texto, 20, tl, base);
          const dois = riscos(G('e1')).slice(7 + k * 2, 9 + k * 2);
          desenhar(tl, dois, base + 0.15, 0.4, 0.1);
        });
        break;
      }
      case 1: {
        const centro = (k: number) => ({ x: 1019 + k * 44, y: 40 });
        const ativar = (k: number) => {
          abas.forEach((a, n) => {
            gsap.to(a.querySelector('.aba'), { fill: n === k ? TRAMA : 'rgba(0,0,0,0)', duration: 0.15 });
          });
        };
        const tela = (qual: 'telaA' | 'telaB' | 'telaC') => {
          (['telaA', 'telaB', 'telaC'] as const).forEach((n) =>
            gsap.to(G(n), { opacity: n === qual ? 1 : 0, duration: 0.15, ease: 'none', overwrite: 'auto' }),
          );
        };
        const clique = () => tl.to(cursor, { scale: 0.8, duration: 0.07, yoyo: true, repeat: 1, ease: 'none' });
        gsap.set(cursor, { x: 860, y: 230, opacity: 0 });
        gsap.set(G('telaB'), { opacity: 0 });
        gsap.set(G('telaC'), { opacity: 0 });
        tl.to(cursor, { opacity: 1, duration: 0.2 }, 0.1).to(
          cursor,
          { ...centro(0), duration: 0.7, ease: 'power3.inOut' },
          0.2,
        );
        clique().call(() => ativar(0));
        tl.to(cursor, { ...centro(1), duration: 0.5, ease: 'power3.inOut' }, '+=0.35');
        clique().call(() => {
          ativar(1);
          tela('telaB');
        });
        tl.to(cursor, { ...centro(2), duration: 0.5, ease: 'power3.inOut' }, '+=0.45');
        clique().call(() => {
          ativar(2);
          tela('telaC');
        });
        tl.to(cursor, { ...centro(0), duration: 0.6, ease: 'power3.inOut' }, '+=0.5');
        clique().call(() => {
          ativar(0);
          tela('telaA');
        });
        break;
      }
      case 2: {
        linhasCodigo.forEach((t) => (t.textContent = ''));
        let t = 0.35;
        dados.codigo.forEach((linha, k) => {
          t += digitar(linhasCodigo[k], linha, CPS_CODIGO, tl, t) + 0.05;
        });
        break;
      }
      case 3: {
        const caminhos = checks.map((c) => c.querySelector<SVGElement>('path.risco') as SVGElement);
        gsap.set(caminhos, { strokeDashoffset: 1 });
        gsap.set(riscos(celular), { strokeDashoffset: 1 });
        desenhar(tl, riscos(celular), 0, 0.9, 0);
        caminhos.forEach((c, k) =>
          tl.fromTo(
            c,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' },
            0.8 + k * 0.25,
          ),
        );
        break;
      }
      default: {
        endereco.textContent = '';
        digitar(endereco, dados.endereco, CPS_ENDERECO, tl, 0.3);
        tl.fromTo(pulso, { scale: 1 }, { scale: 1.7, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.9);
      }
    }
  };

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
    aplicar(i, primeira);
    sequencia(i);
    trocarTexto(i, primeira);
  };

  // as marcas do que é contínuo: a perspectiva se acalma, a barra de etapa anda e, no fim, o palco escurece
  const rolagem = gsap.timeline({ defaults: { ease: 'none' } });
  rolagem
    .fromTo(janela, { rotateX: 8, rotateY: -10 }, { rotateX: 0, rotateY: 0, duration: 0.9 }, 0)
    .fromTo(trilha, { '--p': 0 }, { '--p': 1, duration: 1 - ABERTURA - RESPIRO }, ABERTURA)
    .to(palco, { backgroundColor: ESCURO, color: CLARO, duration: RESPIRO, ease: 'power1.inOut' }, 1 - RESPIRO)
    .to(janela, { scale: 0.62, y: -40, duration: RESPIRO, ease: 'power1.inOut' }, 1 - RESPIRO);

  aplicar(0, true);
  gsap.set(
    abas.map((a) => a.querySelector('.aba')),
    { fill: 'rgba(0,0,0,0)' },
  );
  gsap.set(riscos(G('e1')), { strokeDashoffset: 1 });
  [...linhasCodigo, ...propostaLinhas, propostaTitulo, endereco].forEach((t) => (t.textContent = ''));

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
      const q = limitar((p - ABERTURA) / (1 - ABERTURA - RESPIRO), 0, 1);
      ir(Math.min(dados.etapas.length - 1, Math.floor(q * dados.etapas.length)));
      // a nav lê este atributo: no fim do pin o palco é escuro
      palco.dataset.tema = p > 1 - RESPIRO * 0.5 ? 'escuro' : 'claro';
    },
  });
  ir(0, true);
}
