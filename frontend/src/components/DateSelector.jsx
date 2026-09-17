import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

const DATES = [
  { value: '2026-09-21', label: 'Mon 21 Sep' },
  { value: '2026-09-22', label: 'Tue 22 Sep' },
  { value: '2026-09-23', label: 'Wed 23 Sep' },
  { value: '2026-09-24', label: 'Thu 24 Sep (Default)' },
  { value: '2026-09-25', label: 'Fri 25 Sep' },
];

export default function DateSelector({ selectedDate, onDateChange }) {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Date Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            Simulation Date:
          </div>
          {DATES.map((d) => {
            const isSelected = selectedDate === d.value;
            return (
              <button
                key={d.value}
                onClick={() => onDateChange(d.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Required Disclaimer Badge */}
        <div className="flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Simulation date — based on assignment data</span>
        </div>

      </div>
    </div>
  );
}
