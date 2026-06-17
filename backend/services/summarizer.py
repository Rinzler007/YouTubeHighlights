import os
import json
import time
from google import genai
from google.api_core.exceptions import ServiceUnavailable, ResourceExhausted

MAX_RETRIES = 3
MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash']


def summarize(transcript):
    client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])

    prompt = f"""You are analyzing a YouTube video transcript.

Return a JSON object with exactly these fields:
- "summary": a 3-4 sentence plain-text overview of the video
- "highlights": an array of 5-8 key moments, each with:
  - "timestamp": formatted as "M:SS" or "MM:SS"
  - "seconds": the start time as an integer
  - "text": 1-2 sentences describing what is covered at this moment

Transcript (timestamps shown in seconds):
{transcript['timed']}

Return only valid JSON. No markdown fences, no extra keys."""

    last_exc = None
    for model in MODELS:
        for attempt in range(MAX_RETRIES):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config={
                        'response_mime_type': 'application/json',
                    },
                )
                return json.loads(response.text)
            except (ServiceUnavailable, ResourceExhausted) as e:
                last_exc = e
                if attempt < MAX_RETRIES - 1:
                    time.sleep(2 ** attempt)
    raise last_exc
