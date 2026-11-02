// Download com progresso real (técnica estudada na template Sinal; código próprio).
// Cada arquivo vem por fetch em stream e conta byte a byte; o tamanho sai do Content-Length (sem ele, uma
// estimativa até o arquivo terminar). O JS e o CSS que já chegaram entram pela Resource Timing, então o
// contador abre onde a carga está. Fontes viram FontFace a partir dos bytes e imagens viram URL de Blob:
// nada é baixado duas vezes. (O mostrador do loader que lê este progresso é a fatia T4.)

const ESTIMATIVA = 40000;

/** A família, o peso e o estilo de cada arquivo: a face registrada aqui é a que o CSS e o canvas usam. */
const FONTES: Record<string, [string, FontFaceDescriptors]> = {
  'jetbrains-mono-500': ['JetBrains Mono', { weight: '500' }],
  'archivo-condensada-800': ['Archivo Condensada', { weight: '800' }],
  'inter-400': ['Inter', { weight: '400' }],
  'inter-600': ['Inter', { weight: '600' }],
};

/** A ordem importa: a primeira desce sozinha (é a do contador do loader). */
export const ARQUIVOS_FONTES = [
  '/fonts/jetbrains-mono-500.woff2',
  '/fonts/archivo-condensada-800.woff2',
  '/fonts/inter-400.woff2',
  '/fonts/inter-600.woff2',
];

interface Item {
  caminho: string;
  veio: number;
  tamanho: number;
  pronto: boolean;
  url: string | null;
}

export interface Progresso {
  p: number;
  veio: number;
  total: number;
  arquivos: number;
}

export interface Carga {
  pronta: Promise<void>;
  arquivo(caminho: string): Promise<void>;
  progresso(): Progresso;
  url(caminho: string): Promise<string> | string;
}

export function carga(caminhos: string[]): Carga {
  const casca = performance
    .getEntriesByType('resource')
    .filter((e) => e.name.startsWith(location.origin) && /\.(m?js|css|ts)(\?|$)|\/src\/|\/@/.test(e.name))
    .reduce((n, e) => {
      const r = e as PerformanceResourceTiming;
      return n + (r.encodedBodySize || r.decodedBodySize || 0);
    }, 0);
  const itens: Item[] = caminhos.map((caminho) => ({ caminho, veio: 0, tamanho: 0, pronto: false, url: null }));

  const baixar = async (it: Item) => {
    try {
      const res = await fetch(it.caminho);
      if (!res.ok) throw new Error(`${res.status} ${it.caminho}`);
      it.tamanho = Number(res.headers.get('content-length')) || 0;
      const pedacos: Uint8Array[] = [];
      if (res.body) {
        const leitor = res.body.getReader();
        for (;;) {
          const { done, value } = await leitor.read();
          if (done) break;
          pedacos.push(value);
          it.veio += value.byteLength;
        }
      } else {
        const b = new Uint8Array(await res.arrayBuffer());
        pedacos.push(b);
        it.veio = b.byteLength;
      }
      const blob = new Blob(pedacos as BlobPart[], { type: res.headers.get('content-type') ?? '' });
      if (it.caminho.endsWith('.woff2')) await registrarFonte(it.caminho, await blob.arrayBuffer());
      else it.url = URL.createObjectURL(blob);
    } catch (e) {
      console.warn('[carga]', (e as Error).message);
    }
    it.tamanho = it.veio || it.tamanho; // sem Content-Length (ou com erro): o arquivo pesa o que veio
    it.pronto = true;
  };

  // o primeiro arquivo desce sozinho; os outros dividem a banda depois dele
  const primeiro = itens.length ? baixar(itens[0]) : Promise.resolve();
  const tarefas = [primeiro, ...itens.slice(1).map((it) => primeiro.then(() => baixar(it)))];

  return {
    pronta: Promise.all(tarefas).then(() => undefined),
    arquivo: (caminho) => tarefas[caminhos.indexOf(caminho)] ?? Promise.resolve(),
    progresso() {
      let veio = casca;
      let total = casca;
      let arquivos = 0;
      for (const it of itens) {
        veio += it.veio;
        total += it.pronto ? it.veio : it.tamanho || Math.max(it.veio, ESTIMATIVA);
        if (it.pronto) arquivos++;
      }
      return { p: arquivos === itens.length ? 1 : Math.min(0.999, veio / total), veio, total, arquivos };
    },
    // URL do Blob quando o arquivo é desta carga (espera o download em curso, nunca baixa de novo); senão o caminho
    url: (caminho) => {
      const i = caminhos.indexOf(caminho);
      return i < 0 ? caminho : tarefas[i].then(() => itens[i].url ?? caminho);
    },
  };
}

async function registrarFonte(caminho: string, buf: ArrayBuffer) {
  const chave = caminho.split('/').pop()?.replace('.woff2', '') ?? '';
  const def = FONTES[chave];
  if (!def) return;
  const face = new FontFace(def[0], buf, def[1]);
  await face.load();
  document.fonts.add(face);
}
