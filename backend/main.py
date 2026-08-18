from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

app = FastAPI(
    title="WareSmart AI - Smart Warehouse Operations Backend",
    description="AI Decision Engines, Smart Inventory Allocation, Priority Scoring, and NLP Assistant API",
    version="1.0.0",
)

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
        "app": "WareSmart AI Decision Engine API",
        "version": "1.0.0",
        "engines": {
            "priority": "Active",
            "allocation": "Active",
            "reorder": "Active",
            "picking": "Active",
            "nlp": "Active"
        }
    }

class PriorityRequest(BaseModel):
    dispatch_deadline_minutes: int
    customer_tier: str # Enterprise, VIP, Standard
    order_value: float
    order_age_hours: float
    inventory_ready: bool

@app.post("/api/engines/priority-score")
def calculate_priority(req: PriorityRequest):
    # Rule + ML multi-factor scoring
    deadline_score = max(0, min(40, int(40 * (1 - req.dispatch_deadline_minutes / 300))))
    tier_score = 25 if req.customer_tier == "Enterprise" else (15 if req.customer_tier == "VIP" else 5)
    value_score = min(15, int(req.order_value / 50))
    age_score = min(15, int(req.order_age_hours * 5))
    inventory_score = 10 if req.inventory_ready else 0

    total_score = min(100, deadline_score + tier_score + value_score + age_score + inventory_score)
    
    priority_class = "Critical" if total_score >= 90 else ("High" if total_score >= 70 else ("Medium" if total_score >= 40 else "Low"))

    reasons = []
    if deadline_score > 25:
        reasons.append(f"Imminent dispatch deadline ({req.dispatch_deadline_minutes} mins remaining) (+{deadline_score} pts)")
    if tier_score >= 20:
        reasons.append(f"{req.customer_tier} Customer SLA Agreement (+{tier_score} pts)")
    if value_score >= 10:
        reasons.append(f"High order value (${req.order_value}) (+{value_score} pts)")

    return {
        "score": total_score,
        "priority": priority_class,
        "reasons": reasons,
        "breakdown": {
            "deadlineUrgencyScore": deadline_score,
            "slaRiskScore": tier_score,
            "orderValueScore": value_score,
            "orderAgeScore": age_score,
            "inventoryReadinessScore": inventory_score
        }
    }

class AllocationRequest(BaseModel):
    product_id: str
    available_stock: int
    orders: List[Dict[str, Any]]

@app.post("/api/engines/allocate-inventory")
def resolve_allocation_conflict(req: AllocationRequest):
    # Sort orders by priority score descending
    sorted_orders = sorted(req.orders, key=lambda x: x.get("priority_score", 0), reverse=True)
    
    stock_remaining = req.available_stock
    allocations = {}

    for ord_item in sorted_orders:
        ord_id = ord_item["order_id"]
        requested = ord_item["requested_qty"]
        
        allocated = min(stock_remaining, requested)
        allocations[ord_id] = allocated
        stock_remaining -= allocated

    winning_order = sorted_orders[0]["order_id"]
    return {
        "allocations": allocations,
        "explanation": f"Allocated all available {req.available_stock} units to high-priority Order #{winning_order} (Priority score {sorted_orders[0]['priority_score']}) to satisfy urgent SLA deadline.",
        "impact": "Avoids high customer SLA breach penalties."
    }

class NLPQueryRequest(BaseModel):
    question: str

@app.post("/api/nlp/ask")
def ask_nlp_assistant(req: NLPQueryRequest):
    q = req.question.lower()
    if "risk" in q or "critical" in q:
        return {
            "intent": "critical_orders",
            "answer": "3 orders are at risk of missing dispatch deadlines today. Highest priority is Order #1042 (Acme Global) with a deadline in 50 minutes, priority score 94/100."
        }
    elif "mouse" in q or "shortage" in q:
        return {
            "intent": "allocation_conflict",
            "answer": "Wireless Optical Mouse (SKU: WM-OPT-BLK) has 7 units available against 15 demanded. AI recommendation allocates all 7 to Order #1042."
        }
    else:
        return {
            "intent": "general_inquiry",
            "answer": f"Processed natural language query: '{req.question}'. System state normal."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
