# Paw-sitive Chat

A small web chat for the child-friendly Gemini pipeline in `chatbot.py`. The pipeline is based on the agents in `Chatbot_for_Children.ipynb` and keeps the draft, safety review, and refinement loop.

## Run locally

1. Create and activate a virtual environment.
2. Install dependencies with `pip install -r requirements.txt`.
3. Set your Google AI API key as the `GOOGLE_API_KEY` environment variable.
4. Start the app with `python app.py` and open <http://127.0.0.1:5000>.

The app reads the key from the environment at runtime. Do not add API keys to source files.
