from typing import List, Dict, Any, Optional
from models.schemas import SourceItem, ActionItem, DailyBrief, QAResponse, CalendarEvent
from agents.ingestion import ingest_sources, load_calendars, load_people
from agents.commitment_extractor import extract_evidence_from_sources
from agents.deduplicator import build_deduplicated_actions
from agents.status_engine import evaluate_actions_for_date
from agents.brief_generator import generate_daily_brief
from agents.qa_agent import answer_question

class ExecutiveAgentDB:
    def __init__(self):
        self.sources: List[SourceItem] = []
        self.raw_actions: List[Dict[str, Any]] = []
        self.people = []
        self.calendars = {}
        self.rebuild()

    def rebuild(self):
        """Re-triggers ingestion, extraction, deduplication, and reasoning pipeline."""
        self.people = load_people()
        self.calendars = load_calendars()
        self.sources = ingest_sources()
        evidence_map = extract_evidence_from_sources(self.sources)
        self.raw_actions = build_deduplicated_actions(evidence_map)

    def get_actions(self, sim_date: str = "2026-09-24") -> List[ActionItem]:
        return evaluate_actions_for_date(self.raw_actions, sim_date)

    def get_my_actions(self, sim_date: str = "2026-09-24") -> List[ActionItem]:
        actions = self.get_actions(sim_date)
        return [a for a in actions if a.owner == "Arjun Malhotra" and a.status != "Completed"]

    def get_waiting_actions(self, sim_date: str = "2026-09-24") -> List[ActionItem]:
        actions = self.get_actions(sim_date)
        return [a for a in actions if a.status == "Waiting on Others"]

    def get_unresolved_actions(self, sim_date: str = "2026-09-24") -> List[ActionItem]:
        actions = self.get_actions(sim_date)
        return [a for a in actions if a.status == "Unclear Ownership"]

    def get_overdue_actions(self, sim_date: str = "2026-09-24") -> List[ActionItem]:
        actions = self.get_actions(sim_date)
        return [a for a in actions if a.status == "Overdue"]

    def get_brief(self, sim_date: str = "2026-09-24") -> DailyBrief:
        actions = self.get_actions(sim_date)
        return generate_daily_brief(sim_date, actions)

    def get_sources() -> List[SourceItem]:
        return self.sources

    def get_calendar(self, sim_date: str = "2026-09-24") -> List[CalendarEvent]:
        arjun_events = self.calendars.get("Arjun Malhotra", [])
        return [e for e in arjun_events if e.date == sim_date]

    def ask(self, query: str, sim_date: str = "2026-09-24") -> QAResponse:
        actions = self.get_actions(sim_date)
        return answer_question(query, sim_date, actions)

    def get_evidence(self, action_id: str, sim_date: str = "2026-09-24") -> Optional[ActionItem]:
        actions = self.get_actions(sim_date)
        return next((a for a in actions if a.id == action_id), None)

# Global singleton database instance
db = ExecutiveAgentDB()
