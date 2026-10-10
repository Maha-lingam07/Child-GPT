# Child-GPT

A web-based conversational assistant powered by a multi-agent Gemini pipeline, designed to provide safe, engaging, and age-appropriate interactions for children.

## Overview

Child-GPT implements a structured, multi-step pipeline (`chatbot.py`) adapted from `Chatbot_for_Children.ipynb`. Every user message passes through an automated review loop before reaching the user:

1. **Draft Generation**: Formulates an engaging, child-friendly response to the user's query.
2. **Safety Review**: Evaluates the drafted response against age-appropriateness guidelines, content safety boundaries, and tone considerations.
3. **Refinement Loop**: Adjusts and polished the content based on safety feedback to ensure high quality and security before display.

## Key Features

* **Multi-Agent Architecture**: Automated drafting, reviewing, and refining stages to maintain safe boundaries.
* **Child-Centric Guardrails**: Prevents exposure to sensitive topics while maintaining an encouraging, educational tone.
* **Interactive Web Interface**: A clean Flask web application for real-time interaction.

## Getting Started

### Prerequisites

* Python 3.8 or higher
* A Google AI Studio API Key (`GOOGLE_API_KEY`)

### Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Maha-lingam07/Child-GPT.git
   cd Child-GPT
   ```

2. **Create and activate a virtual environment**:
   * **Windows (cmd):**
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```
   * **macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set your API Key**:
   * **Windows (cmd):**
     ```cmd
     set GOOGLE_API_KEY="your_api_key_here"
     ```
   * **macOS/Linux:**
     ```bash
     export GOOGLE_API_KEY="your_api_key_here"
     ```

5. **Run the Application**:
   ```bash
   python app.py
   ```

6. Open your browser and navigate to `http://127.0.0.1:5000`.

> **Security Note:** Never commit your `GOOGLE_API_KEY` or `.env` files to source control.
