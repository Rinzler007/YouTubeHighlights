import re
import json
import urllib.request
from youtube_transcript_api import YouTubeTranscriptApi


def extract_video_id(url):
    patterns = [
        r'(?:v=)([A-Za-z0-9_-]{11})',
        r'(?:youtu\.be/)([A-Za-z0-9_-]{11})',
        r'(?:embed/)([A-Za-z0-9_-]{11})',
        r'(?:shorts/)([A-Za-z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError('Could not extract a valid video ID from the URL')


def get_video_title(video_id):
    oembed_url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json'
    try:
        req = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read())
            return data.get('title', 'YouTube Video')
    except Exception:
        return 'YouTube Video'


def get_transcript(url):
    video_id = extract_video_id(url)

    api = YouTubeTranscriptApi()
    segments = api.fetch(video_id)

    full_text = ' '.join(snippet.text for snippet in segments)

    timed_text = '\n'.join(
        f'[{int(snippet.start)}s] {snippet.text}'
        for snippet in segments
    )

    title = get_video_title(video_id)

    return {'full': full_text, 'timed': timed_text}, video_id, title
