import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import DailyBrief from './components/DailyBrief';
import ActionList from './components/ActionList';
import CalendarTimeline from './components/CalendarTimeline';
import QAPanel from './components/QAPanel';
import EvidenceModal from './components/EvidenceModal';
import { fetchDailyBrief, fetchActions, fetchCalendar } from './services/api';
import { RefreshCw, Database } from 'lucide-react';

export default function App() {
  const [simulationDate, setSimulationDate] = useState('2026-09-24');
  const [brief, setBrief] = useState(null);
  const [actions, setActions] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedActionForEvidence, setSelectedActionForEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRebuilding, setIsRebuilding] = useState(false);

  // Load data whenever simulationDate changes
  const loadDashboardData = async (date) => {
    setIsLoading(true);
    try {
      const [briefData, actionsData, calData] = await Promise.all([
        fetchDailyBrief(date),
        fetchActions(date),
        fetchCalendar(date)
      ]);
      setBrief(briefData);
      setActions(actionsData);
      setCalendarEvents(calData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(simulationDate);
  }, [simulationDate]);

  const handleRebuild = async () => {
    setIsRebuilding(true);
    try {
      await fetch('http://localhost:8000/api/rebuild', { method: 'POST' });
      await loadDashboardData(simulationDate);
    } catch (err) {
      console.error("Error rebuilding pipeline:", err);
    } finally {
      setIsRebuilding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header onRebuild={handleRebuild} isRebuilding={isRebuilding} />

      {/* Simulation Date Selector Bar */}
      <DateSelector
        selectedDate={simulationDate}
        onDateChange={(newDate) => setSimulationDate(newDate)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mb-3" />
            <div className="text-sm font-semibold text-slate-200">
              Ingesting messy sources & computing temporal status for {simulationDate}...
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Deduplicating meetings, email threads, calendar events & voice notes
            </div>
          </div>
        ) : (
          <>
            {/* Daily Brief Section */}
            <DailyBrief
              brief={brief}
              onOpenEvidence={(act) => setSelectedActionForEvidence(act)}
            />

            {/* Calendar Timeline Section */}
            <CalendarTimeline
              events={calendarEvents}
              simulationDate={simulationDate}
            />

            {/* Main Action Items Grid & Tabs */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-400" />
                Executive Commitments & Action Tracking
              </h2>
              <ActionList
                actions={actions}
                onOpenEvidence={(act) => setSelectedActionForEvidence(act)}
              />
            </div>

            {/* Conversational Q&A Panel */}
            <QAPanel
              simulationDate={simulationDate}
              onOpenEvidence={(act) => setSelectedActionForEvidence(act)}
            />
          </>
        )}

      </main>

      {/* Evidence Modal Drawer */}
      {selectedActionForEvidence && (
        <EvidenceModal
          action={selectedActionForEvidence}
          onClose={() => setSelectedActionForEvidence(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            AIONOS Assignment 1 • Executive Productivity Agent Prototype
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Strict Grounding • Zero Hallucinations • Deduplicated Provenance
          </div>
        </div>
      </footer>

    </div>
  );
}
