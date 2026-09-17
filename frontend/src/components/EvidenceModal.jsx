import React from 'react';
import { X, FileText, UserCheck, Clock, ShieldAlert, GitBranch, AlertCircle, ArrowRight } from 'lucide-react';

export default function EvidenceModal({ action, onClose }) {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="glass-panel w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">
                Provenance Audit Log & Evidence Chain
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {action.title}
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Summary Details */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-slate-400 mb-0.5">Assigned Owner:</div>
              <div className={`font-bold text-sm ${
                action.ownership_status === 'Unclear Ownership' ? 'text-amber-400' : 'text-sky-300'
              }`}>
                {action.owner}
              </div>
            </div>

            <div>
              <div className="text-slate-400 mb-0.5">Current Status:</div>
              <div className="font-bold text-sm text-slate-200">
                {action.status}
              </div>
            </div>

            <div>
              <div className="text-slate-400 mb-0.5">Deadline Timeline:</div>
              <div className="font-medium text-slate-300">
                Initial: <span className="line-through text-slate-500">{action.initial_deadline}</span>
                <br />
                Current: <span className="text-emerald-400 font-bold">{action.current_deadline}</span>
              </div>
            </div>
          </div>

          {/* Unclear Ownership Special Explanation */}
          {action.ownership_status === 'Unclear Ownership' && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Ownership Reasoning Engine Flag
              </div>
              <p className="text-amber-200/90 leading-relaxed mb-2">
                {action.ownership_notes}
              </p>
              <div className="text-[11px] text-amber-300/70 font-mono">
                Rule Applied: "If ownership is unclear, explicitly mark as 'Unclear ownership' rather than making an assumption."
              </div>
            </div>
          )}

          {/* Source Provenance List */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-sky-400" />
              Cross-Source Deduplicated Inputs ({action.sources_summary.length})
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {action.sources_summary.map((src, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-sky-300 border border-slate-700">
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Evidence Chain Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Chronological Evidence Chain ({action.evidence_chain.length} events)
            </h3>
            
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {action.evidence_chain.map((item, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-2 top-2.5 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-slate-900" />
                  
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-200">{item.title}</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {item.timestamp.replace('T', ' ')}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 text-slate-300 font-mono text-[11px] my-2 border border-slate-800/80 leading-relaxed">
                      "{item.snippet}"
                    </div>

                    <div className="text-[11px] text-sky-400 font-medium">
                      💡 Reasoning Impact: {item.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition"
          >
            Close Audit Log
          </button>
        </div>

      </div>
    </div>
  );
}
