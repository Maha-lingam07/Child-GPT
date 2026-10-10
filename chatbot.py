"""Child-friendly answer generation using the agents from the notebook."""

import os
os.environ["GOOGLE_API_KEY"] = "I4L3U2F1r2e3e4k5e6y7N8i9c0k1y"
# ofc above is not a valid apikey, get api key from Google AI studio
from functools import lru_cache


@lru_cache(maxsize=1)
def _get_runner():
    """Build the ADK pipeline once, when the first question is asked."""
    from google.adk.agents import Agent, LoopAgent, SequentialAgent
    from google.adk.models.google_llm import Gemini
    from google.adk.runners import InMemoryRunner
    from google.adk.tools import FunctionTool
    from google.genai import types

    if not os.getenv("GOOGLE_API_KEY"):
        raise RuntimeError("GOOGLE_API_KEY is not set. Add it to your environment before starting the app.")

    retry_config = types.HttpRetryOptions(
        attempts=5,
        exp_base=7,
        initial_delay=1,
        http_status_codes=[429, 500, 503, 504],
    )

    def model():
        return Gemini(model="gemini-3.5-flash-lite", retry_options=retry_config)

    content_agent = Agent(
        name="ContentAgent",
        model=model(),
        instruction=(
            "You are a friendly chat helper for children. Never call yourself ContentAgent, "
            "an AI agent, or mention internal roles or systems. If the child greets you, "
            "reply naturally with a greeting such as 'Hello there! I'm your friendly chat helper.' "
            "Analyze the prompt and provide a brief, conversational explanation in 2 to 3 short "
            "paragraphs. Keep the answer direct, simple, and light so it stays easy to read."
        ),
        output_key="current_content",
    )
    feedback_agent = Agent(
        name="FeedbackAgent",
        model=model(),
        instruction="""You are the Safety and Quality Reviewer for an interactive children's chatbot.
Content to Review: {current_content}
Check that the answer is safe for children, brief, simple, friendly, and joyful.
If it satisfies all criteria, respond ONLY with the exact word: APPROVED.
Otherwise, give specific feedback on what to remove, shorten, or simplify.""",
        output_key="feedback",
    )

    def exit_loop():
        """Finish the refinement loop after the reviewer approves the answer."""
        return {"status": "approved", "message": "Content approved. Exiting refinement loop."}

    editor_agent = Agent(
        name="EditorAgent",
        model=model(),
        instruction="""You are a friendly children's chat helper. Never refer to yourself as ContentAgent, an agent, or by any internal role name.
Draft Answer: {current_content}
Reviewer Feedback: {feedback}
If the feedback is exactly APPROVED, call exit_loop and output nothing else.
Otherwise rewrite the draft as a concise, joyful, simple, completely safe answer that addresses the question.
Use short, clear sentences and a warm tone.""",
        output_key="current_content",
        tools=[FunctionTool(exit_loop)],
    )
    pipeline = SequentialAgent(
        name="ContentPipeline",
        sub_agents=[
            content_agent,
            LoopAgent(name="ContentRefinementLoop", sub_agents=[feedback_agent, editor_agent], max_iterations=2),
        ],
    )
    return InMemoryRunner(agent=pipeline)


async def answer_question(question: str) -> str:
    """Run a question through the notebook's content and safety pipeline."""
    runner = _get_runner()
    events = await runner.run_debug(question.strip(), quiet=True)
    final_content = None
    for event in events:
        actions = getattr(event, "actions", None)
        state_delta = getattr(actions, "state_delta", {}) if actions else {}
        if "current_content" in state_delta:
            final_content = state_delta["current_content"]
    if not final_content:
        raise RuntimeError("The chatbot did not return an answer. Please try again.")
    return str(final_content)
