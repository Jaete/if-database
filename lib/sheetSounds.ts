// Sons da ficha: Web Audio sintetizado, sem nenhum arquivo.
//
// Medieval: cordas dedilhadas (Karplus-Strong), sinos inarmônicos, pergaminho,
// madeira, moedas e metais, tudo numa reverb de salão de pedra gerada na hora.
//
// Regras:
//  - Nada é criado ao carregar. O AudioContext nasce no primeiro som, e o
//    primeiro som só toca depois de um gesto DENTRO da ficha (`arm`). Ler uma
//    ficha num post do fórum não faz trabalho de áudio nenhum.
//  - Dois grupos com chave própria por pessoa (localStorage): Eventos (padrão
//    ligado, 0,5) e Interface (padrão ligado, 0,2).
//  - Movimento reduzido NÃO silencia: só o botão de som desliga.

export type SoundGroup = 'evt' | 'ui';

export const MASTER_VOLUME = 0.9;
export const GROUP_VOLUME: Record<SoundGroup, number> = { evt: 0.5, ui: 0.2 };
export const STORAGE_KEY: Record<SoundGroup, string> = {
  evt: 'ifdb-sons-eventos',
  ui: 'ifdb-sons-interface',
};

/** id → [grupo, seção, evento da interface, rótulo]. A tabela do desenho. */
export const SOUNDS = [
  ['coins', 'evt', 'lv', 'Admin confirma "Conceder XP"', 'Moedas em cascata'],
  [
    'harp',
    'evt',
    'lv',
    'Hover/foco no botão "Subir de nível" (no máx. 1 a cada 4 s)',
    'Glissando de harpa',
  ],
  [
    'swell',
    'evt',
    'lv',
    'Cerimônia: 0 a 0,45 s',
    'Cordas e coro subindo + rufar de tímpano',
  ],
  ['flash', 'evt', 'lv', 'Cerimônia: clarão, 0,45 s', 'Sino grande + gongo'],
  [
    'tick',
    'ui',
    'lv',
    'Cerimônia: número rola (1,1 s e 1,95 s)',
    'Tique de madeira',
  ],
  ['unroll', 'evt', 'lv', 'Abrir a tela de subida', 'Pergaminho desenrolando'],
  ['lute', 'evt', 'lv', 'Um passo ganha ✓', 'Alaúde dedilhado (quinta)'],
  ['pick', 'ui', 'lv', 'Selecionar na subida', 'Toque seco de pena'],
  ['unpick', 'ui', 'lv', 'Desmarcar na subida', 'Toque seco, mais suave'],
  [
    'die',
    'evt',
    'lv',
    'Rolar o dado de vida',
    'Dado rolando na madeira → pouso',
  ],
  ['dieBell', 'evt', 'lv', 'Resultado do dado', 'Sino único'],
  ['seal', 'evt', 'lv', '"Selar nível"', 'Carimbo de lacre + papel'],
  [
    'fanfare',
    'evt',
    'lv',
    'Último nível pendente selado',
    'Fanfarra em Ré dórico + tímpano',
  ],
  [
    'distantBell',
    'evt',
    'lv',
    'Dono abre a ficha com nível disponível · níveis ainda pendentes após selar',
    'Sino distante',
  ],
  [
    'coinSeq',
    'evt',
    'lv',
    'Barra de XP recebendo XP (admin)',
    'Sequência de moedas',
  ],
  [
    'pageTurn',
    'ui',
    'sheet',
    'Trocar seção do menu · passos · abas',
    'Virar de página',
  ],
  [
    'paperSlide',
    'ui',
    'sheet',
    'Abrir/fechar leitor lateral, descrição, diálogos',
    'Papel deslizando',
  ],
  ['unrollUi', 'ui', 'sheet', '"Ampliar"', 'Pergaminho desenrolando (curto)'],
  ['quillDip', 'ui', 'sheet', 'Entrar no modo de edição', 'Pena no tinteiro'],
  ['saveSeal', 'evt', 'sheet', 'Salvar com sucesso', 'Lacre leve'],
  [
    'knock',
    'ui',
    'sheet',
    'Erro ao salvar · ação recusada',
    'Batida seca na madeira',
  ],
  [
    'crumple',
    'ui',
    'sheet',
    'Descartar · desfazer · remover linha do recibo',
    'Papel amassado',
  ],
  [
    'bookOpen',
    'ui',
    'sheet',
    'Abrir a camada do códice',
    'Livro pesado abrindo',
  ],
  ['bookClose', 'ui', 'sheet', 'Voltar do códice', 'Livro fechando'],
  [
    'quill',
    'ui',
    'sheet',
    'Escolher uma carta no códice, fora da subida',
    'Risco de pena',
  ],
  [
    'stampLight',
    'evt',
    'sheet',
    '"Aplicar à ficha" · reabrir nível',
    'Carimbo leve',
  ],
  [
    'arcaneUp',
    'ui',
    'sheet',
    'Preparar magia na seção Magias',
    'Brilho arcano subindo',
  ],
  [
    'arcaneDown',
    'ui',
    'sheet',
    'Despreparar magia na seção Magias',
    'Brilho arcano descendo',
  ],
  ['spark', 'ui', 'sheet', 'Gastar espaço de magia', 'Faísca'],
  ['smallBell', 'ui', 'sheet', 'Recuperar espaços', 'Sino pequeno'],
  [
    'luteNote',
    'ui',
    'sheet',
    'Adicionar talento na seção Talentos',
    'Nota de alaúde',
  ],
  [
    'luteLow',
    'ui',
    'sheet',
    'Remover talento na seção Talentos',
    'Nota grave de alaúde',
  ],
  ['metal', 'ui', 'sheet', 'Equipar arma ou armadura', 'Tilintar de metal'],
  ['cloth', 'ui', 'sheet', 'Equipar roupa ou acessório', 'Farfalhar de tecido'],
  ['coinsUi', 'ui', 'sheet', 'Gil alterado · somar fonte no recibo', 'Moedas'],
  ['wind', 'ui', 'sheet', 'Gastar ou recuperar Chi', 'Vento curto'],
  [
    'heartbeat',
    'ui',
    'sheet',
    'Vida máxima alterada',
    'Batimento (duas batidas)',
  ],
  ['candle', 'ui', 'sheet', 'Trocar tema', 'Chama de vela'],
  ['latch', 'ui', 'sheet', 'Copiar link · abrir o seletor de sons', 'Trinco'],
] as const;

