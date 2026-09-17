import json
from pathlib import Path
from typing import List, Dict, Any
from models.schemas import SourceItem, Person, CalendarEvent

DATA_DIR = Path(__file__).parent.parent / "data"

def load_people() -> List[Person]:
    with open(DATA_DIR / "people.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return [Person(**p) for p in data]

def load_calendars() -> Dict[str, List[CalendarEvent]]:
    with open(DATA_DIR / "calendars.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    result = {}
    for person, events in data.items():
        result[person] = [CalendarEvent(**e) for e in events]
    return result

def ingest_sources() -> List[SourceItem]:
    sources: List[SourceItem] = []

    # Ingest Meetings
    with open(DATA_DIR / "meetings.json", "r", encoding="utf-8") as f:
        meetings = json.load(f)
    for m in meetings:
        for idx, stmt in enumerate(m["statements"]):
            sources.append(SourceItem(
                id=f"{m['id']}-stmt-{idx+1}",
                source_type="meeting",
                timestamp=m["timestamp"],
                sender=stmt["speaker"],
                recipient="Leadership Sync Attendees",
                content=stmt["content"],
                related_topic=m["title"]
            ))

    # Ingest Email Threads
    with open(DATA_DIR / "emails.json", "r", encoding="utf-8") as f:
        email_threads = json.load(f)
    for thread in email_threads:
        topic = thread["topic"]
        for msg in thread["messages"]:
            sources.append(SourceItem(
                id=msg["id"],
                source_type="email",
                timestamp=msg["timestamp"],
                sender=msg["sender"],
                recipient=", ".join(msg["recipients"]),
                content=msg["content"],
                related_topic=topic
            ))

    # Ingest Voice Notes
    with open(DATA_DIR / "voice_notes.json", "r", encoding="utf-8") as f:
        voice_notes = json.load(f)
    for vn in voice_notes:
        sources.append(SourceItem(
            id=vn["id"],
            source_type="voice_note",
            timestamp=vn["timestamp"],
            sender=vn["speaker"],
            recipient="Self (Arjun Malhotra)",
            content=vn["transcript"],
            related_topic=vn["title"]
        ))

    # Ingest Calendar Events
    calendars = load_calendars()
    for person, events in calendars.items():
        if person == "Arjun Malhotra":
            for e in events:
                sources.append(SourceItem(
                    id=f"cal-{e.date}-{e.start_time}",
                    source_type="calendar",
                    timestamp=f"{e.date}T{e.start_time}:00",
                    sender="Calendar System",
                    recipient=person,
                    content=f"Calendar Event: {e.title} ({e.start_time}–{e.end_time})",
                    related_topic=e.title
                ))

    return sources
