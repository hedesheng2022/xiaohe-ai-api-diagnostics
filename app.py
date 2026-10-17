"""Small, allow-listed Gradio demo for the public Xiaohe endpoints.

The allow-list is intentional: a public diagnostic demo should not become an
arbitrary server-side URL fetcher.
"""

from urllib.parse import urlparse

import gradio as gr
import requests

ALLOWED_HOSTS = {
    "ai.xiao-he.top",
    "api.xiao-he.top",
    "www.xiao-he-ai.com",
}


def diagnose(url: str, timeout_seconds: int):
    parsed = urlparse(url.strip())
    if parsed.scheme not in {"http", "https"}:
        return {"ok": False, "error": "Only http:// and https:// URLs are supported."}
    if parsed.hostname not in ALLOWED_HOSTS:
        return {
            "ok": False,
            "error": f"Host is outside the demo allow-list: {parsed.hostname or '(missing)'}",
        }

    try:
        response = requests.get(
            url,
            timeout=max(1, min(int(timeout_seconds), 30)),
            allow_redirects=False,
            headers={"Accept": "text/html,application/json;q=0.9,*/*;q=0.8"},
        )
        preview = " ".join(response.text.split())[:240]
        return {
            "url": url,
            "status": response.status_code,
            "ok": response.ok,
            "content_type": response.headers.get("content-type"),
            "location": response.headers.get("location"),
            "body_preview": preview,
        }
    except requests.RequestException as exc:
        return {"url": url, "ok": False, "error": str(exc)}


with gr.Blocks(title="Xiaohe endpoint diagnostics") as demo:
    gr.Markdown(
        "# Xiaohe endpoint diagnostics\n"
        "A credential-free HTTP reachability check for the public Xiaohe sites."
    )
    url = gr.Textbox(label="Public endpoint", value="https://api.xiao-he.top/")
    timeout = gr.Slider(1, 30, value=8, step=1, label="Timeout (seconds)")
    run = gr.Button("Check endpoint", variant="primary")
    result = gr.JSON(label="Result")
    run.click(diagnose, inputs=[url, timeout], outputs=result)


if __name__ == "__main__":
    demo.launch()

