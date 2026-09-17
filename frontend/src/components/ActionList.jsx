import React, { useState } from 'react';
import ActionCard from './ActionCard';
import { CheckSquare, UserCheck, Clock, ShieldAlert, AlertTriangle, Layers } from 'lucide-react';

export default function ActionList({ actions, onOpenEvidence }) {
  const [activeTab, setActiveTab] = useState('all');

  const myActions = actions.filter((a) => a.owner === 'Arjun Malhotra' && a.status !== 'Completed');
  const waitingActions = actions.filter((a) => a.status === 'Waiting on Others');
  const unclearActions = actions.filter((a) => a.status === 'Unclear Ownership');
  const overdueActions = actions.filter((a) => a.status === 'Overdue');
  const completedActions = actions.filter((a) => a.status === 'Completed');

  const getFilteredActions = () => {
    switch (activeTab) {
      case 'my_actions':
        return myActions;
      case 'waiting':
        return waitingActions;
      case 'unclear':
        return unclearActions;
      case 'overdue':
        return overdueActions;
      case 'completed':
        return completedActions;
      default:
        return actions;
    }
  };

  const filtered = getFilteredActions();

  return (
    <div className="mb-10">
      
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-3 mb-6">
        
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          All Commitments ({actions.length})
        </button>

        <button
          onClick={() => setActiveTab('my_actions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'my_actions'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          My Actions ({myActions.length})
        </button>

        <button
          onClick={() => setActiveTab('waiting')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'waiting'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Waiting on Others ({waitingActions.length})
        </button>

        <button
          onClick={() => setActiveTab('unclear')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'unclear'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Unclear Ownership ({unclearActions.length})
        </button>

        {overdueActions.length > 0 && (
          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === 'overdue'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-900/80 text-rose-400 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue ({overdueActions.length})
          </button>
        )}

      </div>

      {/* Grid of Action Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onOpenEvidence={onOpenEvidence}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
          No items found under this category for the selected simulation date.
        </div>
      )}

    </div>
  );
}
