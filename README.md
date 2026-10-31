<div align="center">

<img src="static/Welcome.png" alt="Child GPT mascot" height="140"/>

# ✦ Child GPT

**A warm, safe, AI-powered chatbot built for curious young minds.**

[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-black?logo=flask)](https://flask.palletsprojects.com)
[![Google ADK](https://img.shields.io/badge/Google%20ADK-2.13.0-4285F4?logo=google&logoColor=white)](https://google.github.io/adk-docs/)
[![Gemini](https://img.shields.io/badge/Gemini-3.5%20Flash%20Lite-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com)

*Ask anything — child-safe answers powered by a multi-agent AI pipeline.*

</div>

---

## 🐾 What is Child GPT?

Child GPT is a delightful, child-safe web chatbot that uses a **multi-agent pipeline** (powered by Google ADK & Gemini) to generate, review, and refine answers until they're warm, simple, joyful, and completely safe for children.

Every question a child asks goes through three intelligent AI agents in sequence:

1. **ContentAgent** — crafts a friendly, conversational answer in 2–3 short paragraphs.
2. **FeedbackAgent** — reviews the draft for safety, simplicity, and age-appropriateness.
3. **EditorAgent** — refines the answer based on feedback, or exits early if already approved.

The result is a safe, refined response every single time — never raw AI output.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🤖 **Multi-Agent AI Pipeline** | Sequential + Loop agent refinement via Google ADK |
| 🛡️ **Child-Safe Content Review** | Every answer passes a dedicated safety & quality reviewer |
| 🎙️ **Voice Input** | Browser-native Speech Recognition (Chrome / Edge) |
| 🐶 **Animated Dog Companion** | Visual state feedback: Welcome → Thinking → Done |
| 📱 **Fully Responsive UI** | Works beautifully on mobile, tablet, and desktop |
| ♿ **Accessibility First** | ARIA labels, `aria-live` regions, screen-reader support |
| ↻ **Chat Reset** | Start a fresh conversation with one click |
| ⚡ **Single-Page App** | No page reloads — smooth async chat experience |
| 🚀 **One-Click Render Deploy** | Deploy to the cloud via `render.yaml` Blueprint |

---

## 🏗️ Architecture

```
Child (Browser)
      │
      │  POST /api/chat  { question }
      ▼
┌─────────────────────────────────────────────────────┐
│  Flask Web Server  (app.py)                         │
│  • Validates input (max 2 000 chars)                │
│  • Friendly error messages for API failures         │
└────────────────────────┬────────────────────────────┘
                         │  asyncio.run(answer_question)
                         ▼
┌─────────────────────────────────────────────────────┐
│  Google ADK Pipeline  (chatbot.py)                  │
│                                                     │
│  SequentialAgent: ContentPipeline                   │
│  │                                                  │
│  ├─ ContentAgent   ──▶  initial draft               │
│  │                                                  │
│  └─ LoopAgent: ContentRefinementLoop (max 2×)       │
│       ├─ FeedbackAgent  ──▶ APPROVED / feedback     │
│       └─ EditorAgent    ──▶ refined draft / exit    │
│                                                     │
│  Model: gemini-3.5-flash-lite                       │
│  Retry: 5 attempts, exp backoff on 429/500/503/504  │
└─────────────────────────────────────────────────────┘
                         │
                         │  { answer }
                         ▼
                    Browser renders
                    animated dog + chat bubble
```

---

## 🚀 Quick Start (Local)

### Prerequisites

- Python **3.12+**
- A **Google AI Studio API key** → [Get one free](https://aistudio.google.com/app/apikey)

### 1 — Clone & set up environment

```bash
git clone https://github.com/your-username/ChildGPT.git
cd ChildGPT

python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

### 2 — Install dependencies

```bash
pip install -r requirements.txt
```

### 3 — Configure your API key

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder:

```env
GOOGLE_API_KEY=your-google-ai-studio-api-key-here
```

> **Never commit your `.env` file.** It is already excluded by `.gitignore`.

### 4 — Run the app

```bash
python app.py
```

Visit **[http://127.0.0.1:7860](http://127.0.0.1:7860)** in your browser.

---

## ☁️ Deploy to Render (Free)

This repo ships with a `render.yaml` Blueprint for zero-config cloud deployment.

1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com) → **New → Blueprint**.
3. Connect your GitHub repository.
4. When prompted, set the `GOOGLE_API_KEY` environment variable to your key.
5. Click **Apply** — Render builds and deploys automatically.

```yaml
# render.yaml (already in repo)
services:
  - type: web
    name: child-gpt
    runtime: python
    plan: free
    region: singapore
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn --workers 1 --threads 4 --bind 0.0.0.0:$PORT app:app
    envVars:
      - key: GOOGLE_API_KEY
        sync: false        # ← you supply this securely in Render's dashboard
```

> **Note:** Render's free tier sleeps after 15 minutes of inactivity. The first request after a pause may take ~60 seconds to wake the service.

---

## 📁 Project Structure

```
ChildGPT/
├── app.py               # Flask web server & REST API endpoint
├── chatbot.py           # Google ADK multi-agent pipeline
├── requirements.txt     # Python dependencies
├── render.yaml          # Render cloud deployment blueprint
├── .env.example         # API key template (safe to commit)
├── .env                 # Your real key (git-ignored)
├── .python-version      # Pinned Python version (3.12)
├── templates/
│   └── index.html       # Single-page chat UI (Jinja2)
└── static/
    ├── app.js           # Frontend logic (fetch, speech, dog states)
    ├── style.css        # Responsive design (DM Sans + Nunito)
    ├── Welcome.png      # Dog companion — idle state
    ├── Thinking.png     # Dog companion — processing state
    └── Done.png         # Dog companion — answer ready state
```

---

## 🔌 API Reference

### `POST /api/chat`

Send a question and receive a child-safe answer.

**Request body**

```json
{ "question": "Why is the sky blue?" }
```

**Successful response** `200 OK`

```json
{ "answer": "The sky looks blue because of something really cool called scattering! ..." }
```

**Error responses**

| Status | Cause | Message |
|--------|-------|---------|
| `400` | Empty question | `"Type a question first..."` |
| `400` | Question > 2 000 chars | `"That question is a little long..."` |
| `500` | Invalid API key | `"Google rejected the API key..."` |
| `500` | Quota / rate limit | `"Google reports that the API quota..."` |
| `500` | Model unavailable | `"The configured Gemini model is unavailable..."` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, Flask 3.x |
| **AI Framework** | Google ADK 2.13.0 |
| **LLM** | Gemini 3.5 Flash-Lite |
| **Gen AI SDK** | google-genai 2.34.0 |
| **Production Server** | Gunicorn 22+ |
| **Frontend** | Vanilla JS, CSS3, Web Speech API |
| **Fonts** | DM Sans + Nunito (Google Fonts) |
| **Hosting** | Render (free tier) |

---

## 🎙️ Voice Input

Child GPT supports browser-native speech recognition:

- Click the **🎙️ microphone button** to speak your question.
- Works in **Chrome** and **Edge** (Web Speech API required).
- Auto-submits when speech ends.
- Graceful fallback — the mic button is disabled in unsupported browsers with a clear tooltip.

> Voice input requires **HTTPS** in production and **microphone permission** granted in the browser.

---

## 🛡️ Safety & Content Policy

Every response is processed through a dedicated **FeedbackAgent** that checks:

- ✅ Safe for children
- ✅ Brief and age-appropriate
- ✅ Simple vocabulary and friendly tone
- ✅ Joyful and encouraging

If the initial draft doesn't pass, the **EditorAgent** rewrites it. This loop runs up to **2 refinement iterations** before delivering a final answer.

---

## 🤝 Contributing

Contributions are welcome! To get started:

```bash
# Fork the repo, then:
git checkout -b feature/my-improvement
# make your changes
git commit -m "feat: describe your change"
git push origin feature/my-improvement
# open a Pull Request
```

Please keep all contributions child-safe and in the spirit of the project. 🐾

---

## 📜 License

This project is open source. Check the repository for license details.

---

<div align="center">

*Kind answers, one question at a time* ♥

Made for curious minds ✦ Ask a grown-up if something feels confusing.

</div>
