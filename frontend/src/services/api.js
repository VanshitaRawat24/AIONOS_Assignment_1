const API_BASE = 'http://localhost:8000/api';

export async function fetchDailyBrief(date = '2026-09-24') {
  try {
    const res = await fetch(`${API_BASE}/brief?date=${date}`);
    if (!res.ok) throw new Error('Failed to fetch brief');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchActions(date = '2026-09-24') {
  try {
    const res = await fetch(`${API_BASE}/actions?date=${date}`);
    if (!res.ok) throw new Error('Failed to fetch actions');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchSources() {
  try {
    const res = await fetch(`${API_BASE}/sources`);
    if (!res.ok) throw new Error('Failed to fetch sources');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchCalendar(date = '2026-09-24') {
  try {
    const res = await fetch(`${API_BASE}/calendar?date=${date}`);
    if (!res.ok) throw new Error('Failed to fetch calendar');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function askAgent(query, simulation_date = '2026-09-24') {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, simulation_date })
    });
    if (!res.ok) throw new Error('Failed to communicate with Q&A agent');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchActionEvidence(actionId, date = '2026-09-24') {
  try {
    const res = await fetch(`${API_BASE}/actions/${actionId}/evidence?date=${date}`);
    if (!res.ok) throw new Error('Failed to fetch action evidence');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
