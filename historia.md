# codimdev — a história do site (v3: o portfólio como filme)

Direção nova, escolhida em 24/11/2026: **recomeçar do zero** no caminho do `pivenilya.com`. Ficam o **logo oficial** (`src/lib/marca/logo.ts`), os **fatos reais** (`briefing.md`), o **deploy na Hostinger** e a regra de voz. As versões anteriores (hero com dois cursores, túnel de palavras, placas em vídeo) estão em `arquivo/` e no histórico do git; nada delas é reaproveitado sem passar por aqui.

> **O que eu estudei, e o que não vi.** Li o HTML, o `preset.json` do hero e o texto do `pivenilya.com/portfolio`. O site barra navegador automático (verificação de robô) e eu não contornei isso: **não vi as animações rodando**, só a estrutura e os parâmetros. O que está abaixo é a leitura do código, reescrita para a codimdev. Se você tiver uma gravação de tela dele, mande: ela vale mais que a minha leitura.

> **Referência de design fixa (decisão de 24/11/2026):** `https://pivenilya.com/`. Todo layout, movimento e estrutura de sala parte dela.

## 1. A ideia, em uma frase

**O site é um filme curto sobre o trabalho, e o Zacarias é o personagem.** Um enxame de partículas se junta e escreve `codimdev`, desmancha e vira o retrato dele; ao rolar, o retrato recua e os projetos passam como cenas, cada uma com a paleta do próprio projeto.

## 2. O que o pivenilya.com ensina (a mecânica)

| O que se vê                                                                                                                                 | O que está por baixo                                                                                                                                                                                                                                                        | Na codimdev                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero de partículas.** O nome se monta voando e vira o retrato.                                                                            | Uma nuvem de ~408 mil pontos (120 mil no celular) gerada de uma **foto + mapa de profundidade** (`color`, `depth`, `photo`). Parâmetros do preset: o nome voa em 1,6 s, o morfismo dura 1,8 s, o mouse **repele** as partículas, a câmera tem parallax e uma lente de foco. | O mesmo desenho, com o `codimdev` e o recorte do Zacarias. WebGL liberado só aqui.                                                     |
| **"Scroll to watch portfolio".** A chamada é de assistir.                                                                                   | A página é uma sequência de "salas" (hero, portfólio, sobre, contatos) que abrem sem recarregar; o hero **recua** (zoom, desfoque) quando a sala seguinte entra.                                                                                                            | As salas da codimdev (seção 5). A chamada: "Role para ver o que eu fiz".                                                               |
| **Cada projeto é um filme.** Título grande (`film-title`), uma linha de resumo, a ficha (ano, cliente, trabalho, papel, site) e as imagens. | O caso tem **a própria paleta** (`--bg`, `--fg`, `--accent` trocados ao entrar) e uma navegação anterior/próximo.                                                                                                                                                           | Três casos autorais com paleta própria: Kraflo CMMS, Kraflo OS Bot e Tenua.                                                            |
| **"Apresentação": o rosto vira um botão de play.**                                                                                          | O autor explica o caso em voz.                                                                                                                                                                                                                                              | **Sem áudio** (sua decisão): o rosto do Zacarias abre uma explicação curta em texto, por cima do caso.                                 |
| **Filtros e duas vistas** (Todos, Web, Motion; grade e lista).                                                                              | Estado na URL e animação de reordenação.                                                                                                                                                                                                                                    | Filtros: Todos, Sites, Sistemas. Duas vistas: grade e lista.                                                                           |
| **Contatos com um "compositor".** Escreve-se a mensagem num editor com ferramentas e envia-se.                                              | Um formulário com consentimento (LGPD) e a política de privacidade num painel.                                                                                                                                                                                              | O compositor vira o **orçamento**: nome, o que precisa e como falar; abre o WhatsApp ou o e-mail com a mensagem pronta (sem servidor). |
| **Preloader com o nome**, fontes carregadas antes de mostrar.                                                                               | `visibility: hidden` até a carga, depois a entrada.                                                                                                                                                                                                                         | O carregador que já existe (`FontFace`, progresso real), agora com o símbolo da marca se montando em partículas.                       |

## 3. O hero (o momento que vira o site)

- **Partículas, em ordem:** (1) a tela escura de `--grafite`; (2) as partículas entram voando pelas bordas e **escrevem `codimdev`** da esquerda para a direita (o logo oficial vira a máscara dos pontos; a barrinha carmim é a única parte em carmim); (3) seguram 0,3 s; (4) o nome **desmancha em um redemoinho curto** e os mesmos pontos viram o **retrato do Zacarias** (cor em tons de algodão, profundidade real, borda do recorte em partículas soltas); (5) o retrato respira (movimento mínimo) e as partículas perto do mouse **se afastam** e voltam.
- **Ao rolar**, o retrato **recua** (câmera se afasta, desfoque sobe) e a primeira sala entra por cima. A rolagem dirige só a câmera; o texto entra por tempo.
- **Texto do hero:** o título "Seu site deveria vender. Não só existir." entra por tempo sobre o retrato, ao lado, em letras grandes; botões "Pedir orçamento" (carmim) e "Ver projetos".
- **Quando não há WebGL**, a pessoa pediu movimento reduzido, ou o aparelho é fraco: a foto do recorte parada, com o nome por baixo. **Nunca uma tela vazia.**
- **Desempenho (mesma régua):** 120 mil partículas no celular e 300 mil no computador; se a média de FPS ficar abaixo de 40 nos primeiros 2 s, cai para metade e depois para a foto. JS inicial até 150 KB comprimido, o WebGL carregado só depois da primeira pintura.

