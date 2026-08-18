# 🚀 WareSmart AI — Smart Warehouse Operations Platform

An enterprise-grade, AI-powered Smart Warehouse Operations & Order Fulfillment System. WareSmart AI transforms standard inventory tracking into an active **Exception → Decision → Resolution** decision platform.

---

## ✨ Features & AI Engines

1. **AI Operations Center**: Real-time operational health metrics, critical SLA risk alerts, and automated explainable resolution recommendations.
2. **Smart Priority Scoring Engine**: Multi-factor priority score (0–100) taking into account dispatch deadline urgency, customer tier SLA, order value, inventory readiness, and order age.
3. **Smart Inventory Allocation Engine**: Resolves inventory contention when multiple orders compete for limited stock (e.g., 7 units available vs 15 requested). Features full explainable rationale, manager Approve/Override controls, reservation updates, and audit logging.
4. **Smart Reorder Engine**: Automated safety stock calculation: `(Daily Demand × Lead Time) + Safety Stock - Current Available`.
5. **Picking Route & TSP Optimizer**: Nearest-neighbor Aisle Route optimization reducing picker travel time by 39% (`A1 -> C3 -> B7 -> A5 -> B2` optimized to `A1 -> A5 -> B2 -> B7 -> C3`).
6. **Picking Bottleneck Heatmap**: Zone-by-zone velocity tracking & automated picker workload redistribution (Zone B 65% slowdown detection).
7. **Quality Check & Auto-Exception Trigger**: 5-point inspection checklist with instant exception creation on failure.
8. **WareSmart AI NLP Assistant**: Natural language query interface answering questions such as *"What orders are at risk today?"*, *"Why was Order #1042 prioritized?"*, and *"How should I handle the wireless mouse shortage?"*.
9. **Hackathon Demo Scenarios Bar**: Built-in 1-click demo scenario buttons for seamless live judging presentations.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic, SQLAlchemy
- **Data Engine**: SQLite / PostgreSQL compatible schema with high-fidelity mock fallback

---

## ⚡ Quick Start & Running Locally

### 1. Run the Web Application (Frontend)
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Run the FastAPI Backend (Optional)
```bash
cd backend

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI Uvicorn Server
python main.py
```
FastAPI Interactive API Docs will be available at `http://localhost:8000/docs`.

---

## 🎯 Hackathon Demo Scenarios

Use the top **Hackathon Demo Scenarios Bar** in the web app:

- **Scenario 1 (Inventory Conflict)**: Wireless Mouse (7 units available vs 15 requested). System prioritizes Order #1042 (Score 94) over Order #1047 (Score 62).
- **Scenario 2 (Smart Reorder)**: Triggers reorder recommendation with exact daily burn rate + lead time math.
- **Scenario 3 (Zone B Bottleneck)**: Applies TSP route sequence optimization (18.5 min -> 11.2 min) and reassigns pickers to Zone B.
- **Scenario 4 (QC Exception)**: Simulates Quantity Mismatch exception and triggers replenishment runner.
- **Scenario 5 (Ask AI Assistant)**: Opens WareSmart Assistant with pre-populated natural language queries.
