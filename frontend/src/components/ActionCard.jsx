import React from 'react';
import { UserCheck, UserX, Clock, AlertTriangle, CheckCircle2, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

export default function ActionCard({ action, onOpenEvidence }) {
  const getStatusBadge = (status, ownershipStatus) => {
    if (ownershipStatus === 'Unclear Ownership') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <ShieldAlert className="w-3.5 h-3.5" />
          Unclear Ownership
        </span>
      );
    }
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue
          </span>
        );
      case 'Waiting on Others':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Clock className="w-3.5 h-3.5" />
            Waiting on Others
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Clock className="w-3.5 h-3.5" />
            Open Action
          </span>
        );
    }
  };

  const isArjun = action.owner === 'Arjun Malhotra';
  const isUnclear = action.ownership_status === 'Unclear Ownership';

  return (
    <div className={`glass-card rounded-xl p-5 transition duration-200 flex flex-col justify-between ${
      isUnclear ? 'border-amber-500/40 bg-amber-950/10' : ''
    }`}>
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {getStatusBadge(action.status, action.ownership_status)}
          <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            {action.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 mb-1.5 leading-snug">
          {action.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
          {action.description}
        </p>
      </div>

      <div>
        {/* Metadata Details */}
        <div className="space-y-2 border-t border-slate-800/80 pt-3 mb-4 text-xs">
          
          {/* Owner */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              {isArjun ? <UserCheck className="w-3.5 h-3.5 text-sky-400" /> : <UserX className="w-3.5 h-3.5 text-amber-400" />}
              Owner:
            </span>
            <span className={`font-semibold ${
              isUnclear ? 'text-amber-400 font-bold' : isArjun ? 'text-sky-300' : 'text-slate-200'
            }`}>
              {action.owner}
            </span>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Deadline:
            </span>
            <span className={`font-medium ${action.status === 'Overdue' ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
              {action.current_deadline}
            </span>
          </div>

          {/* Unclear Ownership warning note */}
          {isUnclear && (
            <div className="p-2 rounded bg-amber-500/10 text-amber-300 text-[11px] leading-tight border border-amber-500/20 mt-1">
              ⚠️ {action.ownership_notes}
            </div>
          )}

          {/* Sources Summary Pill */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Sources ({action.sources_summary.length}):</span>
            <span className="font-mono text-slate-300 truncate max-w-[180px]">
              {action.sources_summary.join(' + ')}
            </span>
          </div>

        </div>

        {/* Action / Evidence Button */}
        <button
          onClick={() => onOpenEvidence(action)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span>Why? / View Evidence ({action.evidence_chain.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