## 4. A linguagem visual (recomeçando o design system)

- **Fica:** o logo oficial, a grafia `codimdev`, a barrinha (cursor, marcador, "visto", luz de status), cantos de 4 px, voz do artesão. A base continua **algodão, grafite e carmim** (é a marca), mas **cada caso troca para a paleta do próprio projeto** e a base volta quando se sai dele. Fontes: a decidir com você (veja "Em aberto").
- **Sai:** a grade de fundo de 24 px, a barra de colunas, o túnel, os dois cursores, as placas e o vídeo. O que valer a pena volta pela mão, com motivo.
- **Movimento:** poucas peças, bem grandes. Uma só coisa se move de cada vez; as trocas de sala são cortes limpos com o título do próximo filme chegando.

## 5. As salas (as páginas)

Uma rota por sala; entre elas, transição de página sem piscar (hero que recua e sala que entra).

1. **Início:** o hero de partículas e a chamada de rolagem.
2. **Projetos:** o título da sala, os filtros (Todos, Sites, Sistemas), a troca de vista (grade/lista) e **uma linha por projeto** com o nome, a descrição curta e a miniatura; ao passar o mouse, o cartão se acende com a paleta do projeto.
3. **Caso** (3 páginas: `/projetos/kraflo-cmms`, `/projetos/kraflo-os-bot`, `/projetos/tenua`): título grande; uma frase de resumo; "sobre" em 2 ou 3 linhas; a ficha (Ano, Cliente, Trabalho, Papel, Link); o **botão do rosto** ("Apresentação" · "eu te explico o caso") que abre o texto; a galeria de imagens; navegação anterior/próximo. **Os projetos são autorais e o site diz isso** ("Projeto autoral", no lugar de cliente).
4. **Sobre:** quem sou (Zacarias, de Guadalupe, no Piauí; hoje em Blumenau), a frase grande, o lema, os **cinco serviços** em linhas, o **"como funciona"** em cinco passos (conversa, protótipo, código, testes, no ar; os mesmos fatos que o `briefing.md` autoriza) e o botão "Pedir orçamento". Sem emprego atual, sem "CLT", sem "Lino Estúdio".
5. **Contato:** os links (WhatsApp, e-mail, Instagram) e o **compositor do orçamento**; consentimento claro; a política de privacidade num painel.
6. **Privacidade**, **404** (a barrinha carmim piscando e o link de volta) e o **carregador**.

## 6. Os três casos (o que existe de verdade)

Só entra o que é fato. O que falta é `[preencher]`; nada de número, cliente ou depoimento inventado.

| Caso              | O que é                                                     | Ficha                                                                                           |
| ----------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Kraflo CMMS**   | Sistema de manutenção industrial. Projeto autoral.          | Ano `[preencher]` · Papel: design e código · Link: `[preencher]` (repositório ou demonstração). |
| **Kraflo OS Bot** | Bot de ordens de serviço. Projeto autoral.                  | Ano `[preencher]` · Papel: código · Link: `[preencher]`.                                        |
| **Tenua**         | Site de portfólio para um ateliê fictício. Projeto autoral. | Ano `[preencher]` · Papel: design e código · Link: `[preencher]`.                               |

Cada caso precisa de **prints 16:10 em modo escuro** (a galeria) e de **2 cores do próprio projeto** (a paleta do caso). Sem os prints, a galeria mostra o `[preencher]`.

## 7. Tecnologia (decidida)

Astro estático e várias páginas; GSAP e ScrollTrigger; Lenis; **WebGL com `ogl`** (leve) e um shader de partículas próprio, só no hero; transições de página com a View Transitions API e fallback; tudo o mais em CSS. Versões travadas. Hospedagem estática na Hostinger (o fluxo atual segue).

## 8. O que eu preciso de você

1. **O retrato:** o recorte atual (840 × 1050) serve para começar, mas partículas pedem foto grande e nítida. Mande as fotos extras do Zacarias (a pasta `imagens/zacarias/` do repositório da marca) e, se puder, uma foto de busto em fundo liso, boa luz.
2. **Prints dos três casos** em modo escuro, 16:10, e as duas cores principais de cada um.
3. **Fonte:** manter IBM Plex/Inter (da marca) ou trocar por uma grotesca mais forte para os títulos grandes, como o `pivenilya.com` faz? A marca manda; você decide.

## 9. Em aberto

- **Mapa de profundidade do retrato:** eu gero (a partir da silhueta e da luz da foto) ou rodo um modelo de profundidade; a qualidade melhora muito com a foto maior.
- **"15 dias" de ajuste** depois da entrega: segue sem confirmação.
- **Domínio e e-mail** (`contato@codimdev.com.br`): confirmar.
- **Os custos do Higgsfield** (42,64 créditos): ficam guardados; esta direção não pede vídeo.