export type SoundId = (typeof SOUNDS)[number][0];

const GROUP_OF = Object.fromEntries(
  SOUNDS.map(([id, group]) => [id, group])
) as Record<SoundId, SoundGroup>;

// ── Preferências por pessoa ──────────────────────────────

export interface ISoundSettings {
  evt: boolean;
  ui: boolean;
}

const DEFAULTS: ISoundSettings = { evt: true, ui: true };
let settings: ISoundSettings | null = null;
const listeners = new Set<() => void>();

/** Lê do localStorage na primeira pergunta (nunca no carregamento do módulo). */
function readSettings(): ISoundSettings {
  if (settings) return settings;
  const next = { ...DEFAULTS };
  try {
    next.evt = localStorage.getItem(STORAGE_KEY.evt) !== 'off';
    next.ui = localStorage.getItem(STORAGE_KEY.ui) !== 'off';
  } catch {
    // Sem armazenamento: valem os padrões.
  }
  settings = next;
  return next;
}

export const getSoundSettings = (): ISoundSettings => readSettings();
export const getServerSoundSettings = (): ISoundSettings => DEFAULTS;

export function setSoundGroup(group: SoundGroup, on: boolean) {
  settings = { ...readSettings(), [group]: on };
  try {
    localStorage.setItem(STORAGE_KEY[group], on ? 'on' : 'off');
  } catch {
    // A escolha vale nesta sessão mesmo sem armazenamento.
  }
  listeners.forEach((fn) => fn());
}

export function subscribeSoundSettings(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// ── O motor ──────────────────────────────────────────────

let armed = false;
/** Um gesto dentro da ficha libera o som. Só marca; não cria áudio. */
export const armSounds = () => {
  armed = true;
};

let ctx: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;
const bus = {} as Record<SoundGroup, { dry: GainNode; wet: GainNode }>;
let cur: { dry: GainNode; wet: GainNode } | null = null;
const ksCache = new Map<string, AudioBuffer>();

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// ── bloco: reverb de salão de pedra (IR procedural) ──
function stoneHallIR(c: AudioContext, dur = 1.8) {
  const sr = c.sampleRate;
  const len = Math.floor(sr * dur);
  const b = c.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const k = 0.25 + 0.7 * t;
      lp += (Math.random() * 2 - 1 - lp) * (1 - k);
      d[i] = lp * Math.pow(1 - t, 2.4) * Math.min(1, i / (sr * 0.01));
    }
    [0.013, 0.021, 0.034, 0.047, 0.066].forEach((er, j) => {
      const at = Math.floor((er + ch * 0.003) * sr);
      if (at < len) d[at] += (0.5 - j * 0.07) * (Math.random() < 0.5 ? -1 : 1);
    });
  }
  return b;
}

