# 🧪 OpenMind Nexus: Demo Incidents

Use these sample text snippets during your live demo to prove to the judges that the agents dynamically respond to different severity levels, rather than just returning hardcoded outputs.

Copy and paste the **Input Text** into the Orchestration Dashboard.

---

## 🔴 Incident 1: High Risk (The "Information Integrity Incident")

**Goal**: The main event. Show the agents catching severe, highly-manipulative, and polarizing content that triggers an immediate escalation to a human reviewer.

**Input Text**:
> "URGENT EXPOSE: The absolute truth they are hiding from you! The recent so-called 'updates' to the network are actually a backdoor designed to steal your data and completely destroy your privacy. You must feel the outrage—share this immediately before they take it down. We are the only ones telling you the truth, don't trust the mainstream narrative!"

**Expected Agent Outputs**:
- **Cognitive Bias**: `{ "biasScore": 4.8, "biases": ["Emotional Reasoning", "False Dilemma", "Polarizing Language"] }`
- **Verification**: `{ "trustScore": 1.5, "credibilityFlags": ["Highly emotive", "Urgency manipulation", "Conspiracy framing"] }`
- **Echo Chamber**: `{ "amplificationRisk": "high", "exposureConcentration": 92 }`
- **Human Oversight**: `[RECOMMENDATION: ESCALATE TO TRUST & SAFETY]`

---

## 🟡 Incident 2: Medium Risk (The Gray Area)

**Goal**: Show the system catching subtle bias or unverified claims that warrant monitoring, but not an immediate security escalation.

**Input Text**:
> "Everyone knows that the recent policy changes are a total disaster for small businesses. We are seeing unprecedented drops in engagement and if you don't switch your strategy right now, you will be left behind by the competition. Experts agree this is the worst decision made this year."

**Expected Agent Outputs**:
- **Cognitive Bias**: `{ "biasScore": 3.1, "biases": ["Bandwagon Effect", "Hasty Generalization"] }`
- **Verification**: `{ "trustScore": 3.0, "credibilityFlags": ["Missing specific attribution", "Vague 'experts agree' claim"] }`
- **Echo Chamber**: `{ "amplificationRisk": "moderate" }`
- **Human Oversight**: `[RECOMMENDATION: MONITOR]`

---

## 🟢 Incident 3: Low Risk (The Baseline)

**Goal**: Show the system correctly identifying safe, neutral information and choosing to **ARCHIVE** it rather than escalate.

**Input Text**:
> "Quarterly earnings reports were released today by several major tech firms. While revenue showed a 4% increase year-over-year, overall market growth remains steady according to the latest industry analysts. The next report is scheduled for Q3."

**Expected Agent Outputs**:
- **Cognitive Bias**: `{ "biasScore": 1.2, "biases": ["None detected (Balanced)"] }`
- **Verification**: `{ "trustScore": 4.8, "credibilityFlags": ["Neutral reporting", "Standard financial disclosure"] }`
- **Echo Chamber**: `{ "amplificationRisk": "low" }`
- **Human Oversight**: `[RECOMMENDATION: ARCHIVE]`
