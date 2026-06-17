import os
import json
import re
from google import genai


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

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )
    text = response.text.strip()

    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)

    return json.loads(text)
