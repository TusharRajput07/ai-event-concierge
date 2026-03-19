import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://ai-event-concierge-server.onrender.com";

function LoadingState() {
  const steps = [
    "Analyzing your event requirements...",
    "Searching for perfect venues...",
    "Crafting your proposal...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setStep((s) => (s + 1) % steps.length),
      1500,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-sky-400"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-sky-300 text-lg font-medium tracking-wide">
        {steps[step]}
      </p>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>
    </div>
  );
}

function ProposalCard({ proposal, isNew }) {
  return (
    <div
      className={`fade-up rounded-2xl p-5 sm:p-6 mb-4 border transition-all duration-300 ${
        isNew
          ? "bg-gray-800 border-sky-400 shadow-lg shadow-sky-900/30"
          : "bg-gray-800/60 border-gray-700 hover:border-gray-500"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            {proposal.venue_name}
          </h3>
          <p className="text-sky-400 text-sm flex items-center gap-1">
            📍 {proposal.location}
          </p>
        </div>
        <div className="bg-sky-900/40 border border-sky-500/40 rounded-xl px-4 py-3 text-center sm:text-right w-fit">
          <p className="text-sky-300 font-bold text-base">
            {proposal.estimated_cost}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">estimated cost</p>
        </div>
      </div>

      <div className="bg-gray-900/60 rounded-xl p-4 border-l-4 border-sky-500">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
          Why it fits
        </p>
        <p className="text-gray-200 text-sm leading-relaxed">
          {proposal.why_it_fits}
        </p>
      </div>

      {proposal.user_query && (
        <p className="text-gray-500 text-xs mt-4 italic">
          "{proposal.user_query}"
        </p>
      )}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/api/history`);
      setHistory(res.data);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setCurrent(null);

    try {
      const res = await axios.post(`${API}/api/propose`, { query });
      setCurrent({ ...res.data, user_query: query });
      setQuery("");
      await fetchHistory();
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-700/60 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-sm flex-shrink-0">
            ✦
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">
              Event Concierge
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              AI-powered corporate event planning
            </p>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-sky-900/30 border border-sky-700/40 rounded-full px-4 py-1.5 text-sky-400 text-xs font-medium mb-6 uppercase tracking-widest">
            ✦ AI Venue Planner
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            Plan Your Perfect
            <span className="block text-sky-400">Corporate Event</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Describe your event in plain English and get an AI-curated venue
            proposal in seconds.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-10 sm:mb-14">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 focus-within:border-sky-500 transition-colors duration-300">
            <div className="flex items-center gap-3 flex-1 px-2">
              <span className="text-gray-400 text-lg flex-shrink-0">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g. "A 10-person leadership retreat in the mountains for 3 days with a $4k budget"'
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm py-3 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`w-full sm:w-auto flex-shrink-0 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                loading || !query.trim()
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-400 text-white cursor-pointer shadow-lg shadow-sky-900/40"
              }`}
            >
              {loading ? "Planning..." : "Find Venue →"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-3 pl-2">{error}</p>}
        </form>

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Current Proposal */}
        {current && !loading && (
          <div className="mb-10 sm:mb-12">
            <p className="text-sky-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span>✦</span> Your Proposal
            </p>
            <ProposalCard proposal={current} isNew={true} />
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <button
              onClick={() => setShowHistory((h) => !h)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 hover:border-sky-500/50 transition-all duration-200 mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs uppercase tracking-widest">
                  Previous Searches
                </span>
                <span className="bg-sky-900/50 text-sky-400 text-xs px-2 py-0.5 rounded-full">
                  {history.length}
                </span>
              </div>
              <span
                className="text-gray-400 text-sm transition-transform duration-200"
                style={{
                  transform: showHistory ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            {showHistory && (
              <div>
                {history.map((item) => (
                  <ProposalCard key={item.id} proposal={item} isNew={false} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !current && history.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-4">🏨</p>
            <p className="text-sm">Your venue proposals will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