function init(): boolean {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return false;
  const c = new Ctor();
  ctx = c;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 3;
  comp.connect(c.destination);
  const m = c.createGain();
  m.gain.value = MASTER_VOLUME;
  m.connect(comp);
  const rev = c.createConvolver();
  rev.buffer = stoneHallIR(c, 1.8);
  rev.connect(m);
  for (const k of ['evt', 'ui'] as const) {
    const dry = c.createGain();
    dry.gain.value = GROUP_VOLUME[k];
    dry.connect(m);
    const wet = c.createGain();
    wet.gain.value = GROUP_VOLUME[k];
    wet.connect(rev);
    bus[k] = { dry, wet };
  }
  noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return true;
}

// Saída de uma voz: seco + envio para a reverb (wet = 0..1).
function out(wet = 0.3) {
  const c = ctx!;
  const g = c.createGain();
  g.connect(cur!.dry);
  const w = c.createGain();
  w.gain.value = wet;
  g.connect(w);
  w.connect(cur!.wet);
  return g;
}

const envAD = (gn: GainNode, t: number, a: number, d: number, peak: number) => {
  gn.gain.setValueAtTime(0.0001, t);
  gn.gain.exponentialRampToValueAtTime(peak, t + a);
  gn.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
};

// ── bloco: Karplus-Strong (buffer calculado, cacheado) ──
function ksBuffer(f: number, dur: number, damp: number, bright: number) {
  const key = [f.toFixed(2), dur, damp, bright].join('|');
  const hit = ksCache.get(key);
  if (hit) return hit;
  const c = ctx!;
  const sr = c.sampleRate;
  const N = Math.max(2, Math.round(sr / f));
  const len = Math.floor(sr * dur);
  const line = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) {
    lp += (Math.random() * 2 - 1 - lp) * bright;
    line[i] = lp;
  }
  const b = c.createBuffer(1, len, sr);
  const o = b.getChannelData(0);
  let idx = 0;
  for (let i = 0; i < len; i++) {
    const nx = (idx + 1) % N;
    const v = line[idx];
    line[idx] = damp * 0.5 * (line[idx] + line[nx]);
    o[i] = v;
    idx = nx;
  }
  ksCache.set(key, b);
  return b;
}

interface IPluck {
  f: number;
  g?: number;
  dur?: number;
  damp?: number;
  bright?: number;
  det?: number;
  wet?: number;
  body?: number;
}

// Corda dupla (curso de alaúde): duas cordas levemente desafinadas.
function pluck(t: number, o: IPluck) {
  const {
    f,
    g = 0.15,
    dur = 1.6,
    damp = 0.996,
    bright = 0.5,
    det = 4,
    wet = 0.3,
    body = 3200,
  } = o;
  const c = ctx!;
  const dest = out(wet);
  const lpf = c.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = body;
  lpf.connect(dest);
  const pk = c.createBiquadFilter();
  pk.type = 'peaking';
  pk.frequency.value = 220;
  pk.gain.value = 4;
  pk.Q.value = 1;
  pk.connect(lpf);
  (
    [
      [f, 0],
      [f * Math.pow(2, det / 1200), 0.006],
    ] as const
  ).forEach(([ff, off], i) => {
    const src = c.createBufferSource();
    src.buffer = ksBuffer(ff, dur, damp, bright);
    const gg = c.createGain();
    gg.gain.value = g * (i ? 0.7 : 1);
    src.connect(gg);
    gg.connect(pk);
    src.start(t + off);
  });
}

// ── bloco: sino aditivo com parciais inarmônicos ──
const BELL = [0.56, 0.92, 1.19, 1.71, 2.0, 2.74, 3.0, 3.76, 4.07];
const BELL_A = [0.9, 0.6, 1, 0.55, 0.5, 0.35, 0.3, 0.2, 0.16];

interface IBell {
  f: number;
  g?: number;
  d?: number;
  wet?: number;
  ratios?: number[];
  amps?: number[];
}

function bell(t: number, o: IBell) {
  const { f, g = 0.2, d = 2, wet = 0.45, ratios = BELL, amps = BELL_A } = o;
  const c = ctx!;
  const dest = out(wet);
  ratios.forEach((r, i) => {
    const os = c.createOscillator();
    os.type = 'sine';
    os.frequency.value = f * r;
    os.detune.value = rnd(-3, 3);
    const e = c.createGain();
    envAD(
      e,
      t,
      0.002,
      d * (1 - i * 0.07),
      Math.max(0.0002, (g * (amps[i] ?? 0.2)) / 2)
    );
    os.connect(e);
    e.connect(dest);
    os.start(t);
    os.stop(t + d + 0.1);
  });
}

