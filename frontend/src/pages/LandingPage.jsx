import { Link } from "react-router-dom";
import DotsPattern from "../components/DotsPattern";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <Navbar />

      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <DotsPattern id="hero-dots" opacity={0.18} />
        <div className="absolute top-16 left-16 w-80 h-80 rounded-full bg-[#4285F4]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-24 w-72 h-72 rounded-full bg-[#EA4335]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 left-1/3 w-96 h-96 rounded-full bg-[#FBBC05]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 right-16 w-64 h-64 rounded-full bg-[#34A853]/8 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 text-sky-600 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              AI-powered video highlights
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
              Watch less,
              <span className="block bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                understand more.
              </span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Paste any YouTube URL and get an instant AI summary, timestamped
              key moments and a chat interface to ask anything about the video.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/highlights"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-200/60"
              >
                Analyze a Video
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-sky-200/25 via-indigo-200/15 to-emerald-200/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xl shadow-sky-100/50">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-sky-50/40">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <span className="ml-3 text-xs text-gray-400 font-mono">
                  Video Highlights
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-28 h-16 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 mb-1">
                      The Art of Deep Work
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      A guide to achieving intense focus in a distracted world,
                      covering strategies used by top performers.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      t: "1:24",
                      text: "Deep work defined: distraction-free concentration that pushes cognitive limits.",
                    },
                    {
                      t: "4:10",
                      text: "Why shallow work is taking over and how to fight back.",
                    },
                    {
                      t: "9:03",
                      text: "The 4 depth philosophies and choosing the right one for you.",
                    },
                  ].map(({ t, text }) => (
                    <div key={t} className="flex gap-2 items-start">
                      <span className="text-xs font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded flex-shrink-0">
                        {t}
                      </span>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50/30 flex gap-4 text-xs text-gray-400">
                <span>3 highlights shown</span>
                <span className="ml-auto bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent font-medium">
                  Gemini + Claude
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20 border-t border-gray-100 overflow-hidden">
        <div className="absolute -left-20 top-0 w-72 h-72 rounded-full bg-[#34A853]/6 blur-3xl pointer-events-none" />
        <div className="absolute -right-16 bottom-0 w-64 h-64 rounded-full bg-[#4285F4]/6 blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            You find a 45-minute YouTube video that might have the answer you
            need. Do you watch the whole thing or skip around hoping to land on
            the right part?
          </p>
          <p className="text-gray-400 leading-relaxed">
            YouTube Highlights extracts the transcript, identifies the key
            moments with timestamps and lets you ask follow-up questions. Get to
            the point instantly.
          </p>
        </div>
      </section>

      <section className="relative px-6 py-20 border-t border-gray-100 bg-gradient-to-b from-sky-50/40 via-white to-indigo-50/30 overflow-hidden">
        <DotsPattern id="how-dots" opacity={0.12} />
        <div className="max-w-5xl mx-auto relative">
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-12">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              label="Paste"
              headline="Any YouTube URL"
              body="Drop in a link and the app fetches the video transcript automatically. No downloads, no extensions."
              accent="sky"
            />
            <FeatureCard
              label="Analyze"
              headline="AI extracts key moments"
              body="Gemini reads the full transcript and surfaces the most important moments with exact timestamps you can jump to."
              accent="indigo"
            />
            <FeatureCard
              label="Chat"
              headline="Ask anything about it"
              body="Claude answers your questions using the video content as context. Clarify, dig deeper or get a quick summary of one section."
              accent="emerald"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-t border-gray-100 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-emerald-50/50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          <StatCard
            value="instant"
            label="transcript extraction via YouTube API"
            gradient="from-sky-600 to-sky-400"
          />
          <StatCard
            value="2 AIs"
            label="Gemini for highlights, Claude for chat"
            gradient="from-indigo-600 to-indigo-400"
          />
          <StatCard
            value="100%"
            label="based on the actual video content"
            gradient="from-emerald-600 to-emerald-400"
          />
        </div>
      </section>

      <section className="relative px-6 py-20 border-t border-gray-100 overflow-hidden">
        <div className="absolute left-10 top-10 w-56 h-56 rounded-full bg-[#FBBC05]/8 blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-10 w-56 h-56 rounded-full bg-[#EA4335]/6 blur-3xl pointer-events-none" />
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Ready to stop scrubbing through videos?
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Paste a URL and get your highlights in seconds.
          </p>
          <Link
            to="/highlights"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-200/60"
          >
            Get Started
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
            YouTube Highlights
          </span>
          <span>AI-powered video highlights and chat</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ label, headline, body, accent }) {
  const styles = {
    sky: {
      tag: "bg-sky-50 text-sky-600 border border-sky-100",
      bg: "bg-gradient-to-br from-sky-50/70 to-white hover:from-sky-50 hover:shadow-sky-100/50",
    },
    indigo: {
      tag: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      bg: "bg-gradient-to-br from-indigo-50/70 to-white hover:from-indigo-50 hover:shadow-indigo-100/50",
    },
    emerald: {
      tag: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      bg: "bg-gradient-to-br from-emerald-50/70 to-white hover:from-emerald-50 hover:shadow-emerald-100/50",
    },
  }[accent];

  return (
    <div
      className={`p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all ${styles.bg}`}
    >
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 ${styles.tag}`}
      >
        {label}
      </span>
      <p className="text-gray-900 font-semibold mb-2">{headline}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function StatCard({ value, label, gradient }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
      <p
        className={`text-2xl font-extrabold mb-1 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {value}
      </p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}
