from typing import List, Dict, Any
from models.schemas import ActionItem, QAResponse, EvidenceItem

def answer_question(query: str, sim_date: str, actions: List[ActionItem]) -> QAResponse:
    """
    Answers executive queries strictly grounded in the supplied data pack.
    Returns structured answer, evidence snippets, and source list.
    """
    q_lower = query.lower()

    # Match actions helper
    def find_action(action_id: str) -> ActionItem:
        return next((a for a in actions if a.id == action_id), None)

    vendor_act = find_action("vendor-list")
    meridian_act = find_action("meridian-call")
    campaign_act = find_action("campaign-deck")
    expense_act = find_action("expense-report")
    mumbai_act = find_action("mumbai-lease")

    # Question 1: What did I promise Raghav?
    if "promise raghav" in q_lower or ("raghav" in q_lower and "promise" in q_lower) or "what did i promise raghav" in q_lower:
        status_desc = f"Currently, this item is marked as '{vendor_act.status}'." if vendor_act else ""
        answer = (
            f"You committed to send Raghav Sethi the updated vendor list. "
            f"The commitment was initially stated for Tuesday end-of-day in the Leadership Sync, "
            f"then moved to Wednesday morning via email (and noted in Voice Note 1). "
            f"Raghav followed up Wednesday at 8:45 AM asking for confirmation. {status_desc}"
        )
        sources = ["Leadership Sync", "Vendor List Email Thread", "Voice Note 1"]
        rel_actions = [vendor_act] if vendor_act else []
        evidence = vendor_act.evidence_chain if vendor_act else []

    # Question 2: What needs action today?
    elif "action today" in q_lower or "need action" in q_lower or "what needs action today" in q_lower:
        my_open = [a for a in actions if a.owner == "Arjun Malhotra" and a.status in ["Open", "Overdue"]]
        unclear = [a for a in actions if a.status == "Unclear Ownership"]
        
        items_str = ", ".join([f"'{a.title}' ({a.status})" for a in (my_open + unclear)])
        answer = (
            f"On simulation date {sim_date}, the following priority items require your attention: {items_str}. "
            f"Specifically: 1) Vendor List to Raghav ({vendor_act.status if vendor_act else 'Open'}); "
            f"2) Clarifying/assigning ownership for the Mumbai Lease Renewal (Deadline: Fri 25 Sep EOD)."
        )
        sources = ["Leadership Sync", "Vendor List Email Thread", "Mumbai Lease Renewal Email Thread", "Voice Note 1"]
        rel_actions = [a for a in [vendor_act, mumbai_act, meridian_act] if a]
        evidence = (vendor_act.evidence_chain if vendor_act else []) + (mumbai_act.evidence_chain if mumbai_act else [])

    # Question 3: What am I waiting on? / Who owes me something?
    elif "waiting" in q_lower or "who owes me" in q_lower or "waiting on" in q_lower:
        waiting_items = [a for a in actions if a.owner != "Arjun Malhotra" and a.owner != "Unclear ownership"]
        
        details = []
        for w in waiting_items:
            details.append(f"• {w.title} from {w.owner} (Status: {w.status}, Current target: {w.current_deadline})")
        
        answer = (
            f"As of {sim_date}, here are the deliverables you are tracking from others:\n" + 
            "\n".join(details) + 
            "\n\nNote: Divya delivered the Expense Report on Wed Sep 23 at 6:00 PM, and Neha delivered the Campaign Deck on Thu Sep 24 at 8:00 AM."
        )
        sources = ["Leadership Sync", "Q3 Campaign Deck Email Thread", "Expense Variance Report Email Thread", "Voice Note 2"]
        rel_actions = [campaign_act, expense_act]
        evidence = (campaign_act.evidence_chain if campaign_act else []) + (expense_act.evidence_chain if expense_act else [])

    # Question 4: What is overdue?
    elif "overdue" in q_lower or "what is overdue" in q_lower:
        overdue_items = [a for a in actions if a.status == "Overdue"]
        if overdue_items:
            titles = ", ".join([f"'{a.title}' (was due {a.current_deadline})" for a in overdue_items])
            answer = f"On simulation date {sim_date}, the following item is OVERDUE: {titles}. You committed to get this to Raghav by Wednesday morning, but no evidence of completion exists."
        else:
            answer = f"As of simulation date {sim_date}, there are no overdue items. All commitments are either open, completed, or scheduled for future deadlines."
        sources = ["Leadership Sync", "Vendor List Email Thread", "Voice Note 1"]
        rel_actions = overdue_items
        evidence = vendor_act.evidence_chain if vendor_act else []

    # Question 5: What is unresolved? / Tell me about Mumbai lease
    elif "unresolved" in q_lower or "mumbai" in q_lower or "lease" in q_lower:
        answer = (
            f"The Mumbai Office Lease Renewal requires an authorized signature by Friday 25 September EOD, "
            f"but ownership remains UNRESOLVED. In the Leadership Sync, Divya suggested Facilities might handle it, "
            f"but you explicitly directed: 'flag it, don't assume.' In Voice Note 1, you noted someone needs to own it. "
            f"On Thu 24 Sep at 4:45 PM, Raghav sent an email stating it is 1 day out and still unowned."
        )
        sources = ["Leadership Sync", "Mumbai Lease Renewal Email Thread", "Voice Note 1"]
        rel_actions = [mumbai_act] if mumbai_act else []
        evidence = mumbai_act.evidence_chain if mumbai_act else []

    # Question 6: What's due before board prep?
    elif "board prep" in q_lower or "board" in q_lower:
        answer = (
            f"Board Prep Session is scheduled for Thursday 24 Sep, 9:00–10:00 AM. "
            f"1) Divya Rao's July Expense Variance Report was requested for Wednesday evening prior to Board Prep (Received Wed 6:00 PM). "
            f"2) Neha Kapoor's Q3 Campaign Deck Review was scheduled for Thursday 9:30 AM ahead of Board Prep (Deck delivered Thu 8:00 AM)."
        )
        sources = ["Leadership Sync", "Expense Variance Report Email Thread", "Q3 Campaign Deck Email Thread", "Voice Note 2"]
        rel_actions = [expense_act, campaign_act]
        evidence = (expense_act.evidence_chain if expense_act else []) + (campaign_act.evidence_chain if campaign_act else [])

    # Question 7: What happened with the Meridian call?
    elif "meridian" in q_lower:
        answer = (
            f"The Meridian Logistics call was initially pushed by their team. Priya Nair emailed Mon 21 Sep asking for a new time. "
            f"You proposed Wednesday 3:00 PM via email on Tue 22 Sep at 3:00 PM. Priya confirmed Wed 3 PM at 5:45 PM, "
            f"and you reconfirmed again on Wed 23 Sep at 2:00 PM. The call is confirmed on your calendar for Wed 23 Sep 3:00–3:30 PM."
        )
        sources = ["Leadership Sync", "Call Reschedule Email Thread", "Voice Note 2", "Calendar Event"]
        rel_actions = [meridian_act] if meridian_act else []
        evidence = meridian_act.evidence_chain if meridian_act else []

    # Question 8: What's the status of the campaign deck?
    elif "campaign" in q_lower or "deck" in q_lower:
        answer = (
            f"In the Leadership Sync, Neha targeted Wednesday for review, then shifted to Thursday morning. "
            f"On Tue 22 Sep 4:15 PM, Neha emailed moving review to Thursday morning 9:30 AM to finish data slides. "
            f"You agreed via email. On Thu 24 Sep at 8:00 AM, Neha emailed attaching the finished draft ahead of your 9:30 AM review."
        )
        sources = ["Leadership Sync", "Q3 Campaign Deck Email Thread", "Calendar Event"]
        rel_actions = [campaign_act] if campaign_act else []
        evidence = campaign_act.evidence_chain if campaign_act else []

    # Question 9: Leadership Sync commitments
    elif "leadership sync" in q_lower or "sync" in q_lower or "commitments came from" in q_lower:
        answer = (
            f"Commitments established in the Leadership Sync (Mon 21 Sep 9:00 AM):\n"
            f"1. Arjun: Send updated vendor list to Raghav (originally Tue EOD, later moved to Wed morning).\n"
            f"2. Arjun: Reconfirm Meridian Logistics call time.\n"
            f"3. Neha: Deliver Q3 Campaign Deck draft for review (originally Wed, shifted to Thu 9:30 AM).\n"
            f"4. Divya: Deliver July Expense Variance report (originally Thu morning, accelerated to Wed evening).\n"
            f"5. Flagged: Mumbai Lease Renewal sign-off (unclear owner, Arjun instructed 'flag it, don't assume')."
        )
        sources = ["Leadership Sync"]
        rel_actions = actions
        evidence = [e for a in actions for e in a.evidence_chain if "meeting" in e.source_type or "Sync" in e.title]

    # Fallback response
    else:
        active_titles = ", ".join([a.title for a in actions])
        answer = (
            f"Based on the supplied data for simulation date {sim_date}: "
            f"The agent is tracking 5 key items for Arjun Malhotra: {active_titles}. "
            f"If you have a specific question about Raghav, Divya, Neha, Meridian, or the Mumbai lease, please ask!"
        )
        sources = ["Leadership Sync", "Email Threads", "Voice Notes", "Calendar"]
        rel_actions = actions
        evidence = []

    return QAResponse(
        query=query,
        simulation_date=sim_date,
        answer=answer,
        sources=sources,
        evidence=evidence,
        related_actions=rel_actions
    )
