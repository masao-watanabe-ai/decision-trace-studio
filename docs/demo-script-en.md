# Decision Trace Studio — Demo Script (English)

---

## One-Liner

**Decision Trace Studio** is a studio for designing, running, comparing, and improving decision flows — so you can own the logic behind every action your operations take.

---

## 1-Minute Demo Script

---

"This is Decision Trace Studio. In one sentence: it lets you design your decision-making logic as a flow, run it against real scenarios, and improve it continuously."

"Look at the Design tab. We have a call center flow. VIP customers get fast-tracked. Requests with legal language hit a risk boundary. Complaints get escalated to a human. Each rule is a node — visible, editable, versioned."

"Switch to Simulate. Generate scenarios, run them all. Every path through the flow is recorded. You can click Trace on any row to see exactly why a decision was made."

"Now the key part: Improve. The studio analyzes your simulation results and suggests changes — adding a boundary node, adjusting priorities. Approve one, and it's reflected in the flow immediately."

"This isn't an AI making decisions for you. It's a studio for designing the structure of decisions — and continuously raising its quality."

---

## 3-Minute Demo Script

---

### Opening (~20 seconds)

"Today I want to show you something a bit different from the usual AI tools."

"Most AI tools are great at surfacing signals — 'this customer might churn,' 'this request looks risky.' But in any real operation, someone still has to decide: *what do we actually do about it?* That's a Decision. And that Decision — the logic behind it, the criteria, the actions — often lives in someone's head, undocumented and untested."

"Decision Trace Studio is built for exactly that problem. It's a studio for designing how your organization makes decisions, verifying those decisions through simulation, and improving them over time. Let me show you."

---

### Design (~30 seconds)

"We're starting in the Design tab. This is a call center decision flow."

"Four types of nodes. A **Decision** node evaluates a condition and routes to an action. A **Boundary** node marks a threshold — cross it, and you trigger a different response. A **Human Gate** forces human review, no matter what. And a **Fallback** catches anything that didn't match."

"Click on the Refund + Legal Risk node. Condition: the refund amount is above a threshold *and* the customer used legal language. Action: escalate. This is a boundary — once you cross it, the flow doesn't route to automation. It routes to a person."

"This right panel is your decision structure. What was implicit — living in a policy doc or someone's tribal knowledge — is now explicit, testable, and versioned."

---

### Simulate (~30 seconds)

"Let's run it. Switch to the Simulate tab."

"Click Generate Scenarios. The system creates test cases for this flow — a VIP customer, a high-value refund with legal language, a complaint, a routine inquiry. These represent the space of inputs your flow will encounter."

"Run all scenarios. Each one walks through the flow, and every path, every node evaluation, every resulting action is recorded."

"Click Trace on any row. This is the step-by-step audit trail — every node evaluated, the condition that fired, the action it triggered. You now have a precise answer to the question: *why did this decision happen?* That's not just useful for debugging. That's accountability."

---

### Compare (~30 seconds)

"Here's Compare. This is where operational confidence comes from."

"After you change a flow — add a node, shift a priority — you re-run simulation and come here. Before and After are shown side by side. Green means a scenario's outcome improved. Red means it changed in a way you should check. Gray means it was unaffected."

"When you improve a flow intuitively, you don't always know what else you've changed. Compare makes the blast radius visible before you ship it. You can verify the intent was correct and catch unintended effects — all before anything touches production."

---

### Improve (~30 seconds)

"Now let's generate improvements. Switch to Improve."

"Click Generate Suggestions. The system analyzes the simulation results — which scenarios fell through to Fallback, where inconsistencies appear — and proposes concrete changes. A new Boundary node with suggested condition and action, pre-filled."

"Review it. If it looks right, click Approve & Apply to Flow."

"Back in Design, the node is there. Run Simulate again, then go to Compare — and now you can see the measurable effect of that one improvement. Scenarios that were falling to Fallback are now handled by the new Boundary. That's the loop: design, simulate, compare, improve."

---

### Closing (~20 seconds)

"Design. Simulate. Compare. Improve. In one studio, in one cycle."

"The point isn't that AI is making decisions. The point is that *you* are — and this studio gives you the infrastructure to do it rigorously. Your decision logic is documented. Your changes are tested. Your improvements are verified. And every decision has a trace."

"Happy to go deeper on any of this. Thanks for your time."

---

## UI Actions Reference

| Moment | Action |
|---|---|
| Opening | Studio open on Design tab |
| Design | Click the Refund+Legal Risk node → show condition/action in the detail panel |
| Design | Point out node type badge (Boundary) |
| Simulate | Click Generate Scenarios → show scenario list → click Run All |
| Trace | Click Trace link on any scenario row → walk through evaluation steps |
| Compare | Show Before/After columns (run simulation twice before demo) |
| Improve | Click Generate Suggestions → read one aloud → click Approve & Apply to Flow |
| Improve | Switch to Design tab to show the new node |
| Closing | Click the Guided Demo "Done" button to exit |

**Pre-Demo Checklist**

- Run simulation once before the demo starts (to have Before data for Compare)
- Generate at least one suggestion in Improve so it's ready to approve
- Set browser zoom to ~90% so the full layout is visible
- Start the demo with Guided Demo off — launch it with the `▶ Demo` button when ready
