# CodimDev: o site que conecta tudo, num mundo de pontos que fecha cada ligação em vermelho

## Antes de começar: pergunte

Antes de escrever qualquer código, leia `AGENTS.md`, `src/` e `git log`. O hero já existe (T1 a T4). Depois faça só as perguntas que o repositório não responde, uma por vez e em linguagem simples:

1. **O que você quer fazer agora?**
   - **Construir o site inteiro** a partir do hero (o padrão deste prompt).
   - **Construir só um ato** (por exemplo, "O dia do Marcos").
   - **Rever o roteiro** antes de programar.
2. **Que material real existe?** Projetos entregues (nome do cliente com autorização, o problema, o que mudou, um número verdadeiro), uma foto do Zacarias, o WhatsApp e o e-mail de contato, o preço de partida de cada serviço. Avise desde já: **este site não depende de nenhuma foto nem vídeo de banco de imagem**. Tudo o que aparece é desenhado em código (pontos, interfaces em HTML vivo). O que a pessoa não der vira `[preencher]` e entra na lista do fim.
3. **Existe o Livro da Marca novo?** O código usa branco, tinta, vermelho `#E8132E` e Archivo Condensada. O `CODIM_DEV_BrandBook_v1.pdf` do Drive descreve outra marca (fundo escuro, Space Grotesk, `#FF3E3E`). **Siga o código**, a menos que a pessoa diga o contrário.

Depois, em qualquer caminho, **rode o projeto e confira que o hero atual funciona** antes de acrescentar qualquer ato. Termine com uma lista curta do que ainda é provisório e do que falta a pessoa mandar.

## A ideia em uma frase

A CodimDev é quem **liga** o que a pequena empresa tem solto: o Google, a planilha e o WhatsApp. O site prova isso fazendo, na frente de quem rola: **pontos soltos viram uma coisa só quando um elo vermelho trava**. Quem entra deve pensar "quero um site assim", e a forma de querer é ver o site funcionando como o produto.

O objetivo duplo: (1) o dono de empresa clica em "Mapear minha empresa"; (2) o dono de empresa e o dev que visitam saem lembrando do site. Memorável é o critério de qualidade, não enfeite.

---

## Parte 1: O site

### Marca e tom (já decididos no código)
- **Quem fala:** Zacarias, em primeira pessoa, "direto com quem faz". Blumenau, SC; atendimento remoto. Sem "revolucione", sem "soluções", sem "sem spam".
- **Para quem:** o dono de pequena e média empresa (o "Marcos") que perde cliente por depender dele para tudo.
- **O que vende:** site, sistema e automação, em três serviços. A entrada é o **Diagnóstico grátis** (2 minutos, resposta em até 24 h úteis).
- **Visual:** fundo branco `#fff`, tinta `#0A0A0B`, vermelho `#E8132E`, cinza `#6B6B70`. Archivo Condensada 800 nos títulos, Inter no texto, JetBrains Mono em números, rótulos e contadores.
- **Regra do vermelho:** o vermelho é o **elo**, a luz de status. Aparece só onde duas coisas se ligam: os elos do símbolo, o botão principal, o foco ativo, o fio que desce a página. Nunca como fundo decorativo. Se uma tela tem vermelho demais, está errada.
- **Fatos:** preço, número, depoimento, telefone, endereço e nome de cliente **nunca se inventam**. Ficam `[preencher]` e nunca no título.

### O gesto e a peça principal
O gesto de negócio é **ligar**. A peça principal é o **mundo** que já existe (`src/lib/mundo/`): um único `<canvas>` WebGL fixo atrás da página, onde o símbolo e o título são desenhados em pontilhado de tinta e os elos são vermelhos e sólidos. Daqui em diante o mundo **não é só o hero: ele é a página inteira**.

Três regras que amarram tudo:
1. **O fio.** Do elo do hero sai um fio vermelho fino que desce pela página, passando por cada cena, e é o único elemento preso à rolagem. Cada cena "acende" quando o fio chega.
2. **Nada surge pronto.** Todo objeto novo se condensa de pontos soltos, e só fica sólido depois que um elo fecha (a mesma assinatura do símbolo).
3. **O scroll dirige o mundo; o texto entra por tempo.** Texto nunca preso ao scroll.

