from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
from services.transcript import get_transcript, extract_video_id
from services.summarizer import summarize
from services.chat_service import chat_stream

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    url = (data or {}).get('url', '').strip()

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    try:
        transcript, video_id, title = get_transcript(url)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Could not fetch transcript: {str(e)}'}), 500

    try:
        result = summarize(transcript)
    except Exception as e:
        return jsonify({'error': f'Summarization failed: {str(e)}'}), 500

    return jsonify({
        'videoId': video_id,
        'title': title,
        'thumbnail': f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
        'summary': result['summary'],
        'highlights': result['highlights'],
        'transcript': transcript['full'],
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    messages = (data or {}).get('messages', [])
    transcript = (data or {}).get('transcript', '')
    model = (data or {}).get('model', 'claude-haiku-4-5-20251001')

    if not messages:
        return jsonify({'error': 'messages is required'}), 400

    def generate():
        try:
            for chunk in chat_stream(messages, transcript, model):
                yield chunk
        except Exception as e:
            yield f'Error: {str(e)}'

    return Response(stream_with_context(generate()), mimetype='text/plain')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
