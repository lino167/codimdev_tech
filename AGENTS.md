## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Guia do projeto: site da CodimDev (identidade antiga, a ser substituído)

> **Atenção:** os tokens, as fontes e o gesto descritos nesta seção são da identidade antiga e **não valem**. A marca é `codimdev` (tudo minúsculo), com algodão `#F5F4EF`, grafite `#18191D`, carmim `#C42A1F`, IBM Plex Sans, Inter e IBM Plex Mono. Siga `briefing.md` e `historia.md`; esta seção será reescrita depois da aprovação da história.

O roteiro completo está em `PROMPT-SITE.md`. Leia antes de construir qualquer seção nova.

### O que importa

- **Uma peça principal:** o mundo. Um único `<canvas>` WebGL fixo atrás da página (`src/lib/mundo/`), onde o símbolo e o título são pontilhado de tinta e os elos são vermelhos e sólidos. Ele vem primeiro e precisa estar perfeito antes das seções.
- **O gesto é ligar.** Pontos soltos viram uma coisa só quando um elo vermelho trava. Um fio vermelho desce a página e cada cena acende quando o fio chega.
- **Tudo é desenhado em código:** pontos de tinta, elos vermelhos e interfaces em HTML vivo. Sem foto de banco de imagem.
- **Nada surge pronto.** Todo objeto novo se condensa de pontos e só firma quando um elo fecha.
- O hero (T1 a T4) e o loader já existem. Não reescreva: acrescente em volta.

### Design system

Tokens em `src/styles/global.css`, sempre por variável. Nunca escreva cor ou tamanho solto.

| Token              | Valor                  | Uso                                            |
| ------------------ | ---------------------- | ---------------------------------------------- |
| `--color-branco`   | `#ffffff`              | fundo                                          |
| `--color-tinta`    | `#0a0a0b`              | texto e pontos                                 |
| `--color-vermelho` | `#e8132e`              | **só o elo**: botão principal, foco ativo, fio |
| `--color-cinza`    | `#6b6b70`              | apoio e notas                                  |
| `--font-titulo`    | Archivo Condensada 800 | títulos                                        |
| `--font-texto`     | Inter                  | texto corrido                                  |
| `--font-mono`      | JetBrains Mono         | números, rótulos, contadores                   |

- **Vermelho nunca é decoração.** Se uma tela tem vermelho demais, está errada. Texto pequeno em vermelho não é permitido; só texto grande e botões passam no contraste.
- Uma palavra em vermelho por título, no máximo (como "conectado." no hero).
- Fundo branco. A **única** inversão para tinta é a cena das 22 h do "dia do Marcos".
- Nav com rótulos em mono entre colchetes (`[ Serviços ]`); o botão troca de cor conforme o fundo.

### Motion

- GSAP 3.15 + ScrollTrigger e Lenis (`lerp 0.09`) como **única** suavização.
- **O scroll dirige só o mundo** (cabeça do fio, a cena presa do Ato 2, o relógio). **O texto entra por tempo**, uma vez. Nada de scrub em texto.
- Nenhuma `transition` CSS em propriedade que o GSAP anima.
- Pulso dos elos a cada 3,8 s, só enquanto a seção está na tela.
- `prefers-reduced-motion`: tudo já formado, sem Lenis e sem animação CSS. Sem WebGL: título e símbolo em HTML/SVG. Sem JS: tudo legível e o formulário funciona.

### Regras de qualidade

- Textos **só** em `src/i18n/pt.ts` (e `en.ts`, ainda a criar). Nenhum texto visível fora deles.
- Fontes **só** pelo `carga.ts`: nada de `@font-face` nem preload fora do `<noscript>`.
- O `<html class="is-loading">` e o guarda de 10 s do `Base.astro` não se removem.
- **Fatos reais ou `[preencher]`.** Nunca invente preço, número, cliente, depoimento, telefone ou endereço. `[preencher]` nunca vai em título.
- Celular conferido em 390 px; nenhuma letra cortada em repouso (acentos e descendentes).
- Todo texto novo que o fio não pode atravessar entra na lista de seletores a evitar do mundo.
- `npm run check:fast` passa antes de cada commit. Nenhum teste desligado para ficar verde.

### Como checar

1. Recarregue: loader "Conectando" e entrada do hero sem quadro em branco entre os dois.
2. Role devagar até o fim: o fio desce sem pular e nenhum ponto cai por cima de texto.
3. Repita em 390, 768, 1280 e 1456 px, com movimento reduzido, sem WebGL e com a rede limitada.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
