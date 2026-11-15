/**
 * Auditoria da ficha contra o banco REAL, só em fichas temporárias
 * (`description: 'zz-audit-test'`). Roda com
 * `ALLOW_DB_TESTS=1 npm run test:audit:db`; sem a variável, recusa. As fichas e
 * os registros de auditoria delas são apagados antes e depois.
 */
import 'dotenv/config';
import assert from 'node:assert/strict';
import { connectDB } from '../lib/db';

if (process.env.ALLOW_DB_TESTS !== '1') {
  console.error('Recusado: este teste grava no banco. Use ALLOW_DB_TESTS=1.');
  process.exit(1);
}

let passed = 0;
const test = async (name: string, fn: () => unknown | Promise<unknown>) => {
  try {
    await fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (error) {
    console.error(`FAIL  ${name}\n`, error);
    process.exitCode = 1;
  }
};

const MARK = 'zz-audit-test';
const staff = {
  username: 'staff-teste',
  forumUserId: 1,
  role: 'admin',
  isStaff: true,
  isOwner: false,
};
const owner = {
  username: 'dona-teste',
  forumUserId: 987654323,
  role: 'viewer',
  isStaff: false,
  isOwner: true,
};

async function main() {
  await connectDB();
  const { default: Player } = await import('../db/players/players');
  const { default: Audit } = await import('../db/sheetAudit/sheetAudits');
  const svc = await import('../services/sheetAudit');
  const ps = await import('../services/player.service');
  const edit = await import('../services/sheetEdit');
  const creation = await import('../services/creation.service');

  const ids = new Set<string>();
  const cleanup = async () => {
    const found = await Player.find({ description: MARK }).select('_id').lean();
    for (const p of found) ids.add(String(p._id));
    await Audit.deleteMany({ playerId: { $in: [...ids] } });
    await Player.deleteMany({ description: MARK });
  };
  for (const sig of ['SIGINT', 'SIGTERM'] as const) {
    process.on(sig, () => void cleanup().finally(() => process.exit(130)));
  }
  await cleanup();

  const entriesOf = async (id: string) =>
    (await Audit.find({ playerId: id }).sort({ at: 1 }).lean()) as unknown as {
      via: string;
      actor: { username: string };
      changes: {
        path: string;
        label: string;
        before?: unknown;
        after?: unknown;
      }[];
      snapshot?: Record<string, unknown>;
      reason?: string;
      at: Date;
      lastAt: Date;
    }[];
  const make = async (extra: Record<string, unknown> = {}) => {
    const p = await Player.create({
      slug: `zz-audit-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      name: 'Teste Auditoria',
      race: 'Humano',
      gender: 'x',
      class: 'Teste',
      description: MARK,
      ownerForumUserId: 987654323,
      ownerUsername: 'dona-teste',
      level: 1,
      ...extra,
    } as never);
    const id = String((p as unknown as { _id: unknown })._id);
    ids.add(id);
    return { id, slug: (p as unknown as { slug: string }).slug };
  };

  try {
    await test('app-create, app-edit and app-delete: entry with the diff; delete keeps a snapshot', async () => {
      const slug = `zz-audit-c-${Date.now()}`;
      const made = await ps.createPlayer(
        {
          slug,
          name: 'Criada',
          race: 'Elfo',
          gender: 'x',
          class: 'Teste',
          description: MARK,
        } as never,
        staff
      );
      const id = String((made.data as unknown as { _id: unknown })._id);
      ids.add(id);
      let list = await entriesOf(id);
      assert.equal(list.length, 1);
      assert.equal(list[0].via, 'app-create');
      assert.equal(list[0].actor.username, 'staff-teste');
      assert.ok(
        list[0].changes.some((c) => c.path === 'name' && c.after === 'Criada')
      );

      await ps.updatePlayer(
        slug,
        {
          subtitle: 'Nova frase',
          equipment: { gil: 25, backpack: 'Corda' },
        } as never,
        staff
      );
      list = await entriesOf(id);
      const edited = list.find((e) => e.via === 'app-edit')!;
      const paths = edited.changes.map((c) => c.path);
      assert.ok(paths.includes('subtitle'));
      assert.ok(paths.includes('equipment.gil'));
      assert.equal(
        edited.changes.find((c) => c.path === 'subtitle')!.before ?? null,
        null
      );
      assert.equal(
        edited.changes.find((c) => c.path === 'equipment.gil')!.after,
        25
      );

      await ps.deletePlayer(slug, staff);
      assert.equal(await Player.countDocuments({ _id: id }), 0);
      list = await entriesOf(id);
      const del = list.find((e) => e.via === 'app-delete')!;
      assert.equal(del.snapshot!.name, 'Criada');
      assert.equal(del.snapshot!.subtitle, 'Nova frase');
      // A API não entrega o snapshot.
      const view = await svc.listAudit(id, { isOwner: false, isStaff: false });
      assert.ok(view.entries.some((e) => e.deleted));
      assert.ok(view.entries.every((e) => !('snapshot' in e)));
    });

    await test('embed-edit: entry with who/via and the changed fields only (derived data is not logged)', async () => {
      const { id } = await make({ equipment: { gil: 1 } });
      const updated = await edit.staffEditSheet(
        id,
        { fields: { backstory: 'Uma história.', equipment: { gil: 77 } } },
        staff
      );
      assert.ok(updated);
      const list = await entriesOf(id);
      assert.equal(list.length, 1);
      assert.equal(list[0].via, 'embed-edit');
      assert.deepEqual(list[0].changes.map((c) => c.path).sort(), [
        'backstory',
        'equipment.gil',
      ]);
      assert.ok(
        list[0].changes.every(
          (c) => !/^(abilities|lineage|talentSlots|updatedAt|__v)/.test(c.path)
        )
      );
      // Sem mudança, sem registro.
      await edit.staffEditSheet(
        id,
        { fields: { backstory: 'Uma história.' } },
        staff
      );
      assert.equal((await entriesOf(id)).length, 1);
      // Escrita recusada não deixa registro.
      await assert.rejects(() =>
        edit.staffEditSheet(id, { fields: {} }, staff)
      );
      await Player.updateOne({ _id: id }, { $set: { status: 'draft' } });
      await assert.rejects(() =>
        edit.staffEditSheet(id, { fields: { backstory: 'x' } }, staff)
      );
      assert.equal((await entriesOf(id)).length, 1);
    });

    await test('draft saves are grouped within 10 minutes by the same author, kept apart after, and by other authors', async () => {
      const { id } = await make();
      const raw = async () => svc.rawSheet(id);
      const t0 = new Date('2026-01-01T10:00:00Z');
      const at = (min: number) => new Date(t0.getTime() + min * 60_000);
      const save = async (
        who: typeof owner,
        patch: Record<string, unknown>,
        when: Date
      ) => {
        const before = await raw();
        await Player.updateOne({ _id: id }, { $set: patch });
        await svc.recordAudit(id, before, await raw(), who, 'creation-draft', {
          group: true,
          now: when,
        });
      };
      await save(owner, { name: 'A1' }, at(0));
      await save(owner, { name: 'A2', age: '20' }, at(4));
      await save(owner, { name: 'A3' }, at(9)); // 5 min depois do último: dentro
      let list = await entriesOf(id);
      assert.equal(list.length, 1, 'uma entrada só');
      const name = list[0].changes.find((c) => c.path === 'name')!;
      assert.equal(name.before, 'Teste Auditoria', 'o primeiro antes');
      assert.equal(name.after, 'A3', 'o último depois');
      assert.ok(list[0].changes.some((c) => c.path === 'age'));
      assert.equal(list[0].lastAt.toISOString(), at(9).toISOString());
      assert.equal(list[0].at.toISOString(), at(0).toISOString());
      // Voltar ao valor de antes tira o campo da entrada.
      await save(owner, { age: '' }, at(10));
      list = await entriesOf(id);
      assert.ok(
        !list[0].changes.some((c) => c.path === 'age') ||
          list[0].changes.find((c) => c.path === 'age')!.after === ''
      );
      // Mais de 10 minutos depois do último: entrada nova.
      await save(owner, { name: 'B1' }, at(25));
      list = await entriesOf(id);
      assert.equal(list.length, 2);
      assert.equal(
        list[1].changes.find((c) => c.path === 'name')!.before,
        'A3'
      );
      // Outro autor não funde na entrada do primeiro.
      await save(staff, { name: 'S1' }, at(26));
      assert.equal((await entriesOf(id)).length, 3);
    });

    await test('visitor sees nothing of the draft phase until submission, then everything; owner and staff always', async () => {
      const made = await creation
        .createBlankSheet(owner.forumUserId, staff)
        .catch(() => null);
      // A conta de teste não existe em `users`: usa uma ficha em rascunho feita à mão.
      void made;
      const { id } = await make({ status: 'draft' });
      await svc.recordAudit(
        id,
        { name: 'a' },
        { name: 'b' },
        owner,
        'creation-draft',
        { group: true }
      );
      const visitor = { isOwner: false, isStaff: false };
      assert.equal((await svc.listAudit(id, visitor)).entries.length, 0);
      assert.equal(
        (await svc.listAudit(id, { isOwner: true, isStaff: false })).entries
          .length,
        1
      );
      assert.equal(
        (await svc.listAudit(id, { isOwner: false, isStaff: true })).entries
          .length,
        1
      );
      await Player.updateOne({ _id: id }, { $set: { status: 'submitted' } });
      assert.equal(
        (await svc.listAudit(id, visitor)).entries.length,
        1,
        'depois do envio todos leem'
      );
      await Player.updateOne({ _id: id }, { $set: { status: 'blank' } });
      assert.equal((await svc.listAudit(id, visitor)).entries.length, 0);
    });

    await test('return notes never appear: only "Observações enviadas"; creation is never logged', async () => {
      const { id } = await make({
        status: 'submitted',
        creation: { base: { str: 15 } },
      });
      const result = await creation.returnSheet(
        id,
        { notes: 'Texto PRIVADO da staff', steps: ['historia'] },
        staff
      );
      assert.equal(result.status, 'returned');
      const list = await entriesOf(id);
      const ret = list.find((e) => e.via === 'return')!;
      assert.ok(
        ret.changes.some(
          (c) => c.path === 'review' && c.label === 'Observações enviadas'
        )
      );
      assert.ok(
        ret.changes.some((c) => c.path === 'status' && c.after === 'returned')
      );
      const view = await svc.listAudit(id, { isOwner: false, isStaff: false });
      assert.ok(
        !JSON.stringify(list).includes('PRIVADA') &&
          !JSON.stringify(list).includes('PRIVADO')
      );
      assert.ok(!JSON.stringify(view).includes('PRIVADO'));
      assert.ok(!JSON.stringify(view).includes('"creation'));
      // Mudança só em `creation`/`review` cru não gera campos públicos.
      const before = await svc.rawSheet(id);
      await Player.updateOne(
        { _id: id },
        { $set: { 'creation.base': { str: 8 } } }
      );
      const n = (await entriesOf(id)).length;
      await svc.recordAudit(
        id,
        before,
        await svc.rawSheet(id),
        staff,
        'creation-draft'
      );
      assert.equal(
        (await entriesOf(id)).length,
        n,
        'sem campo comparado, sem registro'
      );
    });

    await test('deleted draft: visitor sees nothing, staff and owner see the fact only (no values)', async () => {
      const { id, slug } = await make({
        status: 'draft',
        name: 'Rascunho Secreto',
      });
      await svc.recordAudit(
        id,
        { name: 'a' },
        {
          name: 'Rascunho Secreto',
          status: 'draft',
          ownerForumUserId: 987654323,
        },
        owner,
        'creation-draft'
      );
      await ps.deletePlayer(slug, staff);
      const visitor = { isOwner: false, isStaff: false };
      const v = await svc.listAudit(id, visitor);
      assert.equal(v.entries.length, 0);
      assert.ok(!JSON.stringify(v).includes('Secreto'));
      const s = await svc.listAudit(id, { isOwner: false, isStaff: true });
      const del = s.entries.find((e) => e.deleted)!;
      assert.ok(del);
      assert.equal(del.changes.length, 0);
      assert.ok(!JSON.stringify(del).includes('Secreto'));
      assert.ok(s.entries.every((e) => !('snapshot' in e)));
      const o = await svc.listAudit(id, {
        isOwner: false,
        isStaff: false,
        forumUserId: 987654323,
      });
      assert.ok(o.entries.some((e) => e.deleted));
    });

    await test('deleted approved sheet: visitor sees the fact, never the snapshot', async () => {
      const slug = `zz-audit-a-${Date.now()}`;
      const made = await ps.createPlayer(
        {
          slug,
          name: 'Aprovada',
          race: 'Elfo',
          gender: 'x',
          class: 'Teste',
          description: MARK,
          status: 'approved',
        } as never,
        staff
      );
      const id = String((made.data as unknown as { _id: unknown })._id);
      ids.add(id);
      await ps.deletePlayer(slug, staff);
      const v = await svc.listAudit(id, { isOwner: false, isStaff: false });
      const del = v.entries.find((e) => e.deleted)!;
      assert.ok(del, 'o fato aparece');
      assert.ok(!('snapshot' in del));
      assert.ok(del.changes.length > 0);
    });

    await test('ownerForumUserId never shows; non-public fields hidden from visitors, kept for staff', async () => {
      const { id } = await make({ status: 'approved' });
      await svc.recordAudit(
        id,
        { name: 'a' },
        { name: 'b' },
        staff,
        'embed-edit'
      );
      // Entrada gravada à mão com campos não públicos (e um antigo).
      await Audit.create({
        playerId: id,
        actor: { username: 'staff-teste' },
        via: 'app-edit',
        draftPhase: false,
        changes: [
          { path: 'name', label: 'Nome', before: 'a', after: 'b' },
          { path: 'forumInternal', label: 'x', before: 1, after: 2 },
          { path: 'ownerForumUserId', label: 'Dono', before: 1, after: 2 },
        ],
      });
      const paths = (v: Awaited<ReturnType<typeof svc.listAudit>>) =>
        v.entries.flatMap((e) => e.changes.map((c) => c.path));
      const visitor = await svc.listAudit(id, {
        isOwner: false,
        isStaff: false,
      });
      assert.ok(!paths(visitor).includes('forumInternal'));
      assert.ok(!paths(visitor).includes('ownerForumUserId'));
      assert.ok(paths(visitor).includes('name'));
      const st = await svc.listAudit(id, { isOwner: false, isStaff: true });
      assert.ok(paths(st).includes('forumInternal'));
      assert.ok(!paths(st).includes('ownerForumUserId'));
    });

    await test('a merge that returns to the original deletes the entry', async () => {
      const { id } = await make();
      const t0 = new Date('2026-03-01T10:00:00Z');
      const save = async (name: string, min: number) => {
        const before = await svc.rawSheet(id);
        await Player.updateOne({ _id: id }, { $set: { name } });
        await svc.recordAudit(
          id,
          before,
          () => svc.rawSheet(id),
          owner,
          'creation-draft',
          { group: true, now: new Date(t0.getTime() + min * 60_000) }
        );
      };
      await save('Outro', 0);
      assert.equal((await entriesOf(id)).length, 1);
      await save('Teste Auditoria', 2);
      assert.equal((await entriesOf(id)).length, 0);
    });

    await test('pagination: 50 per page, newest first, cursor to the next', async () => {
      const { id } = await make();
      const t0 = Date.parse('2026-02-01T00:00:00Z');
      for (let i = 0; i < 60; i += 1) {
        await svc.recordAudit(
          id,
          { name: `n${i}` },
          { name: `n${i + 1}` },
          staff,
          'embed-edit',
          {
            now: new Date(t0 + i * 60_000),
          }
        );
      }
      const first = await svc.listAudit(id, { isOwner: false, isStaff: true });
      assert.equal(first.entries.length, 50);
      assert.equal(first.hasMore, true);
      assert.equal(
        first.entries[0].changes[0].after,
        'n60',
        'a mais nova primeiro'
      );
      const second = await svc.listAudit(
        id,
        { isOwner: false, isStaff: true },
        first.next
      );
      assert.equal(second.entries.length, 10);
      assert.equal(second.hasMore, false);
      assert.equal(second.entries.at(-1)!.changes[0].after, 'n1');
      const ids1 = new Set(first.entries.map((e) => e.id));
      assert.ok(second.entries.every((e) => !ids1.has(e.id)));
    });
  } finally {
    await cleanup();
  }
  console.log(`\n${passed} ok`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
