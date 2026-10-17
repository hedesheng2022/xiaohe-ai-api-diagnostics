import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnoseUrl, parseArgs, parseHttpUrl } from '../src/diagnose-core.mjs';

test('accepts HTTPS URLs and rejects unsupported protocols', () => {
  assert.equal(parseHttpUrl('https://api.xiao-he.top/').hostname, 'api.xiao-he.top');
  assert.throws(() => parseHttpUrl('ftp://example.com/'), /Only http/);
});

test('parses the CLI options without exposing credentials', () => {
  assert.deepEqual(parseArgs(['--url', 'https://www.xiao-he-ai.com/', '--timeout', '1200', '--json']), {
    url: 'https://www.xiao-he-ai.com/',
    timeoutMs: 1200,
    json: true,
  });
});

test('returns a compact HTTP result', async () => {
  const result = await diagnoseUrl('https://api.xiao-he.top/', {
    fetchImpl: async (_url, init) => {
      assert.equal(init.method, 'GET');
      return new Response('{"status":"ok"}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    },
  });

  assert.deepEqual(result, {
    url: 'https://api.xiao-he.top/',
    status: 200,
    ok: true,
    redirected: false,
    location: null,
    contentType: 'application/json',
    elapsedMs: result.elapsedMs,
    bodyPreview: '{"status":"ok"}',
  });
});

