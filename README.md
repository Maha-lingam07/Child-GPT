---
title: Child GPT
emoji: 🐶
colorFrom: blue
colorTo: yellow
sdk: docker
app_port: 7860
---

# Child GPT

A child-friendly web chatbot powered by Google ADK and Gemini. It drafts, reviews, and refines answers for a warm, simple, child-appropriate tone. The web interface includes a dog companion, chat reset, and optional speech-to-text input.

## Run locally

1. Create and activate a virtual environment.
2. Install packages: `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env` and set `GOOGLE_API_KEY` to your Google AI Studio API key.
4. Start the app with `python app.py` and visit `http://127.0.0.1:7860`.

Keep `.env` private. It is excluded from Git by `.gitignore`.

## Deploy to Hugging Face Spaces

Create a Docker Space and push this repository to it. In the Space's **Settings → Variables and secrets → Secrets**, add `GOOGLE_API_KEY`. The app reads the key from the runtime environment; never upload `.env` or put the key in the Dockerfile.

Speech recognition needs browser support and microphone permission. It works on secure HTTPS deployments such as Hugging Face Spaces; Chrome and Edge support the browser speech API used here.