### Atos e seções
Largura máxima 1200 px, margem `var(--gutter)`. Títulos de seção em Archivo Condensada 800 (`--t-h2`), com um eyebrow em JetBrains Mono.

**Ato 1: Hero** (pronto: "Tudo ⊂⊃ conectado."). Ajustes pendentes: a nav; os botões já apontam para `#diagnostico` e `#projetos`, e esses destinos precisam existir.

**Nav** (fixa): símbolo e "CodimDev" à esquerda; Serviços, Projetos, Como funciona e o botão "Mapear minha empresa" à direita. Transparente no topo; depois de 40 px vira barra branca a 92% com fio embaixo; some ao descer e volta ao subir. No celular, folha branca de links grandes.

**Ato 2: O dia do Marcos** (`#servicos`). A peça mais memorável do site, em uma **cena presa de cerca de 4 telas**. Um relógio em JetBrains Mono (07:00 → 22:00) gira com a rolagem, e o dia do dono vira três cenas, uma por serviço. Em cada uma, **duas coisas soltas em pontos se ligam por um elo vermelho**, e depois a cena fica sólida, em HTML vivo (não imagem):
- **08:10 · O site.** Uma barra de busca digita "barbearia perto de mim". O resultado do Marcos nasce em pontos no topo e se firma como um cartão (nome, nota e botão "Chamar no WhatsApp", tudo `[preencher]`). O elo liga a busca ao cartão.
- **13:40 · O sistema.** Pedidos caem como pontos numa planilha e cada linha se fecha sozinha: cliente, item, valor, status. O elo liga o pedido à linha.
- **22:15 · A automação.** A página escurece (de branco para tinta, a única inversão do site). Um WhatsApp recebe uma mensagem, responde e **agenda** em um calendário ao lado. O elo liga a mensagem ao horário. Embaixo, em mono: "Respondeu em 4 s" (número provisório, `[preencher]` até haver medição real).

Ao final, o relógio volta e a página volta ao branco. Cada cena traz um título de uma linha, a frase de uma linha e o preço de partida (`[preencher]`).

**Ato 3: Projetos** (`#projetos`). Uma fila horizontal de cartões brancos (rola de lado com setas, arrasto e toque). Cada cartão: o **problema do dono** em uma frase, **o que mudou**, **um número verdadeiro** em mono e o tipo (site, sistema, automação). No hover, o vermelho entra pelo ponto onde o cursor entrou e sai por onde saiu. Sem projetos reais, mostre os cartões como `[preencher]`, nunca clientes inventados.

**Ato 4: Como funciona** (`#processo`). Três passos em escada, cada um com um pedaço de interface que se mexe sozinho: 01 Diagnóstico grátis (2 min), 02 Proposta com preço e prazo, 03 Entrega e acompanhamento. Uma linha em mono dá o prazo de cada um (`[preencher]` até haver prazo real). O Zacarias aparece aqui, com o rosto, se houver foto.

**Ato 5: O diagnóstico** (`#diagnostico`). **É a conversão e o último truque do site.** Um mapa interativo de três perguntas (que negócio é, onde você perde cliente hoje, o que você faz na mão todo dia). A cada resposta, pontos do mundo se organizam e **um elo novo se liga** no desenho. No fim, "Seu mapa" mostra a lista dos serviços que ligam o que a pessoa disse, e o envio vai para o WhatsApp do Zacarias, com e-mail como alternativa. Se o JS falhar, vira um formulário comum de três campos que funciona sem script.

**Rodapé.** Quatro colunas de links, a linha de contato e o **wordmark monumental** "CODIMDEV" na largura da tela, cortado rente ao fim da página. Quando entra na tela, os pontos **chovem do alto** e pousam formando o nome; as letras ficam sólidas e a base continua em pontilhado.

**404.** Uma página própria: "Sem conexão". Os dois C do símbolo flutuam separados; ao clicar ou apertar uma tecla, os elos se fecham e o botão "Voltar ao início" aparece.

### Celular (390 × 844)
O hero já está resolvido (título em grade, símbolo no meio, botões na largura toda). Em "O dia do Marcos" a cena fica em uma coluna, com o relógio fixo no topo, e **cada cena vira um cartão que sobe**, sem pin longo. Projetos viram uma fila de cartões com arrasto. O diagnóstico é uma pergunta por tela. Nada cortado, nada saindo da tela.

