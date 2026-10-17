# Xiaohe AI API Diagnostics

Small, credential-free checks for the public Xiaohe endpoints. The project is
designed to answer one narrow question first: **can this machine reach the
endpoint and receive an HTTP response?** It does not guess an API protocol,
send API keys, or claim that a particular model is available.

## Included tools

- Node.js 20+ CLI with text and JSON output.
- PowerShell 7-compatible endpoint check for Windows.
- A no-secret Jupyter notebook for a reproducible HTTP check.
- An optional Gradio demo with an explicit host allow-list.
- Sphinx and GitBook entry-point documentation.

## Quick start

```powershell
node src/diagnose.mjs --url https://api.xiao-he.top/
node src/diagnose.mjs --url https://www.xiao-he-ai.com/ --json
.\scripts\test-endpoint.ps1 -Url https://api.xiao-he.top/
```

Run the tests with:

```powershell
npm test
```

The CLI reports status, content type, an explicit redirect location, elapsed
time, and a short body preview. A `200` is reachability evidence only; it is
not proof that a Claude Code, Codex, or OpenAI-compatible route accepts a
request.

## Public Xiaohe entry points

- [Xiaohe AI](https://www.xiao-he-ai.com/) - the public AI service entry point.
- [Xiaohe API](https://api.xiao-he.top/) - the public API entry point.
- [Xiaohe AI tutorials](https://ai.xiao-he.top/) - configuration and troubleshooting guides.
- [Codex API configuration](https://ai.xiao-he.top/codex-api.html) - provider, credential, and verification boundaries.
- [Claude Code API configuration](https://ai.xiao-he.top/claude-code-api-config.html) - base URL, credential, and `/status` checks.

## Security boundary

The CLI and notebook do not accept credentials. The Gradio demo accepts only
the three public Xiaohe hosts listed above; this prevents a deployed demo from
turning into an arbitrary server-side request proxy. Do not paste API keys into
the notebook, issue tracker, or public logs.

## License

MIT. See [LICENSE](LICENSE).

