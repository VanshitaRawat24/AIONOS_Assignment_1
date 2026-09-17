import React from 'react';
import { Bot, User, Building2, Sparkles, RefreshCw } from 'lucide-react';

export default function Header({ onRebuild, isRebuilding }) {
  return (
    <header className="glass-panel sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Executive Productivity Agent</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AIONOS Assignment 1
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Veridian Corp • VP Sales AI Co-Pilot
            </p>
          </div>
        </div>

        {/* Right User Badge & Rebuild Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onRebuild}
            disabled={isRebuilding}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Re-run reasoning and deduplication pipeline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRebuilding ? 'animate-spin' : ''}`} />
            {isRebuilding ? 'Rebuilding...' : 'Re-index Sources'}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 font-semibold border border-slate-700">
              AM
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-200">Arjun Malhotra</div>
              <div className="text-xs text-slate-400">VP Sales • Executive</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