### Movimento reduzido e sem WebGL
`prefers-reduced-motion`: tudo já formado, sem Lenis, sem animação CSS; as três cenas aparecem empilhadas e prontas. Sem WebGL: o título e o símbolo em HTML/SVG (já existe) e as cenas em HTML puro. Sem JS: tudo legível e o formulário de diagnóstico funciona.

---

## Parte 2: Como construir

### Stack (já instalada, não mude)
Astro 7.4, Tailwind 4.3, React 19 (**só em ilhas**, para o diagnóstico e a fila de projetos), GSAP 3.15.0, Lenis 1.3.26. Textos **só** em `src/i18n/pt.ts` (e `en.ts`, ainda a criar). Nada de `@font-face` nem preload: quem carrega as fontes é o `carga.ts`.

### O que já existe e não se reescreve
- `src/lib/mundo/` (`gl.ts`, `mundo.ts`, `shaders.ts`, `simbolo.ts`, `titulo.ts`): o mundo, o símbolo e o título em pontos.
- `src/lib/movimento/` (`carga.ts`, `loader.ts`, `entrada.ts`, `index.ts`): o loader "Conectando" com bytes reais e a entrada do hero.
- `src/styles/` (`global.css`, `hero.css`, `loader.css`), `Base.astro` (com o guarda `is-loading` de 10 s) e `Hero.astro`.

### O que escrever (um arquivo por responsabilidade)
- `src/components/secoes/`: `Nav`, `Dia` (o dia do Marcos), `Projetos`, `Processo`, `Diagnostico`, `Rodape`, e `src/pages/404.astro`. Cada um com o seu CSS em `src/styles/`.
- `src/lib/mundo/fio.ts`: o fio vermelho (curva Catmull-Rom pelo centro de cada `[data-way]`) e a cabeça do fio presa ao scroll por uma curva monotônica entre os `[data-anchor]`, como na referência Sinal. Os pontos do fio **rareiam perto de texto**: toda classe de texto nova entra na lista de evitar.
- `src/lib/mundo/rodape.ts`: o wordmark que chove, no padrão do `titulo.ts`.
- `src/lib/movimento/`: `suave.ts` (Lenis no ticker do GSAP, `lerp 0.09`), `revelar.ts` (linhas que sobem de máscara por tempo), `nav.ts`, `dia.ts` (a cena presa e o relógio), `diagnostico.ts` e `projetos.ts`.
- **As três cenas do Ato 2 são HTML vivo**, animado por CSS e GSAP dentro da cena presa: nada de imagem nem vídeo. O mundo só desenha os pontos soltos e o elo; quando o elo fecha, a cena HTML aparece sólida por cima.

### Ordem de inicialização (`movimento/index.ts`)
1. `history.scrollRestoration = 'manual'` e `scrollTo(0, 0)`.
2. `carga([...fontes])`; `criarMundo()`; `mundo.frame()` no `gsap.ticker`.
3. Quando a carga termina: medir o mundo (o título é rasterizado de novo com a Archivo já carregada).
4. `await loader(...)`; depois `suave()`, `revelar()`, `nav()`, `dia()`, medir e `entrada()`; por fim `ScrollTrigger.refresh()`.

### Regras de motion
- **Scroll dirige só o mundo**: cabeça do fio, a cena presa do Ato 2 e o relógio. **O texto entra por tempo**, uma vez: linhas que sobem da máscara (1,1 s `expo.out`, stagger 0,085) e blocos por opacidade + 30 px. Nada de scrub em texto.
- Uma suavização só: o Lenis. Nenhuma `transition` CSS em propriedade que o GSAP anima.
- **Todo objeto se condensa de pontos e só firma quando um elo fecha**, na mesma assinatura do hero (os dois C entram de fora, os elos deslizam pela diagonal de 45° e travam).
- Pulso dos elos a cada 3,8 s, só enquanto a seção está na tela.
- A **única inversão** de cor do site é a cena das 22 h (branco para tinta e de volta). Nenhuma outra seção escura.

