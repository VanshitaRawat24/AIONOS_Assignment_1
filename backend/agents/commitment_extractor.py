from typing import List, Dict, Any
from models.schemas import SourceItem, EvidenceItem

def extract_evidence_from_sources(sources: List[SourceItem]) -> Dict[str, List[EvidenceItem]]:
    """
    Groups raw evidence items by underlying canonical action topic.
    """
    evidence_map: Dict[str, List[EvidenceItem]] = {
        "vendor-list": [],
        "meridian-call": [],
        "campaign-deck": [],
        "expense-report": [],
        "mumbai-lease": []
    }

    for s in sources:
        content_lower = s.content.lower()
        topic_lower = s.related_topic.lower()

        # Vendor list
        if "vendor" in content_lower or "vendor" in topic_lower:
            evidence_map["vendor-list"].append(EvidenceItem(
                source_id=s.id,
                source_type=s.source_type,
                timestamp=s.timestamp,
                title=f"{s.source_type.replace('_', ' ').title()} - {s.sender}",
                snippet=s.content,
                impact="Vendor list deadline tracking & commitment evidence"
            ))

        # Meridian call
        if "meridian" in content_lower or "meridian" in topic_lower or "call reschedule" in topic_lower:
            evidence_map["meridian-call"].append(EvidenceItem(
                source_id=s.id,
                source_type=s.source_type,
                timestamp=s.timestamp,
                title=f"{s.source_type.replace('_', ' ').title()} - {s.sender}",
                snippet=s.content,
                impact="Call rescheduling & confirmation evidence"
            ))

        # Campaign deck
        if "campaign" in content_lower or "deck" in content_lower or "deck" in topic_lower:
            evidence_map["campaign-deck"].append(EvidenceItem(
                source_id=s.id,
                source_type=s.source_type,
                timestamp=s.timestamp,
                title=f"{s.source_type.replace('_', ' ').title()} - {s.sender}",
                snippet=s.content,
                impact="Q3 Campaign deck delivery timeline evidence"
            ))

        # Expense report
        if "expense" in content_lower or "variance" in content_lower or "expense" in topic_lower:
            evidence_map["expense-report"].append(EvidenceItem(
                source_id=s.id,
                source_type=s.source_type,
                timestamp=s.timestamp,
                title=f"{s.source_type.replace('_', ' ').title()} - {s.sender}",
                snippet=s.content,
                impact="July expense variance report timeline & delivery evidence"
            ))

        # Mumbai lease
        if "mumbai" in content_lower or "lease" in content_lower or "lease" in topic_lower:
            evidence_map["mumbai-lease"].append(EvidenceItem(
                source_id=s.id,
                source_type=s.source_type,
                timestamp=s.timestamp,
                title=f"{s.source_type.replace('_', ' ').title()} - {s.sender}",
                snippet=s.content,
                impact="Mumbai lease renewal sign-off & ownership query evidence"
            ))

    return evidence_map
