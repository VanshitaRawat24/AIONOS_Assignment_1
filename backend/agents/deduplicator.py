from typing import List, Dict, Any
from models.schemas import EvidenceItem, ActionItem
from agents.ownership_detector import evaluate_ownership

def build_deduplicated_actions(evidence_map: Dict[str, List[EvidenceItem]]) -> List[Dict[str, Any]]:
    """
    Combines cross-source evidence into 5 canonical deduplicated action payloads.
    """
    raw_actions = [
        {
            "id": "vendor-list",
            "title": "Send Updated Vendor List",
            "description": "Send the updated vendor list to Raghav Sethi (Ops Manager).",
            "owner": "Arjun Malhotra",
            "requester": "Raghav Sethi",
            "category": "Commitment",
            "initial_deadline": "Tuesday 22 Sep EOD",
            "current_deadline": "Wednesday 23 Sep 9:00 AM",
            "deadline_date": "2026-09-23",
            "completed_at": None,
            "sources_summary": ["Leadership Sync", "Vendor List Email Thread (5 messages)", "Voice Note 1"]
        },
        {
            "id": "meridian-call",
            "title": "Reconfirm & Lock Meridian Logistics Call",
            "description": "Reconfirm and lock call time with Priya Nair (Meridian Logistics).",
            "owner": "Arjun Malhotra",
            "requester": "Priya Nair",
            "category": "Meeting",
            "initial_deadline": "Propose time (Tue-Thu afternoons)",
            "current_deadline": "Wednesday 23 Sep 3:00 PM (Confirmed)",
            "deadline_date": "2026-09-23",
            "completed_at": "2026-09-22T17:45:00",
            "sources_summary": ["Leadership Sync", "Call Reschedule Email Thread (5 messages)", "Voice Note 2", "Calendar Event"]
        },
        {
            "id": "campaign-deck",
            "title": "Review Q3 Campaign Deck",
            "description": "Receive and review Q3 Campaign Deck draft from Neha Kapoor (Marketing Lead).",
            "owner": "Neha Kapoor",
            "requester": "Arjun Malhotra",
            "category": "Waiting",
            "initial_deadline": "Wednesday 23 Sep",
            "current_deadline": "Thursday 24 Sep 9:30 AM",
            "deadline_date": "2026-09-24",
            "completed_at": "2026-09-24T08:00:00",
            "sources_summary": ["Leadership Sync", "Q3 Campaign Deck Email Thread (5 messages)", "Calendar Event"]
        },
        {
            "id": "expense-report",
            "title": "July Expense Variance Report",
            "description": "Receive July Expense Variance Report from Divya Rao (Finance) prior to Thursday board prep.",
            "owner": "Divya Rao",
            "requester": "Arjun Malhotra",
            "category": "Waiting",
            "initial_deadline": "Thursday 24 Sep morning",
            "current_deadline": "Wednesday 23 Sep evening (6:00 PM)",
            "deadline_date": "2026-09-23",
            "completed_at": "2026-09-23T18:00:00",
            "sources_summary": ["Leadership Sync", "Expense Variance Report Email Thread (5 messages)", "Voice Note 2"]
        },
        {
            "id": "mumbai-lease",
            "title": "Mumbai Office Lease Renewal Sign-off",
            "description": "Authorized sign-off required for Mumbai office lease renewal paperwork.",
            "owner": "Unclear ownership",
            "requester": "Facilities / Raghav Sethi",
            "category": "Unresolved",
            "initial_deadline": "Friday 25 Sep EOD",
            "current_deadline": "Friday 25 Sep EOD",
            "deadline_date": "2026-09-25",
            "completed_at": None,
            "sources_summary": ["Leadership Sync", "Mumbai Lease Renewal Email Thread (5 messages)", "Voice Note 1"]
        }
    ]

    actions = []
    for ra in raw_actions:
        action_id = ra["id"]
        evidences = evidence_map.get(action_id, [])
        source_ids = [e.source_id for e in evidences]
        
        owner, ownership_status, ownership_notes = evaluate_ownership(ra["title"], [])
        
        actions.append({
            **ra,
            "owner": owner,
            "ownership_status": ownership_status,
            "ownership_notes": ownership_notes,
            "source_ids": source_ids,
            "evidence_chain": evidences
        })

    return actions