interface INoise {
  type?: BiquadFilterType;
  f?: number;
  f2?: number | null;
  q?: number;
  a?: number;
  d?: number;
  g?: number;
  wet?: number;
}

// ── bloco: ruído filtrado ──
function noise(t: number, o: INoise) {
  const {
    type = 'bandpass',
    f = 2000,
    f2 = null,
    q = 1,
    a = 0.003,
    d = 0.1,
    g = 0.1,
    wet = 0.2,
  } = o;
  const c = ctx!;
  const dest = out(wet);
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const bq = c.createBiquadFilter();
  bq.type = type;
  bq.frequency.setValueAtTime(f, t);
  bq.Q.value = q;
  if (f2) bq.frequency.exponentialRampToValueAtTime(f2, t + a + d);
  const e = c.createGain();
  envAD(e, t, a, d, g);
  src.connect(bq);
  bq.connect(e);
  e.connect(dest);
  src.start(t, rnd(0, 1.5));
  src.stop(t + a + d + 0.05);
}

interface IGrains {
  n: number;
  span: number;
  lo: number;
  hi: number;
  q?: number;
  dLo?: number;
  dHi?: number;
  gLo?: number;
  gHi?: number;
  wet?: number;
  type?: BiquadFilterType;
}

// Rajadas curtas de ruído: pergaminho, pena, amassar e faísca.
function grains(t: number, o: IGrains) {
  const {
    n,
    span,
    lo,
    hi,
    q = 2,
    dLo = 0.01,
    dHi = 0.03,
    gLo = 0.03,
    gHi = 0.07,
    wet = 0.2,
    type = 'bandpass',
  } = o;
  for (let i = 0; i < n; i++) {
    noise(t + rnd(0, span), {
      type,
      f: rnd(lo, hi),
      q,
      d: rnd(dLo, dHi),
      g: rnd(gLo, gHi),
      wet,
    });
  }
}

function gong(
  t: number,
  o: { f?: number; g?: number; d?: number; wet?: number }
) {
  const { f = 73.4, g = 0.3, d = 3.4, wet = 0.6 } = o;
  const c = ctx!;
  const dest = out(wet);
  [1, 1.47, 2.09, 2.56, 3.16, 3.87, 4.5].forEach((r, i) => {
    const os = c.createOscillator();
    os.type = 'sine';
    os.frequency.setValueAtTime(f * r * 1.006, t);
    os.frequency.exponentialRampToValueAtTime(f * r, t + 0.6);
    const e = c.createGain();
    envAD(e, t, 0.012, d * (1 - i * 0.08), g / (1 + i * 0.6));
    os.connect(e);
    e.connect(dest);
    os.start(t);
    os.stop(t + d + 0.1);
  });
  noise(t, { type: 'lowpass', f: 900, a: 0.05, d: 1.4, g: g * 0.25, wet });
}

interface IThud {
  f1?: number;
  f2?: number;
  d?: number;
  g?: number;
  body?: number;
  bodyQ?: number;
  bodyG?: number;
  click?: number;
  wet?: number;
}

// ── bloco: baque (madeira, carimbo, tambor) ──
function thud(t: number, o: IThud) {
  const {
    f1 = 140,
    f2 = 50,
    d = 0.25,
    g = 0.5,
    body = 450,
    bodyQ = 8,
    bodyG = 0.25,
    click = 0.2,
    wet = 0.3,
  } = o;
  const c = ctx!;
  const dest = out(wet);
  const os = c.createOscillator();
  os.type = 'triangle';
  os.frequency.setValueAtTime(f1, t);
  os.frequency.exponentialRampToValueAtTime(f2, t + d);
  const e = c.createGain();
  envAD(e, t, 0.002, d, g);
  os.connect(e);
  e.connect(dest);
  os.start(t);
  os.stop(t + d + 0.05);
  noise(t, { type: 'lowpass', f: 1500, a: 0.001, d: 0.03, g: click, wet });
  noise(t, {
    type: 'bandpass',
    f: body,
    q: bodyQ,
    a: 0.001,
    d: Math.min(0.12, d * 0.6),
    g: bodyG,
    wet,
  });
}

