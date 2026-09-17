import React from 'react';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';

export default function CalendarTimeline({ events, simulationDate }) {
  return (
    <div className="glass-card rounded-2xl p-5 mb-8 border border-slate-800">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Calendar Schedule — {simulationDate}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Arjun Malhotra</span>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {events.map((event, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  {event.start_time} – {event.end_time}
                </div>
                <div className="text-sm font-semibold text-slate-100 mb-2">
                  {event.title}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Users className="w-3 h-3 text-slate-500" />
                <span className="truncate">{event.attendees.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-slate-400 py-3 text-center">
          No calendar meetings scheduled on this simulation date.
        </div>
      )}
    </div>
  );
}
