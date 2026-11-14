/**
 * Smoke da criação de ficha, no navegador de verdade:
 *   - o app: a staff cria a ficha vazia e recebe a etiqueta;
 *   - a dona percorre o assistente com os três métodos de atributo (compra de
 *     pontos até o envio, arranjo padrão com pedras e ordem da lista, rolagem
 *     4d6 em 400 px claro), envia;
 *   - a staff devolve com observações, a dona reenvia, a staff aprova;
 *   - o visitante não vê nada da ficha em rascunho.
 * Em 936 escuro e 400 claro. As capturas vão para $SHOTS.
 *
 *   ALLOW_DB_TESTS=1 npx tsx __tests__/e2e/setup.ts /tmp/ctx.json
 *   CREATION_CTX=/tmp/ctx.json node __tests__/e2e/creation.smoke.mjs
 *   ALLOW_DB_TESTS=1 npx tsx __tests__/e2e/teardown.ts
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import {
  open,
  ctx,
  start,
  stepBtn,
  codexPick,
  pickClass,
  pickSpells,
} from './lib.mjs';

const log = (m) => console.log(`  ok  ${m}`);
const text = async (f) =>
  (await f.locator('body').innerText()).replace(/\n/g, ' | ');
const noErrors = (s, what) =>
  assert.deepEqual(
    s.errors.filter((e) => !/ERR_NETWORK_CHANGED/.test(e)),
    [],
    `${what}: erros no console`
  );

// ── Ficha 1: compra de pontos, do começo ao envio, 936 escuro ──
{
  const s = await open({
    who: 'owner',
    id: ctx.ids[0],
    width: 936,
    height: 760,
    scheme: 'dark',
  });
  const f = s.f;
  await f.getByRole('button', { name: 'Começar minha ficha' }).waitFor();
  await s.shot('1-blank-owner');
  await start(s);
  await f.getByLabel('Nome do personagem *').fill('Zz Smoke');
  await s.page.waitForTimeout(900);
  await stepBtn(s, 2).click();
  await codexPick(s, 'Abrir o códice de raças', 'Centauros', /Usar Centauros/);
  await stepBtn(s, 3).click();
  await pickClass(s, 'Mago Branco');
  await stepBtn(s, 4).click();
  await f.getByRole('radio', { name: /Compra de pontos/ }).click();
  await s.page.waitForTimeout(700);
  for (const [n, c] of Object.entries({
    Destreza: 4,
    Constituição: 6,
    Inteligência: 2,
    Sabedoria: 7,
    Carisma: 5,
  })) {
    for (let i = 0; i < c; i += 1)
      await f.getByRole('button', { name: `Aumentar ${n}` }).click();
  }
  await s.page.waitForTimeout(1200);
  assert.match(
    await f.locator('[role=status]').first().innerText(),
    /27 de 27/
  );
  log('compra de pontos: 27 de 27');
  await stepBtn(s, 6).click();
  await f.getByRole('button', { name: 'Medicina' }).click();
  await f.getByRole('button', { name: 'Intuição' }).click();
  await stepBtn(s, 7).click();
  await pickSpells(s, 2, 2);
  await stepBtn(s, 8).click();
  await f.getByRole('button', { name: /^Rolar 1d100/ }).click();
  await f.getByLabel('Entendi que o resultado é definitivo').check();
  await f.getByRole('button', { name: 'Rolar', exact: true }).click();
  await s.page.waitForTimeout(1800);
  await stepBtn(s, 10).click();
  await s.page.waitForTimeout(800);
  await s.shot('2-review');
  await f.getByRole('button', { name: 'Enviar para aprovação' }).click();
  await f.getByRole('button', { name: 'Enviar', exact: true }).click();
  await s.page.waitForTimeout(4500);
  assert.match(await text(f), /RASCUNHO · AGUARDANDO APROVAÇÃO/i);
  log('envio: a ficha aparece sob a faixa de rascunho');
  noErrors(s, 'compra de pontos');
  await s.browser.close();
}

// ── Staff: devolve; dona reenvia; staff aprova ──
{
  let s = await open({ who: 'admin', id: ctx.ids[0], height: 800 });
  await s.f.getByRole('button', { name: 'Revisar' }).click();
  await s.f.getByRole('button', { name: 'Devolver com observações' }).click();
  await s.f.getByLabel(/Observações para a dona/).fill('Falta o retrato.');
  await s.f.getByRole('button', { name: 'Devolver', exact: true }).click();
  await s.page.waitForTimeout(4500);
  assert.match(await text(s.f), /DEVOLVIDA COM OBSERVAÇÕES/i);
  log('devolução com observações');
  await s.browser.close();

  s = await open({ who: 'owner', id: ctx.ids[0] });
  await s.f.getByRole('button', { name: 'Corrigir agora' }).click();
  await s.f.getByRole('button', { name: 'Enviar para aprovação' }).click();
  await s.f.getByRole('button', { name: 'Enviar', exact: true }).click();
  await s.page.waitForTimeout(4500);
  assert.match(await text(s.f), /AGUARDANDO APROVAÇÃO/i);
  await s.browser.close();

  s = await open({ who: 'admin', id: ctx.ids[0], height: 800 });
  await s.f.getByRole('button', { name: 'Revisar' }).click();
  await s.f.getByRole('button', { name: 'Aprovar ficha' }).click();
  await s.f.getByRole('button', { name: 'Aprovar', exact: true }).click();
  await s.page.waitForTimeout(4500);
  assert.doesNotMatch(await text(s.f), /RASCUNHO/i);
  await s.browser.close();

  s = await open({ who: 'owner', id: ctx.ids[0] });
  await s.page.waitForTimeout(3500);
  assert.equal(
    await s.f.getByRole('button', { name: 'Continuar editando' }).count(),
    0
  );
  assert.equal(
    await s.f.getByRole('button', { name: 'Corrigir agora' }).count(),
    0
  );
  log('aprovada: a dona não edita mais a criação');
  await s.browser.close();
}

// ── Ficha 2: arranjo padrão com pedras, ordem da lista e bônus de Humanos ──
{
  const s = await open({
    who: 'owner',
    id: ctx.ids[1],
    width: 936,
    height: 900,
    scheme: 'dark',
  });
  const f = s.f;
  await start(s);
  await f.getByLabel('Nome do personagem *').fill('Zz Arranjo');
  await s.page.waitForTimeout(900);
  await stepBtn(s, 2).click();
  await codexPick(s, 'Abrir o códice de raças', 'Humanos', /Usar Humanos/);
  await stepBtn(s, 3).click();
  await pickClass(s, 'Mago Branco');
  await stepBtn(s, 4).click();
  await f.getByRole('radio', { name: /Arranjo padrão/ }).click();
  await f.getByRole('button', { name: 'Sugerir pela classe' }).click();
  await s.page.waitForTimeout(700);
  const stones = f.getByRole('group', { name: 'Pedras disponíveis' });
  assert.match(await stones.innerText(), /Todas as pedras/);
  await f.getByRole('button', { name: /Sabedoria: 15/ }).click(); // devolve a pedra
  await s.page.waitForTimeout(400);
  assert.equal(await stones.getByRole('button').count(), 1);
  await f.getByRole('button', { name: 'Ordenar a lista' }).click();
  await f.getByRole('button', { name: 'Descer Força' }).click();
  await f.getByRole('radio', { name: 'FOR' }).first().click();
  await f.getByRole('radio', { name: 'DES' }).last().click();
  await s.page.waitForTimeout(1200);
  assert.match(
    await f.locator('aside table').innerText(),
    /FOR\s+14\s+\+1\s+15/
  );
  log(
    'arranjo padrão: pedras, ordem da lista e dois +1 em atributos diferentes'
  );
  noErrors(s, 'arranjo');
  await s.browser.close();
}

// ── Gil por classe: trocar de classe, rolar de novo, voltar e ver a 1ª rolagem ──
{
  const s = await open({
    who: 'owner',
    id: ctx.ids[1],
    width: 936,
    height: 900,
    scheme: 'dark',
  });
  const f = s.f;
  await start(s);
  const rollGilHere = async () => {
    await stepBtn(s, 8).click();
    await f.getByLabel('Equipamento e mochila').waitFor();
    await s.page.waitForTimeout(500);
    const btn = f.getByRole('button', { name: /^Rolar \d/ });
    if (await btn.count()) {
      await btn.click();
      await f.getByLabel('Entendi que o resultado é definitivo').check();
      await f.getByRole('button', { name: 'Rolar', exact: true }).click();
      await s.page.waitForTimeout(1800);
    }
    const audit = await f
      .locator('small', { hasText: /^rol-/ })
      .first()
      .innerText();
    return audit;
  };
  // A ficha já é Mago Branco (bloco anterior).
  const first = await rollGilHere();
  await stepBtn(s, 3).click();
  await pickClass(s, 'Dragoon');
  await stepBtn(s, 8).click();
  await s.page.waitForTimeout(600);
  assert.equal(
    await f.locator('small', { hasText: /^rol-/ }).count(),
    0,
    'outra classe: exige nova rolagem'
  );
  const second = await rollGilHere();
  assert.notEqual(second, first);
  await stepBtn(s, 3).click();
  await pickClass(s, 'Mago Branco');
  const back = await rollGilHere();
  assert.equal(
    back,
    first,
    'de volta à 1ª classe: a rolagem original, sem rolar de novo'
  );
  log('gil por classe: trocar rola de novo, voltar reaproveita a 1ª rolagem');
  noErrors(s, 'gil por classe');
  await s.browser.close();
}

// ── Ficha 3: rolagem 4d6, 400 claro, movimento reduzido ──
{
  const s = await open({
    who: 'owner',
    id: ctx.ids[2],
    width: 400,
    height: 820,
    scheme: 'light',
    reduced: 'reduce',
  });
  const f = s.f;
  await start(s);
  await f.getByLabel('Nome do personagem *').fill('Zz Rolada');
  await s.page.waitForTimeout(900);
  await stepBtn(s, 4).click();
  await f.getByRole('radio', { name: /Rolagem 4d6/ }).click();
  const roll = f.getByRole('button', { name: /Rolar 6/ });
  assert.equal(
    await roll.isDisabled(),
    true,
    'o botão só liga com o "Entendi"'
  );
  await f.getByLabel('Entendi que o resultado é definitivo').check();
  await roll.click();
  await f.getByRole('button', { name: 'Distribuir os valores' }).click();
  await s.shot('3-roll-mobile');
  const methods = await f.getByRole('radio').allInnerTexts();
  assert.match(methods[0], /Bloqueado/);
  assert.match(methods[1], /Bloqueado/);
  log('rolagem 4d6: trava os outros métodos (400 claro, movimento reduzido)');
  await s.page.reload();
  await start(s);
  await stepBtn(s, 4).click();
  assert.match((await f.getByRole('radio').allInnerTexts())[0], /Bloqueado/);
  log('recarregar não rola de novo');
  noErrors(s, 'rolagem');
  await s.browser.close();
}

// ── O app: a staff cria a ficha vazia ──
{
  const browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
      : {}),
    args: ['--ignore-certificate-errors', '--no-sandbox'],
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1100, height: 800 },
  });
  await context.addCookies([
    {
      name: 'session',
      value: ctx.appToken,
      domain: 'localhost',
      path: '/',
      secure: true,
      sameSite: 'Lax',
    },
  ]);
  const page = await context.newPage();
  await page.goto('https://localhost:3000/players');
  await page.getByRole('button', { name: 'Criar ficha vazia' }).first().click();
  await page.getByRole('radio', { name: new RegExp(ctx.owner.name) }).click();
  await page
    .locator('.overlay')
    .getByRole('button', { name: 'Criar ficha vazia' })
    .click();
  await page.locator('code').first().waitFor();
  const tag = await page.locator('code').first().innerText();
  assert.match(tag, /^\[ficha=[0-9a-f]{24}\]$/);
  console.log(
    `  ok  staff criou a ficha vazia: ${tag} (apague com teardown.ts <id>)`
  );
  await browser.close();
}

// ── Leitura pública: o rascunho e o estado de criação não vazam ──
{
  const browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
      : {}),
    args: ['--ignore-certificate-errors', '--no-sandbox'],
  });
  const page = await (
    await browser.newContext({ ignoreHTTPSErrors: true })
  ).newPage();
  await page.goto('https://localhost:3000/health').catch(() => {});
  const body = await page.evaluate(async () => {
    const res = await fetch('https://localhost:3000/api/players');
    return res.text();
  });
  assert.equal(
    body.includes('Zz Arranjo'),
    false,
    'nome de rascunho na lista pública'
  );
  assert.equal(body.includes('"creation"'), false);
  assert.equal(body.includes('"review"'), false);
  log('GET /api/players sem sessão: sem nome de rascunho, sem creation/review');
  await browser.close();
}

// ── Visitante: nada vaza ──
{
  const s = await open({
    who: 'owner',
    id: ctx.ids[1],
    width: 400,
    height: 700,
    scheme: 'light',
  });
  await s.context.clearCookies();
  await s.page.reload();
  await s.page.waitForTimeout(3500);
  const html = await s.f.locator('body').innerHTML();
  assert.match(await text(s.f), /Ficha em criação/);
  assert.equal(html.includes('Zz Arranjo'), false);
  log('visitante: "Ficha em criação", sem nome nem raça');
  await s.browser.close();
}
console.log('\nsmoke ok');
