import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, CheckCircle2, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { askAgent } from '../services/api';

const SUGGESTED_QUESTIONS = [
  "What did I promise Raghav?",
  "What needs action today?",
  "What am I waiting on?",
  "What is overdue?",
  "What's due before board prep?",
  "What happened with the Meridian call?",
  "What's the status of the campaign deck?",
  "Tell me everything I need to know about the Mumbai lease."
];

export default function QAPanel({ simulationDate, onOpenEvidence }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: `Hello Arjun. I am your Executive Co-Pilot. Ask me anything about your commitments, deliverables, deadlines, or unresolved items for ${simulationDate}.`,
      sources: [],
      related: []
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (questionToAsk) => {
    const textToSubmit = questionToAsk || query;
    if (!textToSubmit.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSubmit };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionToAsk) setQuery('');
    setIsLoading(true);

    try {
      const response = await askAgent(textToSubmit, simulationDate);
      const agentMsg = {
        sender: 'agent',
        text: response.answer,
        sources: response.sources || [],
        related: response.related_actions || []
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: "I encountered an error retrieving grounded information. Please try asking again.",
          sources: [],
          related: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-2xl mb-12">
      
      {/* Title Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Ask Executive Agent
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Grounded AI Engine
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Conversational Q&A grounded strictly in assignment transcripts, emails, calendar & voice notes.
          </p>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Suggested Questions:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded-full bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 border border-slate-700/80 transition"
            >
              • {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Source Evidence Pills */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="text-[10px] font-semibold text-slate-400 mb-1">
                    Verified Source Citations:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.sources.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20"
                      >
                        📍 {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Action Highlights */}
              {m.related && m.related.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.related.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onOpenEvidence(rel)}
                      className="text-[10px] font-semibold text-sky-400 hover:underline flex items-center gap-1 bg-slate-800 px-2 py-1 rounded"
                    >
                      <FileText className="w-3 h-3" />
                      View {rel.title} Evidence →
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
            Analyzing source transcripts and temporal deadlines...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about commitments, promises, deadlines or unresolved items..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>

    </div>
  );
}
