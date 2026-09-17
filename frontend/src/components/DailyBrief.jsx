import React from 'react';
import { Sparkles, Calendar, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DailyBrief({ brief, onOpenEvidence }) {
  if (!brief) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-sky-500/20 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 shadow-2xl">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            Executive Daily Brief • {brief.simulation_date}
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {brief.greeting}
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
            {brief.summary_text}
          </p>
        </div>

        {/* Quick KPI Count Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center min-w-[70px]">
            <div className="text-xs text-slate-400">My Actions</div>
            <div className="text-lg font-bold text-sky-400">{brief.my_actions.length}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center min-w-[70px]">
            <div className="text-xs text-slate-400">Waiting</div>
            <div className="text-lg font-bold text-indigo-400">{brief.waiting_on_others.length}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center min-w-[70px]">
            <div className="text-xs text-slate-400">Unclear</div>
            <div className="text-lg font-bold text-amber-400">{brief.unclear_ownership.length}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center min-w-[70px]">
            <div className="text-xs text-slate-400">Overdue</div>
            <div className="text-lg font-bold text-rose-400">{brief.overdue_items.length}</div>
          </div>
        </div>
      </div>

      {/* Priority Focus Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Card 1: Today's Priority Actions */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
              <Clock className="w-4 h-4" />
              PRIORITY ACTIONS
            </div>
            {brief.priority_actions.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {brief.priority_actions.slice(0, 3).map((item) => (
                  <li key={item.id} className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400">Due: {item.current_deadline}</div>
                    </div>
                    <button
                      onClick={() => onOpenEvidence(item)}
                      className="text-[10px] text-sky-400 hover:underline px-2 py-1 rounded bg-sky-500/10"
                    >
                      Context
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-slate-400">No urgent priority actions required today.</div>
            )}
          </div>
        </div>

        {/* Card 2: Today's Schedule */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
              <Calendar className="w-4 h-4" />
              TODAY'S CALENDAR ({brief.today_meetings.length})
            </div>
            {brief.today_meetings.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {brief.today_meetings.map((m, idx) => (
                  <li key={idx} className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-200">{m.title}</div>
                      <div className="text-[11px] text-slate-400">{m.start_time} – {m.end_time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-slate-400">No scheduled meetings on this simulation date.</div>
            )}
          </div>
        </div>

        {/* Card 3: Watchlist / Unresolved */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              WATCH & UNRESOLVED
            </div>
            {brief.unclear_ownership.length > 0 ? (
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="font-bold text-amber-300 mb-1">
                  ⚠️ {brief.unclear_ownership[0].title}
                </div>
                <div className="text-[11px] text-amber-200/80 mb-2">
                  Ownership is unconfirmed. Deadline: {brief.unclear_ownership[0].current_deadline}
                </div>
                <button
                  onClick={() => onOpenEvidence(brief.unclear_ownership[0])}
                  className="text-[10px] font-semibold text-amber-300 underline"
                >
                  Investigate Ownership Evidence →
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400">All task ownerships are confirmed.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
