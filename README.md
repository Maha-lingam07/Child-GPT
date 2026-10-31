# Child GPT

A child-friendly web chatbot powered by Google ADK and Gemini 3.5 Flash-Lite. It drafts, reviews, and refines answers for a warm, simple, child-appropriate tone. The web interface includes a dog companion, chat reset, and optional browser speech-to-text.

## Run locally

1. Create and activate a virtual environment.
2. Install packages: `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env` and set `GOOGLE_API_KEY` to your Google AI Studio API key.
4. Start the app with `python app.py` and visit `http://127.0.0.1:7860`.

Keep `.env` private. It is excluded from Git by `.gitignore`.

## Deploy to Render

The repository includes a `render.yaml` Blueprint. In Render, choose **New → Blueprint**, connect this GitHub repository, and provide your Google API key when prompted for `GOOGLE_API_KEY`. Render will build the Python service and deploy it. Do not commit or upload `.env`.

The microphone feature requires browser speech recognition support and microphone permission. It works over HTTPS in browsers that provide the Web Speech API, such as Chrome and Edge.

Render's free web services sleep after 15 minutes without traffic, so the first request after a pause may take about a minute to start. Gemini API quotas and billing are separate from Render hosting.