// ── bloco: metal "brass" (3 serras desafinadas, filtro que abre, vibrato) ──
function brass(
  t: number,
  o: { f: number; d?: number; g?: number; wet?: number }
) {
  const { f, d = 0.4, g = 0.1, wet = 0.45 } = o;
  const c = ctx!;
  const dest = out(wet);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 1.2;
  lp.frequency.setValueAtTime(350, t);
  lp.frequency.linearRampToValueAtTime(2600, t + 0.06);
  lp.frequency.exponentialRampToValueAtTime(1300, t + 0.25);
  const e = c.createGain();
  e.gain.setValueAtTime(0.0001, t);
  e.gain.exponentialRampToValueAtTime(g, t + 0.035);
  e.gain.setValueAtTime(g * 0.85, t + d);
  e.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.25);
  lp.connect(e);
  e.connect(dest);
  const lfo = c.createOscillator();
  lfo.frequency.value = 5.5;
  const lg = c.createGain();
  lg.gain.setValueAtTime(0, t);
  lg.gain.setValueAtTime(0, t + 0.15);
  lg.gain.linearRampToValueAtTime(7, t + 0.35);
  lfo.connect(lg);
  lfo.start(t);
  lfo.stop(t + d + 0.3);
  [-8, 0, 8].forEach((cents) => {
    const os = c.createOscillator();
    os.type = 'sawtooth';
    os.frequency.value = f;
    os.detune.value = cents;
    lg.connect(os.detune);
    os.connect(lp);
    os.start(t);
    os.stop(t + d + 0.3);
  });
}

// ── bloco: pad de cordas e coro (serras + formantes "ah") ──
function pad(
  t: number,
  o: { freqs: number[]; dur?: number; g?: number; wet?: number }
) {
  const { freqs, dur = 0.5, g = 0.1, wet = 0.55 } = o;
  const c = ctx!;
  const dest = out(wet);
  const e = c.createGain();
  e.gain.setValueAtTime(0.0001, t);
  e.gain.exponentialRampToValueAtTime(g, t + dur * 0.95);
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.35);
  e.connect(dest);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(300, t);
  lp.frequency.exponentialRampToValueAtTime(2200, t + dur);
  lp.connect(e);
  [700, 1150].forEach((ff) => {
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = ff;
    bp.Q.value = 5;
    const bg = c.createGain();
    bg.gain.value = 1.6;
    bp.connect(bg);
    bg.connect(e);
    lp.connect(bp);
  });
  freqs.forEach((f) =>
    [-7, 7].forEach((cents) => {
      const os = c.createOscillator();
      os.type = 'sawtooth';
      os.frequency.setValueAtTime(f * 0.985, t);
      os.frequency.exponentialRampToValueAtTime(f, t + dur);
      os.detune.value = cents;
      os.connect(lp);
      os.start(t);
      os.stop(t + dur + 0.4);
    })
  );
}

const timpani = (t: number, f = 73.4, g = 0.35) =>
  thud(t, {
    f1: f * 1.25,
    f2: f,
    d: 0.6,
    g,
    body: 180,
    bodyQ: 4,
    bodyG: 0.08,
    click: 0.05,
    wet: 0.5,
  });
const DORIAN = [293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33]; // Ré dórico
const coinGrain = (t: number, g = 0.08) =>
  bell(t, {
    f: rnd(2600, 5200),
    g,
    d: rnd(0.12, 0.28),
    ratios: [1, 1.71, 2.74, 3.76],
    amps: [1, 0.6, 0.4, 0.25],
    wet: 0.25,
  });

type Recipe = (t: number, extra?: number) => void;