### Referências (inspiração de técnica, sem copiar o visual)
**Profitize:**
- **Sinal:** um canvas fixo, um fluxo de pontos que desce a página passando por cada objeto e some perto de texto, wordmark do rodapé que chove, texto por tempo e scroll só no mundo. É a espinha do "fio".
- **Bilda:** a cena única presa por várias telas, com marcos e texto novo em cada um. Base do "dia do Marcos".
- **Trami:** o produto desenhado em HTML vivo em vez de captura de tela, com o fluxo rodando sozinho. Base das três cenas.
- **Proa:** o dia contado por um relógio que gira. Base do 07:00 → 22:00.

**Awwwards** (Sites of the Day de novembro de 2026, lidos pela descrição e pelas tags públicas, sem visitar os sites):
- **Grids (Obys):** o **loader** e o **footer** tratados como momentos de design, com WebGL e GSAP. Reforça que o nosso loader "Conectando" e o rodapé em pontos não são detalhe.
- **PSP Production:** **preloader, hero, mouse interaction e página 404** destacados como elementos. Base do nosso 404 "Sem conexão".
- **Cyera AI Guardian (Active Theory):** o visitante **joga** (pilota por planetas com minijogos) em vez de só rolar. Base do diagnóstico como mapa interativo.
- **La boite à slides:** "story-driven", entrada do hero e scroll narrativo em GSAP, Three.js e Nuxt. Reforça a história por cenas.
- **Night Drive Racing Game:** Three.js e WebGPU com interação rica. Lembrete de que o orçamento de desempenho existe: só o hero e o fio podem ser pesados.

### Regras de qualidade
- **Mobile em primeiro lugar**, conferido em 390, 768, 1280 e 1456 px; nenhuma letra cortada em repouso (acentos de "ação", descendentes de "g" e "p").
- 60 fps rolando no desktop; console limpo do loader ao rodapé; LCP e CLS medidos; o peso total e o do JS inicial com orçamento definido no começo.
- Acessibilidade: h1 real; canvas `aria-hidden`; a cena do dia tem o texto no HTML (não só desenhada); foco visível em tudo; contraste AA (o vermelho `#E8132E` sobre branco passa para texto grande e para botões; texto pequeno em vermelho **não** é permitido).
- SEO: título com os serviços, "Blumenau" no texto, dados estruturados `LocalBusiness`, `lang` correto, versão em inglês depois.
- LGPD: o formulário diz o que faz com os dados em uma linha, sem cadastro obrigatório.
- `npm run check:fast` passa (astro check, prettier, secretlint e floor-guard). Nenhum teste desligado para ficar verde.

### Conferir
1. Recarregue e veja o loader e a entrada do hero sem quadro em branco entre os dois.
2. Role devagar até o fim: o fio desce sem pular; cada cena do dia acende quando o fio chega; o relógio acompanha; a cena das 22 h escurece e volta.
3. Pare no meio de cada seção: nenhum ponto por cima de texto.
4. Faça o diagnóstico inteiro com o teclado e com o toque; desligue o JS e confirme que o formulário comum funciona.
5. Repita com movimento reduzido, sem WebGL e com a rede limitada ("Fast 4G", "Disable cache"). Abra uma URL inexistente e veja o 404.

---

## Guia do projeto (acrescente como seção do `AGENTS.md`)

- **Uma peça principal:** o mundo WebGL e o fio vermelho. Ele vem primeiro e precisa estar perfeito antes das seções.
- **Tudo é desenhado em código:** pontos de tinta, elos vermelhos, interfaces em HTML vivo. Sem foto de banco de imagem.
- **Vermelho só no elo.** Fundo branco; a única inversão é a cena das 22 h.
- **Nada surge pronto; o scroll dirige o mundo e o texto entra por tempo.**
- **Fatos reais ou `[preencher]`.** Nunca invente preço, número, cliente ou depoimento.
- Textos só em `src/i18n/`. Fontes só pelo `carga.ts`. Mudou algo no mundo? Rode o "Conferir" de novo nos trechos afetados.

## Checklist (para a pessoa)

- [ ] O WhatsApp e o e-mail de contato do Zacarias
- [ ] Os projetos reais: cliente (com autorização), problema, o que mudou, um número verdadeiro
- [ ] O preço de partida de cada serviço e o prazo de cada passo
- [ ] Uma foto do Zacarias (opcional)
- [ ] A decisão sobre o BrandBook v1 versus a identidade do código
- [ ] A versão em inglês (`en.ts`) é para agora ou depois?
