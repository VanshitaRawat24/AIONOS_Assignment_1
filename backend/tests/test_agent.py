import pytest
import sys
from pathlib import Path

# Add backend directory to path
backend_path = Path(__file__).parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from database.db import db
from models.schemas import ActionItem

def test_1_vendor_list_arjun_commitment():
    """Test 1: Vendor list is identified as an Arjun commitment."""
    actions = db.get_actions("2026-09-21")
    vendor_act = next(a for a in actions if a.id == "vendor-list")
    assert vendor_act.owner == "Arjun Malhotra"
    assert vendor_act.category == "Commitment"

def test_2_vendor_list_deduplication():
    """Test 2: Vendor list duplicates from meeting + email + voice note become one action."""
    actions = db.get_actions("2026-09-24")
    vendor_actions = [a for a in actions if a.id == "vendor-list"]
    assert len(vendor_actions) == 1
    
    act = vendor_actions[0]
    # Check that sources list contains meeting, email, and voice note
    sources_text = " ".join(act.sources_summary).lower()
    assert "sync" in sources_text or "meeting" in sources_text
    assert "email" in sources_text
    assert "voice note" in sources_text

def test_3_expense_report_waiting_on_divya():
    """Test 3: Expense report is identified as waiting on Divya."""
    actions = db.get_actions("2026-09-21")
    expense_act = next(a for a in actions if a.id == "expense-report")
    assert expense_act.owner == "Divya Rao"
    assert expense_act.status == "Waiting on Others"

def test_4_expense_report_completion_after_wed_6pm():
    """Test 4: Expense report becomes completed after Wed 6 PM evidence."""
    # Before Wed 6 PM (e.g. Sep 22) -> Waiting on Others
    actions_tue = db.get_actions("2026-09-22")
    expense_tue = next(a for a in actions_tue if a.id == "expense-report")
    assert expense_tue.status == "Waiting on Others"
    
    # After Wed 6 PM (e.g. Sep 24) -> Completed
    actions_thu = db.get_actions("2026-09-24")
    expense_thu = next(a for a in actions_thu if a.id == "expense-report")
    assert expense_thu.status == "Completed"
    assert expense_thu.completed_at is not None

def test_5_campaign_deck_review_timeline_shift():
    """Test 5: Campaign deck review changes from Wednesday to Thursday 9:30 AM."""
    actions = db.get_actions("2026-09-23")
    deck_act = next(a for a in actions if a.id == "campaign-deck")
    assert "Thursday" in deck_act.current_deadline or "9:30 AM" in deck_act.current_deadline
    assert deck_act.deadline_date == "2026-09-24"

def test_6_meridian_call_confirmed_wed_3pm():
    """Test 6: Meridian call is confirmed for Wednesday 3 PM."""
    actions = db.get_actions("2026-09-23")
    call_act = next(a for a in actions if a.id == "meridian-call")
    assert "Wednesday" in call_act.current_deadline and "3:00 PM" in call_act.current_deadline
    assert call_act.status == "Completed"

def test_7_mumbai_lease_unresolved_ownership():
    """Test 7: Mumbai lease is identified as unresolved ownership."""
    actions = db.get_actions("2026-09-24")
    lease_act = next(a for a in actions if a.id == "mumbai-lease")
    assert lease_act.ownership_status == "Unclear Ownership"
    assert lease_act.status == "Unclear Ownership"

def test_8_mumbai_lease_deadline_friday_25_sep():
    """Test 8: Mumbai lease deadline is Friday 25 Sep EOD."""
    actions = db.get_actions("2026-09-24")
    lease_act = next(a for a in actions if a.id == "mumbai-lease")
    assert "25 Sep" in lease_act.current_deadline or lease_act.deadline_date == "2026-09-25"

def test_9_never_assigns_facilities_without_confirmation():
    """Test 9: System NEVER assigns Mumbai lease ownership to Facilities without confirmation."""
    actions = db.get_actions("2026-09-24")
    lease_act = next(a for a in actions if a.id == "mumbai-lease")
    assert lease_act.owner != "Facilities"
    assert lease_act.owner == "Unclear ownership"
    assert "Facilities suggested" in lease_act.ownership_notes

def test_10_qa_returns_grounded_answers():
    """Test 10: Q&A returns grounded answers."""
    qa = db.ask("What did I promise Raghav?", "2026-09-24")
    assert "vendor list" in qa.answer.lower()
    assert "raghav" in qa.answer.lower()

def test_11_answers_expose_source_evidence():
    """Test 11: Answers expose source evidence."""
    qa = db.ask("What did I promise Raghav?", "2026-09-24")
    assert len(qa.sources) > 0
    assert any("sync" in s.lower() for s in qa.sources)
    assert any("email" in s.lower() for s in qa.sources)

def test_12_simulation_date_changes_status():
    """Test 12: Simulation date changes task status appropriately."""
    # Vendor List: Open on Sep 22, Overdue on Sep 24
    vendor_sep22 = next(a for a in db.get_actions("2026-09-22") if a.id == "vendor-list")
    vendor_sep24 = next(a for a in db.get_actions("2026-09-24") if a.id == "vendor-list")
    
    assert vendor_sep22.status == "Open"
    assert vendor_sep24.status == "Overdue"