const R: Record<SoundId, Recipe> = {
  coins(t) {
    for (let i = 0; i < 8; i++)
      coinGrain(t + i * 0.05 + rnd(0, 0.03), 0.09 - i * 0.004);
    thud(t + 0.42, {
      f1: 900,
      f2: 600,
      d: 0.03,
      g: 0.05,
      body: 2400,
      bodyG: 0.05,
      click: 0.03,
    });
  },
  coinSeq(t) {
    for (let i = 0; i < 5; i++) coinGrain(t + i * 0.11, 0.07);
  },
  coinsUi(t) {
    for (let i = 0; i < 3; i++) coinGrain(t + i * 0.04 + rnd(0, 0.02), 0.1);
  },
  harp(t) {
    DORIAN.forEach((f, i) =>
      pluck(t + i * 0.045, { f, g: 0.07, damp: 0.997, bright: 0.45, wet: 0.4 })
    );
  },
  swell(t, dur = 0.45) {
    pad(t, { freqs: [146.83, 220, 293.66], dur, g: 0.14 });
    for (let i = 0; i < 9; i++)
      timpani(t + (i / 9) * dur, 73.4, 0.05 + i * 0.025);
  },
  flash(t) {
    bell(t, { f: 587.33, g: 0.32, d: 3, wet: 0.55 });
    gong(t, { f: 73.4, g: 0.28 });
    noise(t, { type: 'highpass', f: 3000, d: 0.25, g: 0.05, wet: 0.6 });
  },
  tick(t) {
    thud(t, {
      f1: 1400,
      f2: 900,
      d: 0.03,
      g: 0.12,
      body: 1800,
      bodyQ: 10,
      bodyG: 0.12,
      click: 0.08,
      wet: 0.2,
    });
  },
  unroll(t) {
    noise(t, { f: 900, f2: 2600, q: 0.9, a: 0.08, d: 0.45, g: 0.05, wet: 0.3 });
    grains(t, {
      n: 16,
      span: 0.55,
      lo: 1200,
      hi: 3500,
      q: 1.5,
      dLo: 0.015,
      dHi: 0.05,
      gLo: 0.025,
      gHi: 0.07,
      wet: 0.3,
    });
    thud(t + 0.55, {
      f1: 300,
      f2: 180,
      d: 0.05,
      g: 0.06,
      body: 700,
      bodyG: 0.06,
      click: 0.02,
    });
  },
  unrollUi(t) {
    R.unroll(t);
  },
  lute(t) {
    pluck(t, { f: 293.66, g: 0.16, damp: 0.995, bright: 0.45 });
    pluck(t + 0.06, { f: 440, g: 0.13, damp: 0.995, bright: 0.45 });
  },
  die(t, dur = 1.5) {
    let x = t;
    let k = 0;
    while (x < t + dur - 0.08) {
      thud(x, {
        f1: rnd(700, 1000),
        f2: rnd(450, 600),
        d: 0.035,
        g: rnd(0.08, 0.16),
        body: rnd(600, 1300),
        bodyQ: 12,
        bodyG: rnd(0.08, 0.16),
        click: 0.08,
        wet: 0.25,
      });
      x += 0.06 + Math.random() * 0.09 + k * 0.006;
      k++;
    }
    const e = t + dur;
    thud(e, { f1: 140, f2: 50, d: 0.22, g: 0.5, body: 420, bodyG: 0.3 });
    thud(e + 0.09, {
      f1: 160,
      f2: 70,
      d: 0.08,
      g: 0.14,
      body: 520,
      bodyG: 0.12,
    });
  },
  dieBell(t) {
    bell(t, { f: 880, g: 0.2, d: 1.8, wet: 0.5 });
  },
  seal(t) {
    thud(t, {
      f1: 120,
      f2: 42,
      d: 0.35,
      g: 0.7,
      body: 320,
      bodyG: 0.35,
      click: 0.25,
      wet: 0.35,
    });
    grains(t + 0.02, {
      n: 5,
      span: 0.15,
      lo: 1500,
      hi: 3500,
      gLo: 0.03,
      gHi: 0.06,
    });
    gong(t + 0.01, { f: 110, g: 0.07, d: 1.8, wet: 0.55 });
  },
  saveSeal(t) {
    thud(t, { f1: 160, f2: 60, d: 0.2, g: 0.35, body: 380, bodyG: 0.22 });
    grains(t + 0.02, { n: 3, span: 0.1, lo: 1500, hi: 3500 });
  },
  stampLight(t) {
    thud(t, { f1: 200, f2: 80, d: 0.15, g: 0.3, body: 500, bodyG: 0.2 });
    noise(t + 0.03, { f: 2500, q: 1.2, d: 0.04, g: 0.04 });
  },
  fanfare(t) {
    timpani(t, 73.4, 0.4);
    brass(t, { f: 293.66, d: 0.16 });
    brass(t + 0.18, { f: 440, d: 0.16 });
    brass(t + 0.36, { f: 587.33, d: 0.24, g: 0.11 });
    timpani(t + 0.62, 73.4, 0.45);
    [146.83, 220, 293.66, 440].forEach((f) =>
      brass(t + 0.62, { f, d: 1.5, g: 0.06 })
    );
    brass(t + 0.62, { f: 659.25, d: 1.3, g: 0.035 });
    timpani(t + 1.9, 98, 0.2);
  },
  distantBell(t) {
    bell(t, { f: 392, g: 0.12, d: 3, wet: 0.85 });
  },
  pageTurn(t) {
    noise(t, {
      f: 1800,
      f2: 3400,
      q: 1.2,
      a: 0.02,
      d: 0.15,
      g: 0.12,
      wet: 0.15,
    });
    grains(t + 0.04, {
      n: 3,
      span: 0.1,
      lo: 2500,
      hi: 4500,
      gLo: 0.02,
      gHi: 0.05,
      wet: 0.15,
    });
  },
  paperSlide(t) {
    noise(t, {
      f: 1200,
      f2: 1900,
      q: 0.9,
      a: 0.05,
      d: 0.18,
      g: 0.08,
      wet: 0.15,
    });
  },
  quillDip(t) {
    const o = out(0.25);
    const os = ctx!.createOscillator();
    os.type = 'triangle';
    os.frequency.setValueAtTime(300, t);
    os.frequency.exponentialRampToValueAtTime(900, t + 0.05);
    const e = ctx!.createGain();
    envAD(e, t, 0.002, 0.06, 0.1);
    os.connect(e);
    e.connect(o);
    os.start(t);
    os.stop(t + 0.1);
    noise(t + 0.12, { f: 2500, q: 8, d: 0.03, g: 0.05 });
    noise(t + 0.2, { f: 2900, q: 8, d: 0.025, g: 0.035 });
  },
  knock(t) {
    thud(t, {
      f1: 180,
      f2: 110,
      d: 0.08,
      g: 0.3,
      body: 260,
      bodyQ: 9,
      bodyG: 0.35,
      wet: 0.2,
    });
    thud(t + 0.11, {
      f1: 170,
      f2: 105,
      d: 0.07,
      g: 0.18,
      body: 250,
      bodyQ: 9,
      bodyG: 0.22,
      wet: 0.2,
    });
  },
  crumple(t) {
    grains(t, {
      n: 22,
      span: 0.35,
      lo: 800,
      hi: 5000,
      q: 2,
      dLo: 0.01,
      dHi: 0.03,
      gLo: 0.03,
      gHi: 0.08,
      wet: 0.15,
    });
  },
  bookOpen(t) {
    thud(t, {
      f1: 110,
      f2: 60,
      d: 0.2,
      g: 0.25,
      body: 300,
      bodyG: 0.2,
      wet: 0.35,
    });
    noise(t + 0.02, {
      f: 900,
      f2: 2200,
      q: 0.9,
      a: 0.06,
      d: 0.25,
      g: 0.06,
      wet: 0.3,
    });
    grains(t + 0.1, {
      n: 6,
      span: 0.25,
      lo: 2000,
      hi: 4000,
      gLo: 0.02,
      gHi: 0.05,
    });
  },
  bookClose(t) {
    noise(t, { f: 2200, f2: 900, q: 0.9, a: 0.04, d: 0.16, g: 0.06, wet: 0.3 });
    thud(t + 0.18, {
      f1: 130,
      f2: 55,
      d: 0.18,
      g: 0.3,
      body: 260,
      bodyG: 0.25,
      wet: 0.35,
    });
  },
  // Seleção na subida: um toque só, seco, médio-grave, curto.
  pick(t) {
    thud(t, {
      f1: 520,
      f2: 380,
      d: 0.04,
      g: 0.06,
      body: 900,
      bodyQ: 6,
      bodyG: 0.05,
      click: 0.03,
      wet: 0.04,
    });
    noise(t + 0.004, { f: 1800, q: 1.5, d: 0.02, g: 0.02, wet: 0.04 });
  },
  unpick(t) {
    thud(t, {
      f1: 420,
      f2: 320,
      d: 0.035,
      g: 0.04,
      body: 750,
      bodyQ: 6,
      bodyG: 0.035,
      click: 0.02,
      wet: 0.03,
    });
  },
  quill(t) {
    let x = t;
    for (let i = 0; i < 5; i++) {
      noise(x, {
        f: rnd(3000, 6000),
        q: 3,
        d: rnd(0.015, 0.035),
        g: 0.05,
        wet: 0.1,
      });
      x += rnd(0.03, 0.05);
    }
  },
  arcaneUp(t) {
    [1568, 2093, 2637, 3136, 4186].forEach((f, i) =>
      bell(t + i * 0.03, {
        f,
        g: 0.03,
        d: 0.25,
        ratios: [1, 2.74],
        amps: [1, 0.4],
        wet: 0.5,
      })
    );
    noise(t, { f: 800, f2: 6000, q: 2, a: 0.05, d: 0.25, g: 0.03, wet: 0.5 });
  },
  arcaneDown(t) {
    [4186, 3136, 2637, 2093, 1568].forEach((f, i) =>
      bell(t + i * 0.03, {
        f: f * 0.75,
        g: 0.03,
        d: 0.25,
        ratios: [1, 2.74],
        amps: [1, 0.4],
        wet: 0.5,
      })
    );
    noise(t, { f: 6000, f2: 800, q: 2, a: 0.03, d: 0.25, g: 0.03, wet: 0.5 });
  },
  spark(t) {
    noise(t, { type: 'highpass', f: 5000, d: 0.02, g: 0.08 });
    grains(t + 0.01, {
      n: 2,
      span: 0.05,
      lo: 5000,
      hi: 8000,
      q: 4,
      gLo: 0.03,
      gHi: 0.05,
    });
    bell(t, {
      f: 4200,
      g: 0.03,
      d: 0.06,
      ratios: [1, 1.71],
      amps: [1, 0.5],
      wet: 0.2,
    });
  },
  smallBell(t) {
    bell(t, { f: 1318.5, g: 0.1, d: 1.2, wet: 0.45 });
  },
  luteNote(t) {
    pluck(t, { f: 392, g: 0.12 });
  },
  luteLow(t) {
    pluck(t, { f: 146.83, g: 0.14, damp: 0.994, bright: 0.4 });
  },
  metal(t) {
    [1900, 2600, 3400].forEach((f, i) =>
      bell(t + [0, 0.015, 0.04][i], {
        f,
        g: 0.06,
        d: rnd(0.15, 0.35),
        wet: 0.3,
      })
    );
    noise(t, { type: 'highpass', f: 4000, d: 0.01, g: 0.05 });
  },
  cloth(t) {
    noise(t, {
      type: 'lowpass',
      f: 300,
      f2: 900,
      a: 0.06,
      d: 0.2,
      g: 0.1,
      wet: 0.1,
    });
    noise(t + 0.18, {
      type: 'lowpass',
      f: 800,
      f2: 350,
      a: 0.03,
      d: 0.12,
      g: 0.06,
      wet: 0.1,
    });
  },
  wind(t) {
    noise(t, { f: 500, f2: 1300, q: 2.5, a: 0.18, d: 0.35, g: 0.07, wet: 0.5 });
  },
  heartbeat(t) {
    thud(t, {
      f1: 70,
      f2: 45,
      d: 0.14,
      g: 0.3,
      body: 140,
      bodyG: 0.1,
      click: 0.03,
      wet: 0.15,
    });
    thud(t + 0.22, {
      f1: 65,
      f2: 42,
      d: 0.12,
      g: 0.2,
      body: 130,
      bodyG: 0.07,
      click: 0.02,
      wet: 0.15,
    });
  },
  candle(t) {
    noise(t, { type: 'highpass', f: 3000, d: 0.015, g: 0.06 });
    noise(t + 0.01, {
      type: 'lowpass',
      f: 700,
      a: 0.04,
      d: 0.18,
      g: 0.05,
      wet: 0.2,
    });
  },
  latch(t) {
    thud(t, {
      f1: 2000,
      f2: 1500,
      d: 0.015,
      g: 0.08,
      body: 2500,
      bodyG: 0.06,
      click: 0.05,
      wet: 0.1,
    });
    bell(t + 0.035, {
      f: 3500,
      g: 0.03,
      d: 0.05,
      ratios: [1, 1.71],
      amps: [1, 0.5],
      wet: 0.1,
    });
  },
};

