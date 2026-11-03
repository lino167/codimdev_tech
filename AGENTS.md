## Development

Site-portfólio da CodimDev em **Vite sem framework** (HTML, CSS e JS puros), com Three.js (túnel de trabalhos), GSAP + ScrollTrigger e Lenis. Estrutura vinda da template Margem (`../margem-arquivos/`, só referência).

```
npm run dev      # servidor de desenvolvimento
npm run build    # gera dist/
```

- Seções em `src/sections/` (HTML + CSS de cada uma), motion em `src/motion/`, dados em `src/data/`, tokens em `src/styles/tokens.css`.
- Imagens provisórias reais: `python scripts/preparar-reais.py <pasta-raster>` grava `public/trabalhos/real/` e `src/data/pecas.json`.
- Prompts das fotos e do motion definitivos: `../03_imagens/portfolio/` (a IA faz só a cena; o trabalho aplicado é sempre real).
- O que ainda não foi informado aparece como `[preencher]` (classe `.pendente`) e não pode ir ao ar.
- Nenhum commit sem a análise do Zacarias.
