const DEFAULT_TIMEOUT_MS = 8_000;

export function parseHttpUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('Only http:// and https:// URLs are supported.');
  }
  return url;
}

export function parseArgs(argv) {
  const options = {
    url: 'https://api.xiao-he.top/',
    timeoutMs: DEFAULT_TIMEOUT_MS,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') {
      options.help = true;
      continue;
    }
    if (argument === '--json') {
      options.json = true;
      continue;
    }
    if (argument === '--url') {
      options.url = argv[++index];
      continue;
    }
    if (argument === '--timeout') {
      const timeoutMs = Number(argv[++index]);
      if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 120_000) {
        throw new TypeError('--timeout must be an integer between 100 and 120000 milliseconds.');
      }
      options.timeoutMs = timeoutMs;
      continue;
    }
    throw new TypeError(`Unknown option: ${argument}`);
  }

  parseHttpUrl(options.url);
  return options;
}

export async function diagnoseUrl(value, { timeoutMs = DEFAULT_TIMEOUT_MS, fetchImpl = fetch } = {}) {
  const url = parseHttpUrl(value);
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { accept: 'text/html,application/json;q=0.9,*/*;q=0.8' },
    });
    const body = await response.text();
    return {
      url: url.href,
      status: response.status,
      ok: response.ok,
      redirected: response.type === 'opaqueredirect' || Boolean(response.headers.get('location')),
      location: response.headers.get('location'),
      contentType: response.headers.get('content-type'),
      elapsedMs: Date.now() - startedAt,
      bodyPreview: body.slice(0, 240).replace(/\s+/g, ' ').trim(),
    };
  } catch (error) {
    return {
      url: url.href,
      ok: false,
      elapsedMs: Date.now() - startedAt,
      error: error.name === 'AbortError' ? `Timed out after ${timeoutMs} ms.` : error.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function formatResult(result) {
  const lines = [`URL: ${result.url}`];
  if (result.status !== undefined) lines.push(`HTTP: ${result.status} (${result.ok ? 'ok' : 'not ok'})`);
  if (result.contentType) lines.push(`Content-Type: ${result.contentType}`);
  if (result.location) lines.push(`Location: ${result.location}`);
  lines.push(`Elapsed: ${result.elapsedMs} ms`);
  if (result.bodyPreview) lines.push(`Body preview: ${result.bodyPreview}`);
  if (result.error) lines.push(`Error: ${result.error}`);
  return lines.join('\n');
}