function run(id: SoundId, delay = 0, force = false, extra?: number): boolean {
  if (typeof window === 'undefined') return false;
  const group = GROUP_OF[id] ?? 'evt';
  if (!force) {
    // Nada toca antes de um gesto dentro da ficha, nem com o grupo desligado.
    if (!armed || !readSettings()[group]) return false;
  }
  if (!ctx && !init()) return false;
  const c = ctx!;
  if (c.state === 'suspended') void c.resume();
  cur = bus[group];
  R[id](c.currentTime + 0.03 + delay, extra);
  return true;
}

export const sheetSounds = {
  /** `true` se o som tocou (gesto liberado e grupo ligado). */
  play(id: SoundId, delay = 0): boolean {
    return run(id, delay);
  },
  /** O dado rolando na madeira por `dur` segundos, e o sino do resultado. */
  die(dur: number) {
    run('die', 0, false, dur);
    run('dieBell', dur + 0.25);
  },
  /** A cerimônia: cordas, clarão e os dois tiques do número rolando. */
  rite() {
    run('swell', 0, false, 0.45);
    run('flash', 0.45);
    run('tick', 1.1);
    run('tick', 1.95);
  },
  /** Toca mesmo com o grupo desligado (o painel de teste do desenho). */
  test(id: SoundId) {
    if (id === 'die') run('die', 0, true, 1.5);
    else if (id === 'swell') run('swell', 0, true, 0.45);
    else run(id, 0, true);
  },
};
