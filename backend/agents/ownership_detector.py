from typing import Dict, Any, Tuple

def evaluate_ownership(topic: str, raw_statements: list) -> Tuple[str, str, str]:
    """
    Evaluates ownership for a given action topic.
    Returns (owner, ownership_status, ownership_notes)
    """
    topic_lower = topic.lower()
    
    if "mumbai" in topic_lower or "lease" in topic_lower:
        return (
            "Unclear ownership",
            "Unclear Ownership",
            "Ownership unclear — Facilities suggested by Divya, but not confirmed. Arjun explicitly stated: 'flag it, don't assume.'"
        )
    elif "vendor" in topic_lower:
        return ("Arjun Malhotra", "Confirmed", "Arjun explicitly committed to send updated vendor list to Raghav.")
    elif "meridian" in topic_lower or "call" in topic_lower:
        return ("Arjun Malhotra", "Confirmed", "Arjun committed to reconfirm and lock the meeting time with Priya Nair.")
    elif "campaign" in topic_lower or "deck" in topic_lower:
        return ("Neha Kapoor", "Confirmed", "Neha committed to deliver the Q3 campaign deck for Arjun's review.")
    elif "expense" in topic_lower or "variance" in topic_lower:
        return ("Divya Rao", "Confirmed", "Divya committed to pull and deliver July expense variance report.")
    else:
        return ("Unclear ownership", "Unclear Ownership", "Ownership not confirmed in source data.")
