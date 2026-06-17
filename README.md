# YouTubeHighlights

A web app that turns any YouTube video into an instant AI summary, timestamped key highlights and an interactive chat interface. Paste a URL, get the key moments in seconds and ask follow-up questions powered by Claude.

---

## Features

- **Transcript extraction** - Pulls the full transcript directly from YouTube using `youtube-transcript-api`. No downloads or extensions needed.
- **AI highlights** - Gemini 1.5 Flash reads the transcript and surfaces 5-8 key moments with exact timestamps you can jump to on YouTube.
- **Video summary** - A concise 3-4 sentence overview of the entire video generated alongside the highlights.
- **Chat with the video** - Claude answers questions using the transcript as context, with streaming responses. Switch between Haiku (fast) and Sonnet (smart) directly in the chat UI.
- **Timestamp links** - Every highlight links directly to that moment in the YouTube video.

---

## Tech Stack

| Layer         | Technology                                         |
| ------------- | -------------------------------------------------- |
| Frontend      | React 19, Vite, Tailwind CSS v4                    |
| Backend       | Python, Flask                                      |
| Highlights AI | Google Gemini 2.5 Flash                            |
| Chat AI       | Anthropic Claude (Haiku / Sonnet, user-selectable) |
| Transcript    | youtube-transcript-api                             |

---

## Project Structure

```
YouTubeHighlights/
  frontend/
    src/
      pages/
        LandingPage.jsx       Hero page with feature overview
        HighlightsPage.jsx    URL input, summary and highlights display
        ChatPage.jsx          Streaming chat interface
      components/
        Navbar.jsx
        DotsPattern.jsx
    vite.config.js            Proxies /api to Flask on port 5000
    package.json
  backend/
    app.py                    Flask app with /api/analyze and /api/chat
    services/
      transcript.py           YouTube transcript extraction
      summarizer.py           Gemini summarization and highlight extraction
      chat_service.py         Claude streaming chat
    requirements.txt
    .env.example
```

---

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- An [Anthropic](https://console.anthropic.com) API key (Claude)

### 1. Clone the repo

```bash
git clone https://github.com/Rinzler007/YouTubeHighlights.git
cd YouTubeHighlights
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

```
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Start the Flask server:

```bash
python app.py
```

The backend runs on `http://localhost:5000`.

### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. Vite automatically proxies `/api` requests to the Flask backend, so no CORS configuration is needed in development.

---

## API Reference

### `POST /api/analyze`

Extracts the transcript for a YouTube video and returns a summary and highlights.

**Request body:**

```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Response:**

```json
{
  "videoId": "dQw4w9WgXcQ",
  "title": "Video Title",
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "summary": "A concise overview of the video content...",
  "highlights": [
    {
      "timestamp": "1:24",
      "seconds": 84,
      "text": "Description of what happens at this moment."
    }
  ],
  "transcript": "Full transcript text used for chat context."
}
```

### `POST /api/chat`

Streams a Claude response to a user question about the video.

**Request body:**

```json
{
  "messages": [{ "role": "user", "content": "What is the main takeaway?" }],
  "transcript": "Full transcript text...",
  "model": "claude-haiku-4-5-20251001"
}
```

`model` is optional and it defaults to `claude-haiku-4-5-20251001`. Accepted values: `claude-haiku-4-5-20251001`, `claude-sonnet-4-6`.

**Response:** Plain text streamed in chunks (`text/plain`).

---

## How It Works

1. User pastes a YouTube URL on the Analyze page.
2. The backend extracts the video ID, fetches the transcript from YouTube and retrieves the video title via the oEmbed API.
3. The timed transcript (with second-level timestamps) is sent to Gemini 1.5 Flash, which returns a JSON summary and list of key moments.
4. The frontend displays the highlights with clickable timestamp links.
5. The user can open the Chat page where Claude answers questions using the full transcript as system context. Responses stream token by token. The user can switch between Haiku and Sonnet using the model toggle in the chat header.

---

## Notes

- Videos without captions or auto-generated transcripts will return an error. Most English-language videos on YouTube have auto-generated captions.
- The Gemini response is parsed as JSON. If the model returns malformed JSON, the analyze request will fail with a 500 error.
- Transcripts are passed in full to Claude for chat context. Very long videos (over an hour) may approach token limits for Haiku (200K context). Switch to Sonnet (1M context) via the model toggle in the chat header for those cases.
