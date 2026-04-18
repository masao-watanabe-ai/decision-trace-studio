# Decision Trace Studio — Demo Speaker Notes (English)

---

## What This Demo Needs to Land

One idea. Say it clearly, early, and repeat it at the end:

> **"You can design the structure of decisions, run it, see the impact of changes, and improve it — all in one place."**

This is not a demo of AI making better predictions. It's a demo of humans building a system for making better decisions — and having the infrastructure to prove it's working.

The scenario is a call center. The narrative arc is: *here's the logic → here's it running → here's what changes when you improve it.*

Total runtime: 3 minutes.

---

## 30-Second Cold Open

> *(Say this before showing the screen. Make eye contact.)*

"Imagine you run a call center handling hundreds of contacts a day. You have rules: VIP customers get priority. If someone mentions a refund above a certain amount and uses legal language, escalate. If it's a complaint, a human has to handle it."

"Those rules exist somewhere — usually in a policy doc no one reads, or in the heads of your most experienced agents. They're never tested. You don't know if they're consistent. You can't measure whether a change made things better or worse."

"Decision Trace Studio fixes that. It's a studio for designing your decision logic as a flow, running it against scenarios, and continuously improving it. Let me show you in three minutes."

---

## 3-Minute Run Sheet

| Time | Section | Goal |
|---|---|---|
| 0:00–0:30 | Design | Show the decision structure |
| 0:30–1:10 | Simulate + Trace | Run the flow, show the audit trail |
| 1:10–1:50 | Compare | Show how changes are measured |
| 1:50–2:40 | Improve | Accept a suggestion, close the loop |
| 2:40–3:00 | Close | Land the cycle, invite questions |

---

## Section-by-Section Speaker Notes

---

### [Design] Show the decision structure (0:00–0:30)

**UI Actions:**
- Studio is open on the Design tab
- Press **`▶ Demo`** in the top-right header to start the guided walkthrough
- Click the **Refund + Legal Risk** node to open the detail panel on the right
- Point to the node type badge ("Boundary") and the condition/action fields

**Talk Track:**

"This is the call center decision flow. Four nodes."

"Top-left: VIP Fast Track. If a customer has a VIP flag, they get routed to priority handling immediately. Below that: Refund + Legal Risk. This one is a Boundary node — it catches cases where the refund amount exceeds a threshold *and* the customer used legal language. When that fires, the action isn't automated handling — it's escalation."

"A Boundary is a line in the sand. Cross it, and the behavior changes. That's a precise statement about how your operation works."

"Look at the right panel — condition, action, priority. Everything that was implicit is now explicit. Versioned. Testable."

---

### [Simulate] Run the flow, show the audit trail (0:30–1:10)

**UI Actions:**
- Switch to the Simulate tab (Demo Step 2)
- Click **Generate Scenarios** — show the list that appears
- Click **Run All Scenarios**
- Once results appear, click the **Trace** link on any scenario row

**Talk Track:**

"Switch to Simulate. Click Generate Scenarios."

"The system creates test cases for this flow — a VIP customer, a refund request with legal language, a complaint, a routine inquiry. These are the kinds of inputs your flow will face in production."

"Run all of them."

"Each scenario walks through every node. The path taken, every condition evaluated, every action triggered — all recorded."

"Click Trace on this one."

*(navigate to Trace)*

"This is the audit trail. Step by step — which node was evaluated, what condition was checked, what happened. You can answer the question *why did this decision happen* at any point in the future. That's not just useful for debugging. It's how you demonstrate accountability when something goes wrong."

---

### [Compare] Show how changes are measured (1:10–1:50)

**UI Actions:**
- Switch to the Compare tab (Demo Step 4)
- Show the Before / After column layout
- *(Note: Before data only at this point — explain that After will appear once Improve runs)*
- Describe the layout and point to where diffs will appear

**Talk Track:**

"Compare tab. This is where operational confidence comes from."

"After you change a flow and re-run simulation, this view shows you Before and After side by side. Green means the outcome for that scenario improved. Red means it changed — worth reviewing. Unchanged scenarios stay neutral."

