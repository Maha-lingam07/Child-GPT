"""Flask web app for the child-friendly chatbot."""

import asyncio
import os

from flask import Flask, jsonify, render_template, request

from chatbot import answer_question

app = Flask(__name__)


def _friendly_chat_error(exc: Exception) -> str:
    """Explain common Gemini setup failures without returning raw provider details."""
    if isinstance(exc, RuntimeError):
        return str(exc)

    detail = str(exc).lower()
    if any(term in detail for term in ("api key not valid", "api_key_invalid", "invalid api key", "unauthenticated", "401")):
        return (
            "Google rejected the API key. Check that GOOGLE_API_KEY is set in the Render service environment, "
            "with no quotes or extra spaces, then restart the service."
        )
    if any(term in detail for term in ("resource_exhausted", "quota", "rate limit", "429")):
        return "Google reports that the API quota or rate limit was reached. Check your Google AI Studio project and try again later."
    if any(term in detail for term in ("not found", "model", "404")):
        return "The configured Gemini model is unavailable to this API project. Check the Render service logs for details."
    return "The chatbot server hit an error. Check the Render service logs and confirm GOOGLE_API_KEY is set in the service environment."


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    question = str(data.get("question", "")).strip()
    if not question:
        return jsonify(error="Type a question first, and I’ll do my best to help!"), 400
    if len(question) > 2000:
        return jsonify(error="That question is a little long. Try keeping it under 2,000 characters."), 400
    try:
        answer = asyncio.run(answer_question(question))
        return jsonify(answer=answer)
    except Exception as exc:
        app.logger.exception("Chat request failed")
        return jsonify(error=_friendly_chat_error(exc)), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "7860")), debug=False)
