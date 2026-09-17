from typing import List, Optional, Any
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str
    role: str
    email: str
    is_user: bool = False
    organization: str

class SourceItem(BaseModel):
    id: str
    source_type: str  # meeting, email, voice_note, calendar
    timestamp: str
    sender: str
    recipient: Optional[str] = None
    content: str
    related_topic: str

class EvidenceItem(BaseModel):
    source_id: str
    source_type: str
    timestamp: str
    title: str
    snippet: str
    impact: str

class ActionItem(BaseModel):
    id: str
    title: str
    description: str
    owner: Optional[str] = None
    requester: Optional[str] = None
    status: str  # Open, Completed, Waiting on Others, Overdue, Unclear Ownership
    ownership_status: str  # Confirmed, Unclear Ownership
    ownership_notes: Optional[str] = None
    category: str  # Commitment, Follow-up, Meeting, Deadline, Waiting, Unresolved
    initial_deadline: str
    current_deadline: str
    deadline_date: Optional[str] = None # ISO format date string e.g., "2026-09-23"
    completed_at: Optional[str] = None
    source_ids: List[str] = []
    sources_summary: List[str] = []
    evidence_chain: List[EvidenceItem] = []
    confidence: float = 0.95

class CalendarEvent(BaseModel):
    date: str
    start_time: str
    end_time: str
    title: str
    attendees: List[str]

class DailyBrief(BaseModel):
    simulation_date: str
    greeting: str
    summary_text: str
    priority_actions: List[ActionItem]
    my_actions: List[ActionItem]
    waiting_on_others: List[ActionItem]
    unclear_ownership: List[ActionItem]
    overdue_items: List[ActionItem]
    recently_completed: List[ActionItem]
    today_meetings: List[CalendarEvent]

class QARequest(BaseModel):
    query: str
    simulation_date: str = "2026-09-24"

class QAResponse(BaseModel):
    query: str
    simulation_date: str
    answer: str
    sources: List[str]
    evidence: List[EvidenceItem]
    related_actions: List[ActionItem]