"Here's why this matters: when you improve a flow by intuition alone, you often don't know what else you've affected. Maybe fixing one edge case breaks another. Compare makes that visible before anything goes to production."

"We don't have an After yet — we haven't made any changes. Let's do that now. Then we'll come back here and see exactly what moved."

---

### [Improve] Accept a suggestion, close the loop (1:50–2:40)

**UI Actions:**
- Switch to Improve tab (Demo Step 5)
- Click **Generate Suggestions** — show the suggestion list
- Read one suggestion aloud (e.g., a new Boundary node for Fallback cases)
- Click **Approve & Apply to Flow**
- Switch to Design tab — show the new node has appeared
- Switch back to Simulate — click Run All Scenarios (Demo Step 7)
- Switch to Compare — show the Before/After diff

**Talk Track:**

"Improve tab. Click Generate Suggestions."

"The system analyzed the simulation results — it found cases that fell through to Fallback when they could have been handled more precisely. It's suggesting a new Boundary node, with a condition and action already pre-filled."

"Take a look. If it makes sense — approve it."

*(click Approve & Apply to Flow)*

"Switch to Design. The node is there. The flow has been updated."

"Now re-run simulation—"

*(Run All Scenarios)*

"—and go back to Compare."

"Here's your Before. Here's your After. The scenarios that were falling to Fallback are now being caught by the new Boundary. Green. That's the effect of one approved suggestion, measured."

"Design. Simulate. Compare. Improve. The loop is closed."

---

### [Close] Land the cycle, invite questions (2:40–3:00)

**UI Actions:**
- Click the **"Done"** button on the Guided Demo panel to close it
- Leave the Design tab visible as you wrap up

**Talk Track:**

"Design. Simulate. Compare. Improve. One studio. One cycle."

"The underlying principle is simple: your decision logic should be documented, testable, and improvable — the same way your code is. Most organizations don't have that. Their decision logic is scattered across docs, tribal knowledge, and gut feel. This studio gives it a home."

"AI is in the loop — for generating scenarios, surfacing improvement ideas. But the decisions are yours. You design the rules. You approve the changes. Every outcome has a trace."

"That's Decision Trace Studio. Happy to go deeper on any part — what would be most useful?"

---

## Anticipated Questions & Responses

| Question | Response |
|---|---|
| Is AI making the decisions here? | No. AI assists with scenario generation and surfacing suggestions — but the decision logic is designed and approved by you. Think of AI as a signal; this studio is where you decide what to do with that signal. |
| Is this connected to live data? | The demo runs on in-memory data. In production, you'd feed in real contact data and run simulation against your actual flow. The architecture is REST-based so integration is straightforward. |
| How complex can the flows get? | As complex as you can model with nodes and edges. We currently support four node types: Decision, Boundary, Human Gate, and Fallback. Branching, priority ordering, and multi-condition routing are all supported. |
| How many versions can you compare? | Compare shows the most recent Before / After pair. Full version history and multi-version comparison are on the roadmap. |
| How long do Traces persist? | In the demo it's in-memory — resets on restart. In production this would persist to a database, giving you a permanent audit log. |
| What does Human Gate actually do? | Any scenario that hits a Human Gate node gets routed to `human_review` — hardcoded, no automation. It's a deliberate override: this decision should never be made by a machine. |
| Can this integrate with existing systems? | The backend is FastAPI with a clean REST API. You can push scenarios in from any system and pull decision results back out. The flow logic stays in the studio; execution can be triggered externally. |

---

## Pre-Demo Setup Checklist

- [ ] Backend running: `uvicorn app.main:app --reload`
- [ ] Frontend running: `npm run dev` → open `http://localhost:5173`
- [ ] Browser zoom set to ~90% so full layout is visible without scrolling
- [ ] Run simulation once before the demo (creates Before data for Compare)
- [ ] Generate at least one suggestion in Improve so it's ready to approve live
- [ ] Start with Guided Demo off — press `▶ Demo` when you're ready to begin
- [ ] Open Trace once to confirm it loads correctly
