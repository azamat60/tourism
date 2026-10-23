const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const test = require('node:test');
const ts = require('typescript');

function loadTypeScript(relative, overrides = {}) {
  const filename = path.resolve(__dirname, '..', relative);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = (name) => name in overrides ? overrides[name] : originalRequire(name);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  });
  loaded._compile(outputText, filename);
  return loaded.exports;
}

const validation = loadTypeScript('lib/admin/validation.ts');
const http = loadTypeScript('lib/http.ts');
const { deleteDepartures } = loadTypeScript('components/admin/departure-actions.ts');

function handler({ result = { data: { id: 'test-departure' }, error: null }, authError } = {}) {
  const filters = [];
  const query = {
    delete() { return this; },
    eq(...filter) { filters.push(filter); return this; },
    select(columns) { assert.equal(columns, 'id'); return this; },
    async maybeSingle() { return result; },
  };
  const route = loadTypeScript('app/api/admin/content/route.ts', {
    '@/lib/admin/auth': { requireStaff: async (roles) => {
      assert.deepEqual(roles, ['admin', 'editor']);
      if (authError) throw new Error(authError);
      return { supabase: { from(table) { assert.equal(table, 'tourism_content'); return query; } } };
    } },
    '@/lib/admin/validation': validation,
    '@/lib/http': http,
  });
  return { remove: route.DELETE, filters };
}

function request(body = { id: 'test-departure', version: 3 }, origin = 'https://tourism.example') {
  return new Request('https://tourism.example/api/admin/content/', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  });
}

test('delete targets only requested departure and saved version', async () => {
  const { remove, filters } = handler();
  const response = await remove(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: 'test-departure' });
  assert.deepEqual(filters, [['id', 'test-departure'], ['kind', 'departure'], ['version', 3]]);
});

test('delete rejects unauthenticated users, disallowed staff and foreign origins', async () => {
  for (const [authError, status] of [['UNAUTHORIZED', 401], ['FORBIDDEN', 403]]) {
    const { remove, filters } = handler({ authError });
    assert.equal((await remove(request())).status, status);
    assert.deepEqual(filters, []);
  }
  const { remove, filters } = handler();
  assert.equal((await remove(request(undefined, 'https://foreign.example'))).status, 403);
  assert.deepEqual(filters, []);
});

test('delete validates identity and version before accessing records', async () => {
  for (const body of [{}, { id: '', version: 1 }, { id: 'test', version: -1 }, { id: 'test', version: '1' }]) {
    const { remove, filters } = handler();
    assert.equal((await remove(request(body))).status, 400);
    assert.deepEqual(filters, []);
  }
  const { remove, filters } = handler();
  assert.equal((await remove(request({ id: 'test', version: 0 }))).status, 409);
  assert.deepEqual(filters, []);
});

test('missing, changed and protected records produce conflict', async () => {
  const { remove } = handler({ result: { data: null, error: null } });
  assert.equal((await remove(request())).status, 409);
});

test('linked bookings prevent deletion and explain unpublishing', async () => {
  const { remove } = handler({ result: { data: null, error: { code: '23503' } } });
  const response = await remove(request());
  assert.equal(response.status, 409);
  assert.match((await response.json()).error, /бронирования.*Опубликовано/);
});

test('editor offers delete only for saved departures', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { default: ContentEditor } = loadTypeScript('components/admin/ContentEditor.tsx', {
    './FieldEditor': { __esModule: true, default: () => null },
    './admin.constants': loadTypeScript('components/admin/admin.constants.ts'),
  });
  for (const [kind, version, canDelete] of [['departure', 1, true], ['departure', 0, false], ['tour', 1, false], ['page', 1, false], ['settings', 1, false]]) {
    const html = renderToStaticMarkup(React.createElement(ContentEditor, {
      entry: { id: 'test', slug: 'test', kind, version, data: {}, translations: {}, published: false },
      onClose() {}, onSaved() {}, onDeleted() {},
    }));
    assert.equal(html.includes('Удалить выезд'), canDelete, `${kind}, version ${version}`);
  }
});

function departures(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `departure-${index}`, version: index + 1, slug: `departure-${index}`,
    data: { tourName: `Tour ${index}`, startDate: '2026-11-01T00:00:00+06:00' },
  }));
}

test('bulk deletion sends each selected identity and version with bounded concurrency', async (context) => {
  const entries = departures(9);
  const requests = [];
  let active = 0;
  let maximum = 0;
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/admin/content/');
    assert.equal(options.method, 'DELETE');
    const body = JSON.parse(options.body);
    requests.push(body);
    active++;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, 2));
    active--;
    return Response.json({ id: body.id });
  });
  const result = await deleteDepartures(entries);
  assert.deepEqual(result.failed, []);
  assert.equal(result.deleted.length, entries.length);
  assert.equal(maximum, 4);
  assert.deepEqual(requests, entries.map(({ id, version }) => ({ id, version })));
});

test('bulk deletion keeps protected, stale and failed records while reporting successful deletions', async (context) => {
  const entries = departures(6);
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const { id } = JSON.parse(options.body);
    if (id === 'departure-1') return Response.json({ error: 'У выезда есть бронирования.' }, { status: 409 });
    if (id === 'departure-2') return Response.json({ error: 'CONFLICT' }, { status: 409 });
    if (id === 'departure-3') throw new Error('Connection lost');
    if (id === 'departure-4') return new Response('Service unavailable', { status: 503 });
    return Response.json({ id });
  });
  const { deleted, failed } = await deleteDepartures(entries);
  assert.deepEqual(deleted.sort(), ['departure-0', 'departure-5']);
  assert.deepEqual(failed.map((item) => item.id).sort(), ['departure-1', 'departure-2', 'departure-3', 'departure-4']);
  assert.match(failed.find((item) => item.id === 'departure-1').error, /бронирования/);
  assert.match(failed.find((item) => item.id === 'departure-2').error, /Обновите список/);
  assert.ok(failed.every((item) => item.label.includes('2026-11-01')));
});

test('bulk deletion explains expired sessions and missing permissions', async (context) => {
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const { id } = JSON.parse(options.body);
    return Response.json({ error: 'unauthorized' }, { status: id === 'departure-0' ? 401 : 403 });
  });
  const { deleted, failed } = await deleteDepartures(departures(2));
  assert.deepEqual(deleted, []);
  assert.match(failed.find((item) => item.id === 'departure-0').error, /Сессия истекла/);
  assert.match(failed.find((item) => item.id === 'departure-1').error, /Недостаточно прав/);
});
