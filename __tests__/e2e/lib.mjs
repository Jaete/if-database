// Harness do smoke de criação de ficha. Precisa de `playwright-core` e de um
// Chromium instalado (PLAYWRIGHT_CHROMIUM, ou o do cache do Playwright), e do
// dev server em https://localhost:3000 (`npm run dev:https`). O iframe do embed
// é montado numa página falsa servida na origem do fórum (FORUM_ORIGIN), com o
// handshake `host:hello` simulado e os cookies assinados pelo setup.ts.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
// O JSON do setup.ts: CREATION_CTX=/tmp/ctx.json node __tests__/e2e/creation.smoke.mjs
export const ctx = JSON.parse(fs.readFileSync(process.env.CREATION_CTX));
const SHOTS = process.env.SHOTS ?? '/tmp/creation-shots';
fs.mkdirSync(SHOTS, { recursive: true });
const EXE = process.env.PLAYWRIGHT_CHROMIUM;
const FORUM =
  process.env.FORUM_ORIGIN ?? 'https://isekaifantasy.forumbrasil.net';
export async function open({
  who = 'owner',
  id,
  width = 936,
  height = 760,
  scheme = 'dark',
  reduced = 'no-preference',
}) {
  const browser = await chromium.launch({
    ...(EXE ? { executablePath: EXE } : {}),
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessForNavigations,BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights',
    ],
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: Math.max(width + 20, 420), height: height + 20 },
    colorScheme: scheme,
    reducedMotion: reduced,
  });
  const u = ctx[who];
  await context.addCookies([
    {
      name: 'embed_session',
      value: u.token,
      domain: 'localhost',
      path: '/',
      secure: true,
      sameSite: 'None',
    },
  ]);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
  });
  await page.route(`${FORUM}/**`, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><body style="margin:0;background:${scheme === 'dark' ? '#111' : '#eee'}"><iframe id="f" src="https://localhost:3000/embed/jogador/${id}" style="width:${width}px;height:${height}px;border:0;display:block"></iframe><script>
window.addEventListener('message',e=>{if(e.origin!=='https://localhost:3000')return;const d=e.data;if(!d||d.source!=='ifdb-embed')return;if(d.type==='embed:ready')e.source.postMessage({source:'ifdb-embed',type:'host:hello',user:{forumUserId:${u.id},username:${JSON.stringify(u.name)}}},e.origin);});</script></body>`,
    })
  );
  await page.goto(`${FORUM}/parent`);
  const f = page.frameLocator('#f');
  return {
    browser,
    context,
    page,
    f,
    errors,
    shot: (name) => page.screenshot({ path: `${SHOTS}/${name}.png` }),
  };
}
export async function start(s) {
  const f = s.f;
  const btn = f.getByRole('button', {
    name: /(Começar|Continuar) minha ficha/,
  });
  await btn.waitFor();
  const label = await btn.innerText();
  await btn.click();
  if (/Começar/.test(label))
    await f.getByRole('button', { name: 'Abrir o primeiro passo' }).click();
  await s.page.waitForTimeout(500);
}
const TITLES = [
  'Identidade',
  'Raça',
  'Classe',
  'Atributos',
  'Nível 1',
  'Perícias',
  'Magias',
  'Equipamento',
  'História',
  'Revisão',
];
export const stepBtn = (s, n) =>
  s.f.locator('ol button', { hasText: new RegExp(TITLES[n - 1], 'i') }).first();
export async function codexPick(s, open, card, use) {
  const f = s.f;
  await f.getByRole('button', { name: open }).click();
  await s.page.waitForTimeout(1200);
  await f.getByText(card, { exact: true }).first().click();
  await s.page.waitForTimeout(900);
  await f.getByRole('button', { name: use }).click();
  await s.page.waitForTimeout(300);
  await f.getByRole('button', { name: 'Aplicar à ficha' }).click();
  await s.page.waitForTimeout(1500);
}
export async function pickClass(s, name) {
  const f = s.f;
  await f
    .getByRole('button', { name: /Abrir o códice de classes|Trocar no códice/ })
    .click();
  await s.page.waitForTimeout(1200);
  await f.getByPlaceholder('Buscar classe pelo nome...').fill(name);
  await s.page.waitForTimeout(700);
  await f.getByRole('button', { name: `Escolher ${name}` }).click();
  await s.page.waitForTimeout(700);
  await f.getByRole('button', { name: 'Aplicar à ficha' }).click();
  await s.page.waitForTimeout(1800);
}
export async function pickSpells(s, cantrips, firsts) {
  const f = s.f;
  await f.getByRole('button', { name: 'Abrir o grimório' }).click();
  await s.page.waitForTimeout(2200);
  for (let i = 0; i < cantrips; i += 1) {
    await f
      .getByRole('button', { name: 'Preparar', exact: true })
      .first()
      .click();
    await s.page.waitForTimeout(250);
  }
  await f.locator('button', { hasText: /^1$/ }).first().click();
  await s.page.waitForTimeout(600);
  for (let i = 0; i < firsts; i += 1) {
    await f
      .getByRole('button', { name: 'Preparar', exact: true })
      .first()
      .click();
    await s.page.waitForTimeout(250);
  }
  await s.shot('16-spells-picked');
  await f.getByRole('button', { name: 'Aplicar à ficha' }).click();
  await s.page.waitForTimeout(1800);
}
