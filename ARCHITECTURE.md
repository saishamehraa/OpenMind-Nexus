# OpenMind Nexus - System Architecture & Technical Documentation

## 📐 System Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + Tailwind CSS)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Orchestration│ │  Feed    │  │   Bias   │  │ Insights │       │
│  │ Dashboard  │  │  View    │  │ Detector │  │   View   │       │
│  └────────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                   BAND ORCHESTRATION LAYER                      │
│                (src/services/bandOrchestrator.ts)               │
│                                                                 │
│                 ┌──────────────────────┐                        │
│                 │   Transport Layer    │                        │
│                 └─────────┬────────────┘                        │
│                           │                                     │
│         ┌─────────────────┴──────────────────┐                  │
│         │                                    │                  │
│  [Development Mode]                   [Production Mode]         │
│  → Local Event Bus                    → Band Rooms API          │
│  (Hackathon Fallback)                 (Live Integration)        │
├─────────────────────────────────────────────────────────────────┤
│                      MULTI-AGENT ECOSYSTEM                      │
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐  │
│  │ Content │  │Cognitive│  │ Verifi- │  │ Echo    │  │Explain│  │
│  │ Intake  │  │  Bias   │  │ cation  │  │ Chamber │  │ability│  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └───────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🤖 The Multi-Agent Workflow

Our architecture shifted from a monolithic API approach to a decoupled Multi-Agent system coordinated via Band.

### The Flow
1. **Trigger**: User submits text via the Orchestration Dashboard.
2. **Intake**: `ContentIntakeAgent` extracts metadata and posts the initial structured payload to the Band Orchestrator.
3. **Simultaneous Analysis**: 
   - `CognitiveBiasAgent` analyzes the text for psychological manipulation.
   - `VerificationAgent` checks domain and source credibility.
   - `EchoChamberAgent` calculates polarization risk.
4. **Shared Context**: All agents asynchronously post their JSON findings back to the Band Orchestrator.
5. **Synthesis**: The `ExplainabilityAgent` subscribes to the Band Room, aggregates the findings, formulates a human-readable reasoning trace, and determines if escalation is necessary.
6. **Oversight**: The Dashboard UI listens to the Orchestrator and renders the live chat logs and final Human Oversight Panel.

## 🗄️ Extending the Agent System
To add a new agent, you simply create a new class in `src/agents/` that subscribes/posts to the `bandOrchestrator`. Because Band acts as the central communication bus, you do not need to modify the internal logic of the existing agents.

## 🔌 API Layer (Legacy / Analytics)
While the core analysis now uses the Multi-Agent system, the legacy feed and analytics still utilize the Express.js backend (if configured) for data persistence.

*(Refer to DEPLOYMENT.md for setting up the MongoDB backend)*
