"""Flask web app for the child-friendly chatbot."""

import asyncio
import os

from flask import Flask, jsonify, render_template, request

from chatbot import answer_question

app = Flask(__name__)


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
        message = str(exc) if isinstance(exc, RuntimeError) else "I couldn’t reach my answer helper just now. Please try again."
        return jsonify(error=message), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("PORT", "5000")), debug=False)
