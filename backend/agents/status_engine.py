from typing import List, Dict, Any
from models.schemas import ActionItem

def evaluate_actions_for_date(actions: List[Dict[str, Any]], sim_date: str) -> List[ActionItem]:
    """
    Evaluates actions given a simulation_date string (YYYY-MM-DD, e.g., '2026-09-24').
    Dynamically computes status: Open, Completed, Waiting on Others, Overdue, Unclear Ownership.
    """
    evaluated_items: List[ActionItem] = []

    for a in actions:
        action_id = a["id"]
        owner = a["owner"]
        ownership_status = a["ownership_status"]
        deadline_date = a["deadline_date"]
        completed_at = a.get("completed_at")

        # Determine status dynamically based on sim_date
        computed_status = "Open"

        if ownership_status == "Unclear Ownership":
            computed_status = "Unclear Ownership"
        elif completed_at and completed_at[:10] <= sim_date:
            computed_status = "Completed"
        elif deadline_date < sim_date:
            # Deadline passed before simulation date and not completed
            computed_status = "Overdue"
        elif owner != "Arjun Malhotra" and owner != "Unclear ownership":
            # Belonging to someone else, not completed yet on this sim_date
            computed_status = "Waiting on Others"
        else:
            computed_status = "Open"

        # Create copy with computed status
        item = ActionItem(
            id=a["id"],
            title=a["title"],
            description=a["description"],
            owner=a["owner"],
            requester=a.get("requester"),
            status=computed_status,
            ownership_status=a["ownership_status"],
            ownership_notes=a.get("ownership_notes"),
            category=a["category"],
            initial_deadline=a["initial_deadline"],
            current_deadline=a["current_deadline"],
            deadline_date=a.get("deadline_date"),
            completed_at=a.get("completed_at"),
            source_ids=a.get("source_ids", []),
            sources_summary=a.get("sources_summary", []),
            evidence_chain=a.get("evidence_chain", []),
            confidence=0.98 if ownership_status == "Confirmed" else 0.85
        )
        evaluated_items.append(item)

    return evaluated_items
