Usage
=====

Node.js CLI
-----------

The CLI requires Node.js 20 or newer and does not read API keys::

    node src/diagnose.mjs --url https://api.xiao-he.top/
    node src/diagnose.mjs --url https://www.xiao-he-ai.com/ --json

The result reports the status, content type, explicit redirect location, a
short response preview, and elapsed time. Use the public guides when you need
to test a protocol-specific route or configure credentials.

PowerShell
----------

On Windows, run::

    .\scripts\test-endpoint.ps1 -Url https://api.xiao-he.top/

The script is a reachability check, not an authentication test.

Gradio demo
-----------

Install the two dependencies in ``requirements.txt`` and run::

    python app.py

The demo deliberately restricts requests to the three Xiaohe public hosts so
that a deployed copy does not become an arbitrary server-side URL fetcher.

