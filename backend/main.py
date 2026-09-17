from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from models.schemas import DailyBrief, ActionItem, SourceItem, CalendarEvent, QARequest, QAResponse
from database.db import db

app = FastAPI(
    title="Executive Productivity Agent API",
    description="AI-Powered Executive Productivity Agent for Arjun Malhotra (VP Sales)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "agent": "Executive Productivity Agent",
        "user": "Arjun Malhotra (VP Sales)",
        "simulation_dates": ["2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25"]
    }

@app.get("/api/brief", response_model=DailyBrief)
def get_daily_brief(date: str = Query("2026-09-24", description="Simulation date (YYYY-MM-DD)")):
    return db.get_brief(date)

@app.get("/api/actions", response_model=List[ActionItem])
def get_all_actions(date: str = Query("2026-09-24", description="Simulation date (YYYY-MM-DD)")):
    return db.get_actions(date)

@app.get("/api/actions/my-actions", response_model=List[ActionItem])
def get_my_actions(date: str = Query("2026-09-24")):
    return db.get_my_actions(date)

@app.get("/api/actions/waiting", response_model=List[ActionItem])
def get_waiting_actions(date: str = Query("2026-09-24")):
    return db.get_waiting_actions(date)

@app.get("/api/actions/unresolved", response_model=List[ActionItem])
def get_unresolved_actions(date: str = Query("2026-09-24")):
    return db.get_unresolved_actions(date)

@app.get("/api/actions/overdue", response_model=List[ActionItem])
def get_overdue_actions(date: str = Query("2026-09-24")):
    return db.get_overdue_actions(date)

@app.get("/api/sources", response_model=List[SourceItem])
def get_sources():
    return db.sources

@app.get("/api/calendar", response_model=List[CalendarEvent])
def get_calendar(date: str = Query("2026-09-24")):
    return db.get_calendar(date)

@app.post("/api/chat", response_model=QAResponse)
def chat_with_agent(request: QARequest):
    return db.ask(request.query, request.simulation_date)

@app.get("/api/actions/{action_id}/evidence", response_model=ActionItem)
def get_action_evidence(action_id: str, date: str = Query("2026-09-24")):
    action = db.get_evidence(action_id, date)
    if not action:
        raise HTTPException(status_code=404, detail="Action item not found")
    return action

@app.post("/api/rebuild")
def rebuild_pipeline():
    db.rebuild()
    return {"message": "Pipeline rebuilt successfully", "actions_count": len(db.raw_actions)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
