import os
import anthropic


ALLOWED_MODELS = {
    'claude-haiku-4-5-20251001',
    'claude-sonnet-4-6',
}

def chat_stream(messages, transcript, model='claude-haiku-4-5-20251001'):
    if model not in ALLOWED_MODELS:
        model = 'claude-haiku-4-5-20251001'

    client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

    system = f"""You are a helpful assistant that answers questions about a YouTube video.

Use the transcript below as your source of truth. Be concise and direct. If something is not covered in the transcript, say so.

Transcript:
{transcript}"""

    with client.messages.stream(
        model=model,
        max_tokens=1024,
        system=system,
        messages=messages,
    ) as stream:
        for text in stream.text_stream:
            yield text
