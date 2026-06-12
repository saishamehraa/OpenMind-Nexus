# 🛡️ OpenMind Nexus: Multi-Agent Cognitive Risk Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](#)
[![Band Orchestration](https://img.shields.io/badge/Powered%20by-Band-violet.svg)](#)

Welcome to **OpenMind Nexus**, an enterprise-grade multi-agent orchestration platform that simulates high-stakes cognitive risk monitoring and misinformation defense using **Band** as the coordination infrastructure.

## 🌟 What is OpenMind Nexus?
Originally designed as a user-controlled transparency layer, OpenMind has evolved into **Nexus**: a sophisticated collaborative multi-agent system. 
When a suspicious viral article, social media post, or internal message enters the system, a suite of specialized AI agents collaboratively analyze it in real-time within a secure Band room, culminating in a human-oversight dashboard for final escalations.

### 🤖 The Multi-Agent Ecosystem
- **Content Intake Agent**: Parses raw text, extracts metadata, and initiates the workflow.
- **Cognitive Bias Agent**: Scans for manipulation patterns, emotional framing, and cognitive distortions.
- **Verification Agent**: Cross-references source credibility and factual consistency.
- **Echo Chamber Agent**: Calculates polarization risk and audience susceptibility.
- **Explainability Agent**: Synthesizes the reasoning chain into a transparent summary and recommends escalation or archiving.

## 🚀 Getting Started

**Start Here:**
1. **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 2 minutes
2. **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** - What's been built

### Installation
1. Clone the repository
2. Install dependencies: `pnpm install` (or `npm install`)
3. Run the development server: `npm run dev`
4. Navigate to the **Orchestration** tab to see the agents in action!

## 📖 Documentation Index

### Core Documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** - Complete feature list and summary

### Technical Documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and technical details
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - The pivot to the Multi-Agent architecture

### Deployment & Setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide

### Hackathon Specific
- **[HACKATHON_CHECKLIST.md](./HACKATHON_CHECKLIST.md)** - Pre-demo checklist
- **[DEMO_SCRIPT.md](./DEMO_SCRIPT.md)** - Guide for pitching OpenMind Nexus

## 🎨 Legacy Features included in Nexus
- **User-Controlled Feed**: Adjust between Educational vs Entertainment, Agreeable vs Opposing views.
- **Transparency Layer**: Bias scores, Trust ratings, Recommendation explanations.
- **Invisible Influence Visualization**: Echo chamber detection and real-time analytics dashboard.

## 🏗️ Technology Stack

**Frontend:**
- React 18.3.1 (TypeScript)
- Tailwind CSS v4
- React Router 7
- Lucide React

**Orchestration Infrastructure:**
- Simulated Band Client Integration (`src/services/bandOrchestrator.ts`)

**Backend (Production Setup Ready):**
- Express.js, MongoDB Atlas
- **Hackathon Multi-Provider AI Strategy**:
  1. **Tier 1 (Sponsor)**: AI/ML API (`meta-llama/Llama-3-8b-chat-hf`)
  2. **Tier 2 (Sponsor)**: Featherless AI (`meta-llama/Meta-Llama-3-8B-Instruct`)
  3. **Tier 3 (Fallback)**: OpenRouter / Gemini API
*(The backend gracefully cascades across these providers to ensure 100% uptime during judging)*

## 🤝 Contributing
This is a hackathon project, but we welcome contributions!
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License
MIT License - see LICENSE file ![LICENSE](./LICENSE)

---

**Made with 🧠 to fight filter bubbles and protect cognitive security.**
