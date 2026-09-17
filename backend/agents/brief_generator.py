from typing import List, Dict
from models.schemas import ActionItem, DailyBrief, CalendarEvent
from agents.ingestion import load_calendars

def generate_daily_brief(sim_date: str, actions: List[ActionItem]) -> DailyBrief:
    """
    Generates a personalized executive daily brief for Arjun Malhotra for the given simulation date.
    """
    all_calendars = load_calendars()
    arjun_events = all_calendars.get("Arjun Malhotra", [])
    today_meetings = [e for e in arjun_events if e.date == sim_date]

    my_actions = [a for a in actions if a.owner == "Arjun Malhotra" and a.status != "Completed"]
    waiting_on = [a for a in actions if a.status == "Waiting on Others"]
    unclear = [a for a in actions if a.status == "Unclear Ownership"]
    overdue = [a for a in actions if a.status == "Overdue"]
    completed = [a for a in actions if a.status == "Completed"]

    # Build date-specific dynamic summary
    if sim_date == "2026-09-21":
        summary = "Monday morning brief: You have 1 leadership sync at 9:00 AM. Key focus: confirm Q3 campaign deck timeline with Neha and clarify Mumbai office lease ownership."
    elif sim_date == "2026-09-22":
        summary = "Tuesday brief: You committed to send the updated vendor list to Raghav by today. Meridian call reschedule confirmed for Wednesday 3 PM. Budget review meeting at 11:00 AM."
    elif sim_date == "2026-09-23":
        summary = "Wednesday brief: Vendor list is due this morning to Raghav. Meridian call is confirmed for 3:00 PM today. Divya's expense variance report is expected by evening."
    elif sim_date == "2026-09-24":
        summary = "Thursday brief: Critical board prep session at 9:00 AM. Vendor list to Raghav is OVERDUE (was due Wed morning). Q3 Campaign deck from Neha received at 8:00 AM for 9:30 AM review. July expense report received Wed 6 PM. Mumbai lease sign-off remains UNOWNED (1 day before deadline)."
    elif sim_date == "2026-09-25":
        summary = "Friday brief: Mumbai lease renewal deadline is TODAY end of day, but ownership remains unresolved! Facilities check-in scheduled for 10:00 AM. Vendor list remains overdue."
    else:
        summary = f"Executive brief for {sim_date}: Review open commitments and unresolved items."

    # Priority actions: Overdue items + Unclear ownership + Urgent today items
    priority_actions = []
    priority_actions.extend(overdue)
    priority_actions.extend(unclear)
    for a in my_actions:
        if a not in priority_actions:
            priority_actions.append(a)

    return DailyBrief(
        simulation_date=sim_date,
        greeting="Good morning, Arjun.",
        summary_text=summary,
        priority_actions=priority_actions,
        my_actions=my_actions,
        waiting_on_others=waiting_on,
        unclear_ownership=unclear,
        overdue_items=overdue,
        recently_completed=completed,
        today_meetings=today_meetings
    )
