import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DotsPattern from "../components/DotsPattern";

function formatTimestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HighlightsPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      let json;
      try {
        json = await res.json();
      } catch {
        throw new Error("Could not reach the backend - make sure the Flask server is running on port 5000");
      }
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative pt-8 pb-10 mb-10 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-sky-50/60 to-white">
            <DotsPattern id="analyze-dots" opacity={0.14} />
            <div className="relative px-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Analyze a YouTube Video
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Paste a URL and get an AI summary, key highlights and a chat
                interface.
              </p>

              <form onSubmit={handleAnalyze} className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-md shadow-sky-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </form>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-sky-200 border-t-sky-500 animate-spin" />
              <p className="text-sm text-gray-400">
                Extracting transcript and generating highlights...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {data && (
            <div className="space-y-5">
              <div className="flex gap-4 items-start p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                <img
                  src={data.thumbnail}
                  alt={data.title}
                  className="w-32 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                    {data.title}
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${data.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Open on YouTube
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                  Summary
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {data.summary}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                  Key Highlights
                </p>
                <div className="space-y-3">
                  {data.highlights.map((h, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <a
                        href={`https://www.youtube.com/watch?v=${data.videoId}&t=${h.seconds}s`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-100 px-2 py-0.5 rounded transition-colors flex-shrink-0 mt-0.5"
                      >
                        {formatTimestamp(h.seconds)}
                      </a>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {h.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/chat", { state: { video: data } })}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-md shadow-sky-200/50"
                >
                  Chat with this video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
