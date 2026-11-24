## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Guia do projeto: site da codimdev

A direção está em `briefing.md` (fatos), `historia.md` (a história e as páginas) e `prompt-site.md` (a especificação completa). Leia antes de construir qualquer página. Fonte da marca: Livro da marca v1.0 e Design System "Codimdev" (24/11/2026).

### O que importa

- **Grafia:** `codimdev`, tudo junto e minúsculo, em qualquer lugar (também em título e começo de frase). Nunca "CodimDev", "Codim Dev" ou "CODIMDEV" (cuidado com `text-transform: uppercase`: use `.mono--livre`).
- **A ideia:** uma prancheta de projeto em que um site é riscado em traço fino e a barrinha carmim o põe no ar. Tudo é desenhado em código (SVG, CSS, GSAP). **Sem WebGL, sem foto de banco de imagem.**
- **Serviços (os cinco):** landing pages de conversão, sites institucionais, redesign/CRO, interfaces/dashboards/MVPs, design system. **Não se fala** de vídeo, motion, identidade visual, redes sociais, tráfego pago, app nativo nem de **automação**. **Sem preço** no site.
- **O logo é o do Livro da marca** (`src/lib/marca/logo.ts`): não redesenhe, não recolora, não estique.

### Design system

Tokens em `src/styles/global.css` (bloco `@theme`). Sempre por variável, nunca valor solto.

| Token                   | Valor                 | Uso                                                           |
| ----------------------- | --------------------- | ------------------------------------------------------------- |
| `--color-algodao`       | `#F5F4EF`             | fundo da página                                               |
| `--color-trama`         | `#E9E7E0`             | cartões e janelas                                             |
| `--color-cru`           | `#DEDCD4`             | hover do botão secundário                                     |
| `--color-linha`         | `#D6D4CC`             | fios de 1 px e a grade                                        |
| `--color-grafite`       | `#18191D`             | texto e a cena escura                                         |
| `--color-grafite-suave` | `#5C5D63`             | legendas                                                      |
| `--color-carmim`        | `#C42A1F`             | botão principal, link, **uma palavra por título**, a barrinha |
| `--font-titulo`         | IBM Plex Sans 600/400 | títulos                                                       |
| `--font-texto`          | Inter 400/500         | texto e botões                                                |
| `--font-mono`           | IBM Plex Mono 400     | rótulos, contadores, ferramentas                              |

- Cantos de **4 px**, nada de pílula, gradiente ou brilho. Nada de branco puro nem preto puro nos fundos.
- Carmim **nunca** como fundo de seção, em vários botões juntos ou para indicar erro (erro tem a cor `--color-erro`, com texto e ícone).
- A barrinha (`.barrinha`): 18 × 12 px, `skewX(-36deg)`, carmim. É o cursor, o marcador, o "visto" e a luz de status.
- Um botão principal (carmim) e um secundário por grupo. Hover só com mouse (`@media (hover: hover)`). Alvos de 44 px.

### Voz

O artesão: direto, calmo, cumpre o que combinou. Primeira pessoa ("eu desenho"); o visitante é "você". Sem exclamação, sem caixa alta, sem emoji. Proibido: inovador, disruptivo, solução completa, alavancar, "transforme seu negócio", "presença digital".
**Sotaque do Piauí, sutil:** só no ritmo e no vocabulário, no máximo um por cena, e nunca em serviço, combinado, formulário, erro ou privacidade. As linhas marcadas `// sotaque` em `pt.ts` são a lista completa.

### Regras de qualidade

- Textos **só** em `src/i18n/pt.ts`; contatos e links em `src/lib/dados.ts`. Nada de texto visível fora deles.
- Fontes **só** pelo `carga.ts` (`FontFace`); `npm run fontes` copia os arquivos. Nada de `@font-face` solto nem preload (só no `<noscript>`).
- O `<html class="is-loading">` e o guarda de 10 s do `Base.astro` não se removem.
- **Fatos reais ou `[preencher]`.** Nunca invente preço, número, cliente ou depoimento. Os projetos são **autorais** e o site diz isso.
- **Fora do site:** o emprego atual, "CLT", "Lino Estúdio" e telefone/e-mail/endereço pessoais do currículo.
- Rodapé: só "feito por um piauiense" na linha final (sem cidade).
- O scroll dirige só a peça principal; o texto entra por tempo. Movimento reduzido: tudo já formado.
- Celular conferido em 390 px; nenhuma letra cortada; `npm run check:fast` passa antes de cada commit.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
