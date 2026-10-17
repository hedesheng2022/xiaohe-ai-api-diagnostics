#!/usr/bin/env node
import { diagnoseUrl, formatResult, parseArgs } from './diagnose-core.mjs';

const HELP = `Usage: xiaohe-api-diagnose [options]

Options:
  --url <url>       URL to check (default: https://api.xiao-he.top/)
  --timeout <ms>    Request timeout from 100 to 120000 ms (default: 8000)
  --json            Print a machine-readable JSON result
  --help            Show this help

This checks HTTP reachability only. It does not send credentials and does not
prove that a provider supports a particular model or API protocol.
`;

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP);
    process.exit(0);
  }
  const result = await diagnoseUrl(options.url, { timeoutMs: options.timeoutMs });
  process.stdout.write(options.json ? `${JSON.stringify(result, null, 2)}\n` : `${formatResult(result)}\n`);
  process.exitCode = result.ok ? 0 : 1;
} catch (error) {
  process.stderr.write(`Error: ${error.message}\n\n${HELP}`);
  process.exitCode = 2;
}

