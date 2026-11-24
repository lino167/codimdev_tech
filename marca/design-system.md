Algodão claro, grafite no texto, um vermelho carmim que marca o que importa e títulos em IBM Plex Sans: um estúdio de dev e design direto ao ponto.

A codimdev é o estúdio de Zacarias: desenvolvimento web para pequenos negócios e marcas: sites, landing pages, sistemas web e UI/UX (auditoria de UX, protótipo navegável, interface de painéis). Design e código feitos pela mesma pessoa: todo site passa por um protótipo aprovado antes do código. Outros serviços (vídeo, identidade visual) podem entrar depois; até lá, a marca não fala deles. Siga este arquivo em todas as telas, posts e documentos da marca.

## Fundamentos visuais

Superfícies planas, separadas por fios finos e por um tom a mais de fundo, não por sombra. Limpo e técnico, com um ponto de cor forte.

### Fundos

| Fundo | Token | Onde |
|---|---|---|
| Algodão | `algodao` | O fundo da página inteira |
| Trama | `trama` | Cartões e janelas |
| Cru | `cru` | Hover do botão secundário e selos |

- Texto em `grafite`. Texto de apoio em `grafite-suave`, só em legendas e etiquetas.
- Nada de branco puro nem de preto puro nos fundos.
- Fios de 1 px e divisórias em `linha`.
- `sombra-suave` só em janelas do produto. Nada de gradiente nem brilho.
- O tema escuro troca os mesmos tokens: use os nomes, nunca os valores.

### A cor da marca

- `carmim` é o botão principal, os links, a palavra em destaque de um título e os detalhes da logo.
- Use pouco: um botão principal por grupo e uma palavra em destaque por título.
- Texto sobre `carmim` em `no-carmim`.
- `floresta` só para confirmar e indicar sucesso dentro das telas do produto.
- `erro` é mais escuro que `carmim` e sempre vem com ícone ou texto que diga que é erro.

### Tipografia

| Uso | Estilo | Fonte | Peso | Tamanho |
|---|---|---|---|---|
| Título | `titulo` | IBM Plex Sans | 600 | 64 px |
| Título de seção | `titulo-secao` | IBM Plex Sans | 600 | 36 px |
| Subtítulo | `subtitulo` | IBM Plex Sans | 400 | 22 px |
| Corpo | `corpo` | Inter | 400 | 16 px |
| Botão | `botao` | Inter | 500 | 15 px |
| Código e etiquetas | `codigo` | IBM Plex Mono | 400 | 12 px |

- IBM Plex Sans nos títulos, com letras mais juntas quanto maior o tamanho. Foi desenhada para engenharia e passa seriedade técnica.
- Inter em todo o texto corrido e nos botões.
- IBM Plex Mono nos comandos, nos nomes de arquivo, nas etiquetas e nos rótulos de campo.
- Todas no Google Fonts.

### Cantos, espaço e movimento

- Cantos de 4 px (`radius`) em botões, cartões e campos. Nada de pílula.
- Espaço em múltiplos de 4 px (`space-1` a `space-8`).
- Trocas de cor curtas, de 150 ms.
- O sublinhado aparece no link só ao passar o mouse.

## Componentes

- **Button**: principal em `carmim` com texto `no-carmim`; secundário sem fundo, texto `grafite`, contorno de 1 px em `grafite`.
- **Field**: fundo da própria página, fio `linha`, rótulo em `codigo`.
- **Card**: fundo `trama`, título em IBM Plex Sans, detalhes em `codigo`.

### Site

A página tem largura máxima de 1200 px (`container`) com 24 px de margem lateral, e todas as grades quebram sozinhas no celular. Ordem padrão de uma página: Header, Hero, serviços (ServiceCard), projetos (ProjectCard), depoimentos (Testimonial, só com cliente real), CtaWhatsapp e Footer.

- **Header**: logo, até 4 links e o botão de orçamento.
- **Hero**: título com uma palavra em `carmim`, texto curto, dois botões e um visual.
- **ServiceCard**: ícone de serviço, título, uma frase e preço inicial.
- **ProjectCard**: imagem em preto e branco que ganha cor no hover, etiqueta `Autoral` ou `Cliente`.
- **Testimonial**: citação com aspas em `carmim`. Nunca com texto inventado.
- **CtaWhatsapp**: faixa `grafite` com o botão `carmim`, uma vez por página.
- **Footer**: logo, links e linha legal.
- Rótulos pequenos usam `eyebrow`; a barrinha inclinada da marca é `slash`.

## Conteúdo

Português, direto, sem exclamação e sem emoji. Frases curtas; os títulos afirmam, não gritam. Fale de resultado e de problema resolvido, não de tecnologia pela tecnologia.

## Ícones e imagens

A logo está em `assets/Logos`, em versões horizontal, empilhada e só símbolo, cada uma para fundo claro e escuro. Os dois detalhes da logo (o traço do símbolo e o pingo do "i") vão em `carmim`.

Os ícones estão em `assets/Icones`: traço de 1,75 px em `grafite`, grade de 24 px, cantos arredondados. Os ícones de serviço levam um detalhe inclinado em `carmim`, no ângulo do traço da logo; os de interface não levam. Regras completas no README do grupo.

## Faça

- Um botão `carmim` e um secundário no mesmo grupo.
- Fundo `algodao` e cartões em `trama`, separados por fios finos.
- Uma palavra em destaque em `carmim` por título, no máximo.

## Evite

- Branco puro, preto puro, pílulas, gradientes, brilhos e sombras azuladas.
- `carmim` como fundo de seção inteira ou em vários botões juntos.
- Usar `carmim` para indicar erro.
